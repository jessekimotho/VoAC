import { listAllPublishedPosts } from '$lib/server/posts';

export async function load() {
	const posts = await listAllPublishedPosts();
	const [featured, ...recent] = posts;

	return {
		featured,
		recent,
		allPosts: posts
	};
}

