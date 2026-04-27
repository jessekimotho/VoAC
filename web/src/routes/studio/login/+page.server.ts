import { fail, redirect } from '@sveltejs/kit';
import {
	clearStudioSession,
	createStudioSession,
	hasStudioSession,
	studioAuthConfigured,
	verifyStudioPassword
} from '$lib/server/studio/auth';

export async function load({ cookies }) {
	if (hasStudioSession(cookies)) redirect(303, '/studio');

	return {
		configured: studioAuthConfigured()
	};
}

export const actions = {
	login: async ({ request, cookies }) => {
		const form = await request.formData();
		const password = String(form.get('password') ?? '');

		if (!verifyStudioPassword(password)) {
			return fail(400, { message: 'That password did not work.' });
		}

		createStudioSession(cookies);
		redirect(303, '/studio');
	},
	logout: async ({ cookies }) => {
		clearStudioSession(cookies);
		redirect(303, '/studio/login');
	}
};
