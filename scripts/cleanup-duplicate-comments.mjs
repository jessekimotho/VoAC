import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Load .env.local
try {
	const envContent = await readFile(join(process.cwd(), '..', '.env.local'), 'utf-8');
	for (const line of envContent.split('\n')) {
		const [key, ...valueParts] = line.split('=');
		if (key && valueParts.length) {
			process.env[key.trim()] = valueParts.join('=').trim();
		}
	}
} catch (err) {
	// .env.local might not exist, continue
}

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
	console.error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
	process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
	auth: { autoRefreshToken: false, persistSession: false },
	global: {
		fetch: (url, options = {}) =>
			fetch(url, { ...options, signal: AbortSignal.timeout(30000) })
	}
});

function normalizeContent(content) {
	if (!content) return '';
	return content
		.replace(/&#(\d+);/g, (_, code) => {
			try {
				return String.fromCodePoint(Number(code));
			} catch {
				return _;
			}
		})
		.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
			try {
				return String.fromCodePoint(parseInt(hex, 16));
			} catch {
				return _;
			}
		})
		.trim();
}

async function main() {
	const { data: comments, error } = await supabase
		.from('comments')
		.select('id,post_id,parent_id,author_name,body,created_at,status,source,wordpress_id')
		.order('created_at', { ascending: true });

	if (error) throw error;
	if (!comments?.length) {
		console.log('No comments found.');
		return;
	}

	console.log(`Fetched ${comments.length} comments.`);

	const groups = new Map();
	for (const comment of comments) {
		const key = `${comment.post_id}::${comment.author_name}::${normalizeContent(comment.body)}`;
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key).push(comment);
	}

	const duplicates = [];
	const toUpdate = [];
	const toDelete = [];

	for (const [key, group] of groups) {
		if (group.length <= 1) continue;

		// Keep the earliest comment; delete the rest.
		const [keep, ...rest] = group;
		duplicates.push({ key, count: group.length, keepId: keep.id, keepDate: keep.created_at });
		toDelete.push(...rest.map((c) => c.id));

		// If the kept comment body still contains HTML entities, decode them.
		const decodedBody = normalizeContent(keep.body);
		if (decodedBody !== keep.body) {
			toUpdate.push({ id: keep.id, body: decodedBody });
		}
	}

	if (!toDelete.length) {
		console.log('No duplicate comments found.');
		return;
	}

	console.log(`Found ${duplicates.length} duplicate groups (${toDelete.length} comments to remove).`);
	console.table(
		duplicates.slice(0, 10).map((d) => ({ key: d.key.slice(0, 80), count: d.count, keepDate: d.keepDate }))
	);
	if (duplicates.length > 10) console.log(`... and ${duplicates.length - 10} more.`);

	// Batch delete
	const { error: deleteError } = await supabase.from('comments').delete().in('id', toDelete);
	if (deleteError) throw deleteError;
	console.log(`Deleted ${toDelete.length} duplicate comments.`);

	// Update bodies to decode entities
	for (const { id, body } of toUpdate) {
		const { error: updateError } = await supabase.from('comments').update({ body }).eq('id', id);
		if (updateError) {
			console.error(`Failed to update comment ${id}:`, updateError.message);
		} else {
			console.log(`Updated comment ${id} body (decoded HTML entities).`);
		}
	}

	console.log('Cleanup complete.');
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
