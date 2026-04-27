import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { clearStudioSession } from '$lib/server/studio/auth';

export async function POST({ cookies }: RequestEvent) {
	clearStudioSession(cookies);
	return json({ success: true });
}
