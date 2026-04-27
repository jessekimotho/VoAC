import { hasSupabaseServiceEnv } from '$lib/server/env';
import { listStudioPosts } from '$lib/server/studio/posts';

export async function load() {
	const posts = await listStudioPosts();

	return {
		hasSupabaseServiceEnv,
		counts: {
			total: posts.length,
			published: posts.filter((post) => post.status === 'published').length,
			draft: posts.filter((post) => post.status === 'draft').length,
			archived: posts.filter((post) => post.status === 'archived').length
		},
		recent: posts.slice(0, 6)
	};
}
