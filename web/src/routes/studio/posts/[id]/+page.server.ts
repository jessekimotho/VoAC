import { error, fail, redirect } from '@sveltejs/kit';
import { getStudioPost, saveStudioPost, slugify } from '$lib/server/studio/posts';

export async function load({ params }) {
	const post = await getStudioPost(params.id);
	if (!post) error(404, 'Post not found');

	return { post };
}

export const actions = {
	default: async ({ request, params }) => {
		const form = await request.formData();
		const title = String(form.get('title') ?? '').trim();
		const contentHtml = String(form.get('contentHtml') ?? '').trim();

		if (!title || !contentHtml) {
			return fail(400, { message: 'Title and content are required.' });
		}

		await saveStudioPost({
			id: params.id,
			title,
			slug: String(form.get('slug') || slugify(title)),
			excerpt: String(form.get('excerpt') || '').trim() || null,
			contentHtml,
			status: String(form.get('status')) as 'draft' | 'published' | 'scheduled' | 'archived',
			postType: String(form.get('postType')) as 'post' | 'page',
			featured: form.get('featured') === 'on',
			heroImageUrl: String(form.get('heroImageUrl') || '').trim() || null
		});

		redirect(303, `/studio/posts/${params.id}`);
	}
};

