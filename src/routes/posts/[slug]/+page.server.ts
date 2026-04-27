import { error } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';
import { listApprovedComments } from '$lib/server/comments';
import { getPublishedPost, listPublishedPosts } from '$lib/server/posts';
import { getStudioPost } from '$lib/server/studio/posts';
import { hasStudioSession } from '$lib/server/studio/auth';

export const load: ServerLoad = async ({ params, cookies }) => {
	const slug = params.slug;
	if (!slug) error(404, 'Post not found');

	const post = await getPublishedPost(slug);

	if (!post) {
		error(404, 'Post not found');
	}

	const [comments, studioPost] = await Promise.all([
		listApprovedComments(post.id),
		hasStudioSession(cookies) ? getStudioPost(post.id) : Promise.resolve(null)
	]);

	return {
		post,
		studioPost,
		authenticated: hasStudioSession(cookies),
		comments,
		canSubmitComments: true
	};
};
