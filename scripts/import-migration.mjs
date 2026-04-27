import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
	console.error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in web/.env.local');
	process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	},
	global: {
		fetch: (url, options = {}) =>
			fetch(url, {
				...options,
				signal: AbortSignal.timeout(30000)
			})
	}
});

const ROOT = join(process.cwd(), '..', 'migration_export', 'content');

function slugify(value) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function parseFrontmatter(raw) {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!match) return { metadata: {}, body: raw };

	const metadata = {};
	for (const line of match[1].split('\n')) {
		const separator = line.indexOf(':');
		if (separator === -1) continue;
		const key = line.slice(0, separator).trim();
		const value = line.slice(separator + 1).trim();
		try {
			metadata[key] = JSON.parse(value);
		} catch {
			metadata[key] = value;
		}
	}

	return { metadata, body: match[2].trim() };
}

function stripHtml(html) {
	return html
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

async function upsertCategory(name) {
	const slug = slugify(name);
	const { data, error } = await supabase
		.from('categories')
		.upsert({ name, slug }, { onConflict: 'slug' })
		.select('id')
		.single();

	if (error) throw error;
	return data.id;
}

async function upsertTag(name) {
	const slug = slugify(name);
	const { data, error } = await supabase
		.from('tags')
		.upsert({ name, slug }, { onConflict: 'slug' })
		.select('id')
		.single();

	if (error) throw error;
	return data.id;
}

async function importFile(filePath, postType) {
	const { metadata, body } = parseFrontmatter(await readFile(filePath, 'utf-8'));
	const categories = Array.isArray(metadata.categories) ? metadata.categories.filter(Boolean) : [];
	const tags = Array.isArray(metadata.tags) ? metadata.tags.filter(Boolean) : [];
	const primaryCategoryId = categories[0] ? await upsertCategory(categories[0]) : null;
	const excerpt = metadata.excerpt || stripHtml(body).slice(0, 220);
	const status = metadata.status === 'publish' ? 'published' : metadata.status === 'draft' ? 'draft' : 'archived';
	const publishedAt = metadata.date ? new Date(String(metadata.date).replace(' ', 'T')).toISOString() : null;

	const { data: post, error: postError } = await supabase
		.from('posts')
		.upsert(
			{
				title: metadata.title,
				slug: metadata.slug,
				excerpt,
				content_source: 'wordpress',
				content_html: body,
				status,
				post_type: postType,
				primary_category_id: primaryCategoryId,
				wordpress_source: metadata.source,
				original_url: metadata.originalUrl,
				published_at: status === 'published' ? publishedAt : null
			},
			{ onConflict: 'slug' }
		)
		.select('id')
		.single();

	if (postError) throw postError;

	for (const category of categories) {
		const categoryId = await upsertCategory(category);
		const { error } = await supabase
			.from('post_categories')
			.upsert({ post_id: post.id, category_id: categoryId }, { onConflict: 'post_id,category_id' });
		if (error) throw error;
	}

	for (const tag of tags) {
		const tagId = await upsertTag(tag);
		const { error } = await supabase
			.from('post_tags')
			.upsert({ post_id: post.id, tag_id: tagId }, { onConflict: 'post_id,tag_id' });
		if (error) throw error;
	}

	return { slug: metadata.slug, status, postType };
}

async function importDirectory(folder, postType) {
	const dir = join(ROOT, folder);
	const files = (await readdir(dir)).filter((file) => file.endsWith('.md'));
	const results = [];

	for (const file of files) {
		process.stdout.write(`Importing ${postType}: ${file} ... `);
		const result = await importFile(join(dir, file), postType);
		results.push(result);
		process.stdout.write(`${result.status}\n`);
	}

	return results;
}

try {
	const posts = await importDirectory('posts', 'post');
	const pages = await importDirectory('pages', 'page');

	console.log(`Imported ${posts.length} posts and ${pages.length} pages.`);
	console.log(`Published posts: ${posts.filter((post) => post.status === 'published').length}`);
} catch (error) {
	console.error('\nImport failed.');
	console.error(error);
	process.exit(1);
}
