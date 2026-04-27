import { createSupabaseAdmin } from './supabase';
import { decodeHtmlEntities } from './utils';
import type { BlogPost } from './types';

const POST_SELECT =
	'id,title,slug,excerpt,content_html,status,post_type,featured,hero_image_url,published_at,original_url,profiles(display_name),categories!posts_primary_category_id_fkey(name,slug)';

type PostRow = {
	id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	content_html: string;
	status: string;
	post_type: string;
	featured: boolean;
	hero_image_url: string | null;
	published_at: string | null;
	original_url: string | null;
	profiles?: { display_name: string | null } | null;
	categories?: { name: string; slug: string } | null;
};

function normalize(row: PostRow): BlogPost {
	return {
		id: row.id,
		title: row.title,
		slug: row.slug,
		excerpt: row.excerpt ? decodeHtmlEntities(row.excerpt) : null,
		content_html: row.content_html,
		status: row.status === 'published' ? 'published' : 'draft',
		post_type: row.post_type === 'page' ? 'page' : 'post',
		featured: row.featured,
		hero_image_url: row.hero_image_url,
		published_at: row.published_at,
		author_name: row.profiles?.display_name ?? 'VoAC',
		category_name: row.categories?.name ?? null,
		category_slug: row.categories?.slug ?? null,
		tags: [],
		original_url: row.original_url
	};
}

export async function listPublishedPosts(limit = 12) {
	const supabase = createSupabaseAdmin();
	const { data, error } = await supabase
		.from('posts')
		.select(POST_SELECT)
		.eq('status', 'published')
		.eq('post_type', 'post')
		.order('featured', { ascending: false })
		.order('published_at', { ascending: false })
		.limit(limit);

	if (error) throw error;
	return (data as unknown as PostRow[]).map((row) => normalize(row));
}

export async function listAllPublishedPosts() {
	const supabase = createSupabaseAdmin();
	const { data, error } = await supabase
		.from('posts')
		.select(POST_SELECT)
		.eq('status', 'published')
		.eq('post_type', 'post')
		.order('published_at', { ascending: false });

	if (error) throw error;
	return (data as unknown as PostRow[]).map((row) => normalize(row));
}

export async function getPublishedPost(slug: string) {
	const supabase = createSupabaseAdmin();
	const { data, error } = await supabase
		.from('posts')
		.select(POST_SELECT)
		.eq('status', 'published')
		.eq('post_type', 'post')
		.eq('slug', slug)
		.single();

	if (error?.code === 'PGRST116') return null;
	if (error) throw error;

	return normalize(data as unknown as PostRow);
}
