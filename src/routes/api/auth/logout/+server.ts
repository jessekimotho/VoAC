import { json, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { clearStudioSession } from '$lib/server/studio/auth';

export async function POST({ cookies }: RequestEvent) {
	clearStudioSession(cookies);
	redirect(303, '/');
}
