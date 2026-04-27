import { createPendingComment } from '$lib/server/comments';
import { error, redirect } from '@sveltejs/kit';

export async function POST({ request, url }) {
	const form = await request.formData();
	const postId = String(form.get('postId') ?? '');
	const parentId = form.get('parentId') ? String(form.get('parentId')) : null;
	const authorName = String(form.get('authorName') ?? '').trim();
	const authorEmail = String(form.get('authorEmail') ?? '').trim() || null;
	const body = String(form.get('body') ?? '').trim();

	if (!postId || authorName.length < 2 || body.length < 3) {
		error(400, 'Please add your name and a comment.');
	}

	await createPendingComment({ postId, parentId, authorName, authorEmail, body });

	redirect(303, url.searchParams.get('returnTo') ?? request.headers.get('referer') ?? '/posts');
}
