import { hasStudioSession } from '$lib/server/studio/auth';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ cookies }) => {
	return {
		authenticated: hasStudioSession(cookies)
	};
};
