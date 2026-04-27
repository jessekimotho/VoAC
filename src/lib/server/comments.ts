import { hasSupabaseServiceEnv } from './env';
import { getLocalComments } from './local-content';
import { createSupabaseAdmin } from './supabase';
import type { CommentNode } from './types';

type CommentRow = Omit<CommentNode, 'replies'>;

function buildTree(rows: CommentRow[]): CommentNode[] {
	const byId = new Map<string, CommentNode>();
	const roots: CommentNode[] = [];

	for (const row of rows) {
		byId.set(row.id, { ...row, replies: [] });
	}

	for (const comment of byId.values()) {
		if (comment.parent_id && byId.has(comment.parent_id)) {
			byId.get(comment.parent_id)?.replies.push(comment);
		} else {
			roots.push(comment);
		}
	}

	return roots;
}

export async function listApprovedComments(postId: string, slug: string) {
	if (!hasSupabaseServiceEnv) {
		return getLocalComments(slug);
	}

	const supabase = createSupabaseAdmin();
	const { data, error } = await supabase
		.from('comments')
		.select('id,post_id,parent_id,author_name,body,created_at')
		.eq('post_id', postId)
		.eq('status', 'approved')
		.order('created_at', { ascending: true });

	if (error) throw error;
	return buildTree((data ?? []) as CommentRow[]);
}

export async function createPendingComment(input: {
	postId: string;
	parentId: string | null;
	authorName: string;
	authorEmail: string | null;
	body: string;
}) {
	if (!hasSupabaseServiceEnv) {
		throw new Error('Comments need Supabase env vars before they can be saved.');
	}

	const supabase = createSupabaseAdmin();
	const { error } = await supabase.from('comments').insert({
		post_id: input.postId,
		parent_id: input.parentId,
		author_name: input.authorName,
		author_email: input.authorEmail,
		body: input.body,
		status: 'pending'
	});

	if (error) throw error;
}
