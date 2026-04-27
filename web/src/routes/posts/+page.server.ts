import { listAllPublishedPosts } from '$lib/server/posts';

export async function load() {
	return {
		posts: await listAllPublishedPosts()
	};
}

