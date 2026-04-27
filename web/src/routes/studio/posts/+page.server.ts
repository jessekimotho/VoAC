import { listStudioPosts } from '$lib/server/studio/posts';

export async function load() {
	return {
		posts: await listStudioPosts()
	};
}

