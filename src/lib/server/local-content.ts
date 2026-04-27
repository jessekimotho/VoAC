import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { BlogPost, CommentNode } from './types';

const MIGRATION_POSTS_DIR = join(process.cwd(), '..', 'migration_export', 'content', 'posts');

function parseFrontmatter(raw: string) {
	const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!match) {
		return { metadata: {}, body: raw };
	}

	const metadata: Record<string, unknown> = {};
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

function stripHtml(html: string) {
	return html
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function toPost(filename: string, raw: string): BlogPost {
	const { metadata, body } = parseFrontmatter(raw);
	const slug = String(metadata.slug ?? filename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''));
	const title = String(metadata.title ?? slug);
	const date = String(metadata.date ?? '');
	const categories = Array.isArray(metadata.categories) ? metadata.categories.map(String) : [];
	const tags = Array.isArray(metadata.tags) ? metadata.tags.map(String) : [];
	const text = stripHtml(body);

	return {
		id: slug,
		title,
		slug,
		excerpt: String(metadata.excerpt || text.slice(0, 180)),
		content_html: body,
		status: metadata.status === 'publish' ? 'published' : 'draft',
		post_type: 'post',
		featured: ['racist-capetown', 'stranded-in-capetown-int-airport', 'samburu-part-ii'].includes(slug),
		hero_image_url: null,
		published_at: date ? new Date(date.replace(' ', 'T')).toISOString() : null,
		author_name: String(metadata.author ?? 'VoAC'),
		category_name: categories[0] ?? null,
		category_slug: categories[0]?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ?? null,
		tags,
		original_url: String(metadata.originalUrl ?? '')
	};
}

let cachedPosts: BlogPost[] | null = null;

export async function getLocalPosts() {
	if (cachedPosts) return cachedPosts;

	const files = (await readdir(MIGRATION_POSTS_DIR)).filter((file) => file.endsWith('.md'));
	const posts = await Promise.all(
		files.map(async (file) => toPost(file, await readFile(join(MIGRATION_POSTS_DIR, file), 'utf-8')))
	);

	cachedPosts = posts
		.filter((post) => post.status === 'published')
		.sort((a, b) => {
			const aDate = a.published_at ? new Date(a.published_at).getTime() : 0;
			const bDate = b.published_at ? new Date(b.published_at).getTime() : 0;
			return bDate - aDate;
		});

	return cachedPosts;
}

export async function getLocalPostBySlug(slug: string) {
	const posts = await getLocalPosts();
	return posts.find((post) => post.slug === slug) ?? null;
}

export function getLocalComments(_slug: string): CommentNode[] {
	return [];
}

