import { listPublishedPosts } from '$lib/server/posts';

export async function load() {
	const posts = await listPublishedPosts(13);
	const [featured, ...recent] = posts;

	return {
		featured,
		recent
	};
}

