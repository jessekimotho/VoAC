import { createClient } from '@supabase/supabase-js';
import { supabaseServiceRoleKey, supabaseUrl } from './env';

export function createSupabaseAdmin() {
	if (!supabaseUrl || !supabaseServiceRoleKey) {
		throw new Error('Supabase service env vars are missing.');
	}

	return createClient(supabaseUrl, supabaseServiceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	});
}

