import { createClient } from '@supabase/supabase-js';
import { writeFile } from 'node:fs/promises';

const FIX = process.argv.includes('--fix');
const CHECK_EXTERNAL = process.argv.includes('--check-external') || FIX;
const REPORT_PATH = new URL('../link-audit-report.json', import.meta.url);

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
	console.error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in web/.env.local');
	process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	},
	global: {
		fetch: (url, options = {}) =>
			fetch(url, {
				...options,
				signal: AbortSignal.timeout(12000)
			})
	}
});

const INTERNAL_HOSTS = new Set([
	'voiceofanafricanchild.com',
	'www.voiceofanafricanchild.com',
	'voiceofanafricanchild.wordpress.com'
]);

function slugify(value) {
	return value
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function decodeHtml(value) {
	return value
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'")
		.replace(/&nbsp;/g, ' ');
}

function escapeAttribute(value) {
	return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function pathCandidates(url) {
	const parts = url.pathname
		.split('/')
		.map((part) => slugify(decodeURIComponent(part)))
		.filter(Boolean)
		.filter((part) => !/^\d+$/.test(part));

	const candidates = [];
	for (let index = 0; index < parts.length; index += 1) {
		candidates.push(parts.slice(index).join('-'));
	}
	if (parts.length) candidates.push(parts.at(-1));
	return candidates.filter(Boolean);
}

function buildLookup(posts) {
	const byUrl = new Map();
	const bySlug = new Map();

	for (const post of posts) {
		bySlug.set(post.slug, post);
		if (post.original_url) {
			try {
				const url = new URL(post.original_url);
				byUrl.set(`${url.hostname}${url.pathname}`.replace(/\/$/, ''), post);
			} catch {
				// Ignore malformed legacy URLs.
			}
		}
	}

	return { byUrl, bySlug };
}

function resolveInternal(href, lookup) {
	let url;
	try {
		url = new URL(href);
	} catch {
		return href.startsWith('/') ? href : null;
	}

	if (!INTERNAL_HOSTS.has(url.hostname)) return null;
	if (url.pathname === '/' || url.pathname === '') return '/';

	const direct = lookup.byUrl.get(`${url.hostname}${url.pathname}`.replace(/\/$/, ''));
	if (direct) return `/posts/${direct.slug}${url.hash}`;

	for (const candidate of pathCandidates(url)) {
		const match = lookup.bySlug.get(candidate);
		if (match) return `/posts/${match.slug}${url.hash}`;
	}

	return null;
}

async function checkExternal(href) {
	try {
		const response = await fetch(href, {
			method: 'HEAD',
			redirect: 'follow',
			signal: AbortSignal.timeout(10000),
			headers: {
				'user-agent': 'VoAC link audit'
			}
		});
		if ([405, 403].includes(response.status)) {
			const fallback = await fetch(href, {
				method: 'GET',
				redirect: 'follow',
				signal: AbortSignal.timeout(10000),
				headers: {
					'user-agent': 'VoAC link audit',
					range: 'bytes=0-512'
				}
			});
			return { ok: fallback.ok, status: fallback.status };
		}
		return { ok: response.ok, status: response.status };
	} catch (error) {
		return { ok: false, status: 0, error: error.message };
	}
}

function rewriteHref(attributes, oldHref, nextHref) {
	return attributes.replace(/href=(["'])(.*?)\1/i, `href=$1${escapeAttribute(nextHref)}$1`);
}

function removeAnchor(tag, href, text) {
	const label = text.trim() || href;
	return `<span data-dead-link="${escapeAttribute(href)}">${label}</span>`;
}

async function main() {
	const { data: posts, error } = await supabase
		.from('posts')
		.select('id,title,slug,content_html,original_url,status')
		.order('published_at', { ascending: false });

	if (error) throw error;

	const lookup = buildLookup(posts);
	const report = [];
	const externalCache = new Map();

	for (const post of posts) {
		let html = post.content_html ?? '';
		let changed = false;
		const issues = [];
		const anchorPattern = /<a\b([^>]*?)href=(["'])(.*?)\2([^>]*)>([\s\S]*?)<\/a>/gi;

		const replacements = [];
		for (const match of html.matchAll(anchorPattern)) {
			const [full, before, , rawHref, after, text] = match;
			const href = decodeHtml(rawHref.trim());
			if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;

			const internal = resolveInternal(href, lookup);
			if (internal) {
				if (internal !== href) {
					const attrs = `${before}href="${rawHref}"${after}`;
					replacements.push({
						from: full,
						to: `<a${rewriteHref(attrs, href, internal)}>${text}</a>`
					});
					issues.push({ type: 'rewritten-internal', href, replacement: internal });
				}
				continue;
			}

			try {
				const url = new URL(href);
				if (INTERNAL_HOSTS.has(url.hostname)) {
					replacements.push({ from: full, to: removeAnchor(full, href, text) });
					issues.push({ type: 'unresolved-internal', href });
					continue;
				}
			} catch {
				issues.push({ type: 'malformed', href });
				replacements.push({ from: full, to: removeAnchor(full, href, text) });
				continue;
			}

			if (CHECK_EXTERNAL) {
				if (!externalCache.has(href)) externalCache.set(href, await checkExternal(href));
				const result = externalCache.get(href);
				if (!result.ok) {
					replacements.push({ from: full, to: removeAnchor(full, href, text) });
					issues.push({ type: 'dead-external', href, status: result.status, error: result.error });
				}
			}
		}

		for (const replacement of replacements) {
			if (FIX) {
				html = html.replace(replacement.from, replacement.to);
				changed = true;
			}
		}

		if (changed) {
			const { error: updateError } = await supabase
				.from('posts')
				.update({ content_html: html, updated_at: new Date().toISOString() })
				.eq('id', post.id);
			if (updateError) throw updateError;
		}

		if (issues.length) {
			report.push({ id: post.id, title: post.title, slug: post.slug, changed, issues });
		}
	}

	await writeFile(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');
	console.log(`${FIX ? 'Fixed' : 'Audited'} links for ${posts.length} posts/pages.`);
	console.log(`Posts/pages with link issues: ${report.length}`);
	console.log(`Report: ${REPORT_PATH.pathname}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
