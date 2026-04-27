import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import {
	createStudioSession,
	verifyStudioPassword
} from '$lib/server/studio/auth';

export async function POST({ request, cookies }: RequestEvent) {
	const { password } = await request.json();

	if (!verifyStudioPassword(password)) {
		return json({ message: 'That password did not work.' }, { status: 400 });
	}

	createStudioSession(cookies);
	return json({ success: true });
}
