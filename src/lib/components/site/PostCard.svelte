<script lang="ts">
	import type { BlogPost } from '$lib/server/types';

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
</script>

<article class:compact class="{noteColor} post-card group relative rounded-sm p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:rotate-0 {index % 2 === 0 ? '-rotate-1' : 'rotate-1'} border border-paper-line/30">
	<a href={`/posts/${post.slug}`} aria-label={`Read ${post.title}`} class="grid gap-3">
		<div class="flex flex-wrap gap-x-3 gap-y-1 font-handwritten text-lg text-accent-ink">
			<span>{post.category_name ?? 'Essay'}</span>
			<span class="text-ink-faint">&bull;</span>
			<span>{date}</span>
		</div>
		<h2 class="m-0 max-w-190 font-handwritten text-3xl leading-tight text-ink-dark group-hover:text-accent-ink transition-colors">
			{post.title}
		</h2>
		{#if !compact}
			<p class="m-0 max-w-175 font-serif text-ink-mid leading-relaxed line-clamp-3">
				{post.excerpt}
			</p>
		{/if}
		{#if post.tags && post.tags.length > 0}
			<div class="flex flex-wrap gap-2 mt-1">
				{#each post.tags as tag}
					<span class="rounded-full border border-paper-line/60 bg-paper/60 px-2.5 py-0.5 font-handwritten text-base text-ink-light">{tag}</span>
				{/each}
			</div>
		{/if}
	</a>
</article>

