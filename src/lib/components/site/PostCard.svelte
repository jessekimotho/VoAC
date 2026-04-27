<script lang="ts">
	import type { BlogPost } from '$lib/server/types';
	import { generateExcerptFromHtml } from '$lib/utils';

	let { post, compact = false, index = 0 }: { post: BlogPost; compact?: boolean; index?: number } = $props();

	const noteColors = ['bg-note-1', 'bg-note-2', 'bg-note-3', 'bg-note-4'];
	const noteColor = $derived(noteColors[index % noteColors.length]);

	const date = $derived(
		post.published_at
			? new Intl.DateTimeFormat('en', {
					month: 'short',
					day: 'numeric',
					year: 'numeric'
				}).format(new Date(post.published_at))
			: 'Undated'
	);

	const excerpt = $derived(
		post.excerpt || generateExcerptFromHtml(post.content_html, 180)
	);
</script>

<article class:compact class="{noteColor} post-card group relative overflow-hidden rounded-[3px] border border-ink-dark/12 p-5 shadow-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-paper-lift sm:p-6">
	<span class="tape-mark" aria-hidden="true"></span>
	<a href={`/posts/${post.slug}`} aria-label={`Read ${post.title}`} class="grid gap-4">
		<div class="flex items-center justify-between gap-4 font-serif text-sm text-ink-light">
			<span>{date}</span>
			<span class="font-handwritten text-lg text-accent-ink">No. {String(index + 1).padStart(2, '0')}</span>
		</div>
		<h2 class="m-0 font-handwritten text-[clamp(2rem,4vw,3.65rem)] leading-[0.95] text-ink-dark transition-colors group-hover:text-accent-ink">
			{post.title}
		</h2>
		<div class="font-serif text-sm text-ink-light">
			By {post.author_name || 'VoAC'}
		</div>
		{#if !compact}
			<p class="m-0 max-w-175 font-serif text-[1.05rem] leading-relaxed text-ink-mid line-clamp-3">
				{excerpt}
			</p>
		{/if}
		<span class="inline-flex w-max items-center gap-2 font-serif text-sm font-semibold uppercase tracking-[0.18em] text-ink-dark/70">
			Read
			<span aria-hidden="true" class="transition-transform duration-300 group-hover:translate-x-1">-&gt;</span>
		</span>
	</a>
</article>

<style>
	.post-card {
		display: grid;
		background-image:
			linear-gradient(rgba(36, 95, 115, 0.1) 1px, transparent 1px),
			linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0));
		background-size: 100% 29px, 100% 100%;
	}

	.post-card::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			linear-gradient(90deg, transparent 3.2rem, rgba(214, 90, 74, 0.28) 3.25rem, transparent 3.32rem),
			radial-gradient(circle at 20% 8%, rgba(255, 255, 255, 0.72), transparent 24%);
		mix-blend-mode: multiply;
	}

	.tape-mark {
		position: absolute;
		left: 50%;
		top: -0.55rem;
		z-index: 1;
		width: 5.5rem;
		height: 1.25rem;
		transform: translateX(-50%) rotate(-2deg);
		background: rgba(238, 222, 178, 0.74);
		box-shadow: 0 2px 6px rgba(44, 36, 32, 0.14);
	}

	.post-card > a {
		position: relative;
		z-index: 2;
		grid-template-rows: auto auto auto auto auto;
		align-items: start;
	}

	h2 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		overflow: hidden;
	}

	p {
		overflow: hidden;
	}

	:global(.desk-post:nth-child(3n + 2)) .tape-mark {
		transform: translateX(-50%) rotate(3deg);
	}

	:global(.desk-post:nth-child(4n)) .tape-mark {
		left: 18%;
		transform: rotate(-8deg);
	}
</style>
