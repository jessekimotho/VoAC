import { hasStudioSession } from '$lib/server/studio/auth';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ cookies }) => {
	try {
		return {
			authenticated: hasStudioSession(cookies)
		};
	} catch (error) {
		console.error('Error in layout load:', error);
		return {
			authenticated: false
		};
	}
};
