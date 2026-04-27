import { listAllPublishedPosts } from '$lib/server/posts';

export async function load() {
	// Temporarily return empty data to test if Supabase is the issue
	return {
		featured: null,
		recent: [],
		allPosts: []
	};

	// Original code:
	// try {
	// 	const posts = await listAllPublishedPosts();
	// 	const [featured, ...recent] = posts;

	// 	return {
	// 		featured,
	// 		recent,
	// 		allPosts: posts
	// 	};
	// } catch (error) {
	// 	console.error('Error loading homepage:', error);
	// 	// Return empty arrays to prevent 500 error
	// 	return {
	// 		featured: null,
	// 		recent: [],
	// 		allPosts: []
	// 	};
	// }
}

