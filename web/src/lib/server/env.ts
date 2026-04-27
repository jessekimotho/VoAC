import {
	PUBLIC_SUPABASE_PUBLISHABLE_KEY,
	PUBLIC_SUPABASE_URL
} from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const hasSupabasePublicEnv = Boolean(
	PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export const hasSupabaseServiceEnv = Boolean(
	PUBLIC_SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
);

export const supabaseUrl = PUBLIC_SUPABASE_URL;
export const supabasePublishableKey = PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const supabaseServiceRoleKey = SUPABASE_SERVICE_ROLE_KEY;

