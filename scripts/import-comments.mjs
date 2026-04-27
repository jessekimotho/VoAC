import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';
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

function toIso(value) {
	if (!value) return new Date().toISOString();
	const parsed = new Date(String(value).replace(' ', 'T') + 'Z');
	return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function statusFor(comment) {
	return comment.approved === '1' ? 'approved' : comment.approved === 'spam' ? 'spam' : 'pending';
}

async function main() {
	const items = JSON.parse(
		await readFile(join(process.cwd(), '..', 'migration_export', 'data', 'all-items.json'), 'utf-8')
	);
	const commentedItems = items.filter((item) => item.comments?.length);

	const { data: posts, error: postsError } = await supabase.from('posts').select('id,slug');
	if (postsError) throw postsError;

	const postBySlug = new Map(posts.map((post) => [post.slug, post.id]));
	const { error: deleteError } = await supabase.from('comments').delete().eq('source', 'wordpress');
	if (deleteError) throw deleteError;

	let imported = 0;
	let skipped = 0;
	const seenComments = new Set();

	for (const item of commentedItems) {
		const postId = postBySlug.get(item.slug);
		if (!postId) {
			skipped += item.comments.length;
			continue;
		}

		const comments = [...item.comments].sort((a, b) => Number(a.parent || 0) - Number(b.parent || 0));
		const idMap = new Map();

		for (const comment of comments) {
			const commentKey = `${postId}-${comment.author || 'Anonymous'}-${comment.content || ''}-${comment.date}`;
			if (seenComments.has(commentKey)) {
				skipped += 1;
				continue;
			}
			seenComments.add(commentKey);
			const parentId = comment.parent && comment.parent !== '0' ? idMap.get(comment.parent) ?? null : null;
			const { data, error } = await supabase
				.from('comments')
				.insert({
					post_id: postId,
					parent_id: parentId,
					author_name: comment.author || 'Anonymous',
					author_email: comment.author_email || null,
					body: comment.content || '',
					status: statusFor(comment),
					source: 'wordpress',
					wordpress_id: comment.id,
					created_at: toIso(comment.date),
					updated_at: toIso(comment.date)
				})
				.select('id')
				.single();

			if (error) throw error;
			idMap.set(comment.id, data.id);
			imported += 1;
		}

		process.stdout.write(`Imported ${item.comments.length} comments for ${item.slug}\n`);
	}

	console.log(`Imported ${imported} WordPress comments.`);
	console.log(`Skipped ${skipped} comments with no matching post.`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
