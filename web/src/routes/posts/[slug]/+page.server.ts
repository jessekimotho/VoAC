import { error } from '@sveltejs/kit';
import { listApprovedComments } from '$lib/server/comments';
import { getPublishedPost, listPublishedPosts } from '$lib/server/posts';

export async function load({ params }) {
	const post = await getPublishedPost(params.slug);

	if (!post) {
		error(404, 'Post not found');
	}

	const [comments, related] = await Promise.all([
		listApprovedComments(post.id, post.slug),
		listPublishedPosts(4)
	]);

	return {
		post,
		comments,
		related: related.filter((item) => item.slug !== post.slug).slice(0, 3)
	};
}

