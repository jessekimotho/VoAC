import { createSupabaseAdmin } from '$lib/server/supabase';

const INTERNAL_HOSTS = new Set([
	'voiceofanafricanchild.com',
	'www.voiceofanafricanchild.com',
	'voiceofanafricanchild.wordpress.com'
]);

function extractLinks(html: string) {
	return Array.from(html.matchAll(/href=(["'])(.*?)\1/gi)).map((match) => match[2]);
}

export async function load() {
	const supabase = createSupabaseAdmin();
	const { data, error } = await supabase.from('posts').select('id,title,slug,content_html');
	if (error) throw error;

	const oldInternal = [];
	const deadMarked = [];

	for (const post of data ?? []) {
		for (const href of extractLinks(post.content_html ?? '')) {
			try {
				const url = new URL(href);
				if (INTERNAL_HOSTS.has(url.hostname)) {
					oldInternal.push({ id: post.id, title: post.title, slug: post.slug, href });
				}
			} catch {
				// Relative links are fine here.
			}
		}

		if ((post.content_html ?? '').includes('data-dead-link=')) {
			deadMarked.push({ title: post.title, slug: post.slug });
		}
	}

	return {
		oldInternal,
		deadMarked
	};
}
