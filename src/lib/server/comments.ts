import { createSupabaseAdmin } from './supabase';
import { buildCommentTree } from './utils';
import type { CommentNode } from './types';

type CommentRow = Omit<CommentNode, 'replies'>;

export async function listApprovedComments(postId: string) {
	const supabase = createSupabaseAdmin();
	const { data, error } = await supabase
		.from('comments')
		.select('id,post_id,parent_id,author_name,body,created_at')
		.eq('post_id', postId)
		.eq('status', 'approved')
		.order('created_at', { ascending: true });

	if (error) throw error;
	return buildCommentTree((data ?? []) as CommentRow[]);
}

export async function createPendingComment(input: {
	postId: string;
	parentId: string | null;
	authorName: string;
	authorEmail: string | null;
	body: string;
}) {
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
