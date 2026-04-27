import { hasSupabaseServiceEnv } from '$lib/server/env';

export async function load() {
	return {
		hasSupabaseServiceEnv
	};
}

