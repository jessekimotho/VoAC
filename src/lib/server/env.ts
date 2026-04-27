import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const supabaseUrl = publicEnv.PUBLIC_SUPABASE_URL;
export const supabasePublishableKey = publicEnv.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const supabaseServiceRoleKey = privateEnv.SUPABASE_SERVICE_ROLE_KEY;
