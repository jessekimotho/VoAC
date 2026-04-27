import { fail, redirect } from '@sveltejs/kit';
import { saveStudioPost, slugify } from '$lib/server/studio/posts';

export async function load() {
	return {
		post: {
			id: null,
			title: '',
			slug: '',
			excerpt: '',
			content_html: '<p></p>',
			status: 'draft',
			post_type: 'post',
			featured: false,
			hero_image_url: ''
		}
	};
}

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const title = String(form.get('title') ?? '').trim();
		const contentHtml = String(form.get('contentHtml') ?? '').trim();

		if (!title || !contentHtml) {
			return fail(400, { message: 'Title and content are required.' });
		}

		const id = await saveStudioPost({
			title,
			slug: String(form.get('slug') || slugify(title)),
			excerpt: String(form.get('excerpt') || '').trim() || null,
			contentHtml,
			status: String(form.get('status')) as 'draft' | 'published' | 'scheduled' | 'archived',
			postType: String(form.get('postType')) as 'post' | 'page',
			featured: form.get('featured') === 'on',
			heroImageUrl: String(form.get('heroImageUrl') || '').trim() || null
		});

		redirect(303, `/studio/posts/${id}`);
	}
};

