import { createSupabaseAdmin } from '$lib/server/supabase';

export type StudioPost = {
	id: string;
	title: string;
	slug: string;
	excerpt: string | null;
	content_html: string;
	status: 'draft' | 'published' | 'scheduled' | 'archived';
	post_type: 'post' | 'page';
	featured: boolean;
	hero_image_url: string | null;
	published_at: string | null;
	updated_at: string;
	original_url: string | null;
};

export function slugify(value: string) {
	return value
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 96);
}

export async function listStudioPosts() {
	const supabase = createSupabaseAdmin();
	const { data, error } = await supabase
		.from('posts')
		.select('id,title,slug,excerpt,status,post_type,featured,hero_image_url,published_at,updated_at,original_url')
		.order('updated_at', { ascending: false });

	if (error) throw error;
	return (data ?? []) as StudioPost[];
}

export async function getStudioPost(id: string) {
	const supabase = createSupabaseAdmin();
	const { data, error } = await supabase
		.from('posts')
		.select('*')
		.eq('id', id)
		.single();

	if (error?.code === 'PGRST116') return null;
	if (error) throw error;
	return data as StudioPost;
}

export async function saveStudioPost(input: {
	id?: string;
	title: string;
	slug: string;
	excerpt: string | null;
	contentHtml: string;
	status: StudioPost['status'];
	postType: StudioPost['post_type'];
	featured: boolean;
	heroImageUrl: string | null;
}) {
	const supabase = createSupabaseAdmin();
	const now = new Date().toISOString();
	const payload = {
		title: input.title,
		slug: input.slug || slugify(input.title),
		excerpt: input.excerpt,
		content_source: 'tiptap',
		content_html: input.contentHtml,
		status: input.status,
		post_type: input.postType,
		featured: input.featured,
		hero_image_url: input.heroImageUrl,
		published_at: input.status === 'published' ? now : null,
		updated_at: now
	};

	if (input.id) {
		const { error } = await supabase.from('posts').update(payload).eq('id', input.id);
		if (error) throw error;
		return input.id;
	}

	const { data, error } = await supabase.from('posts').insert(payload).select('id').single();
	if (error) throw error;
	return data.id as string;
}

