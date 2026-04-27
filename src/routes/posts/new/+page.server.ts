import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import { hasStudioSession } from '$lib/server/studio/auth';
import { saveStudioPost, slugify } from '$lib/server/studio/posts';

export const load: ServerLoad = async ({ cookies }) => {
	if (!hasStudioSession(cookies)) {
		redirect(303, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		if (!hasStudioSession(cookies)) {
			redirect(303, '/');
		}
		
		const form = await request.formData();
		const title = String(form.get('title') ?? '');
		const content = String(form.get('content') ?? '');
		const status = String(form.get('status') ?? 'draft') as 'draft' | 'published' | 'scheduled' | 'archived';
		
		const slug = slugify(title);
		await saveStudioPost({
			title,
			slug,
			excerpt: null,
			contentHtml: content,
			status,
			postType: 'post',
			featured: false
		});
		
		redirect(303, `/posts/${slug}`);
	}
};
