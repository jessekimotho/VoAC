import { redirect } from '@sveltejs/kit';
import { hasStudioSession, studioAuthConfigured } from '$lib/server/studio/auth';

export async function load({ cookies, url }) {
	const isLogin = url.pathname === '/studio/login';
	const configured = studioAuthConfigured();
	const authenticated = hasStudioSession(cookies);

	if (!isLogin && (!configured || !authenticated)) {
		redirect(303, '/studio/login');
	}

	return {
		configured,
		authenticated
	};
}

