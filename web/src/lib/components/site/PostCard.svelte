<script lang="ts">
	import type { BlogPost } from '$lib/server/types';

	let { post, compact = false }: { post: BlogPost; compact?: boolean } = $props();

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

<article class:compact class="post-card">
	<a href={`/posts/${post.slug}`} aria-label={`Read ${post.title}`}>
		<div class="meta">
			<span>{post.category_name ?? 'Essay'}</span>
			<span>{date}</span>
		</div>
		<h2>{post.title}</h2>
		{#if !compact}
			<p>{post.excerpt}</p>
		{/if}
	</a>
</article>

<style>
	.post-card {
		border-top: 1px solid rgba(44, 42, 38, 0.14);
		padding: 1.2rem 0;
	}

	.post-card a {
		display: grid;
		gap: 0.65rem;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 0.8rem;
		color: #8a3b2c;
		font-size: 0.78rem;
		font-weight: 800;
		text-transform: uppercase;
	}

	h2 {
		margin: 0;
		max-width: 760px;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(1.35rem, 1rem + 1vw, 2rem);
		line-height: 1.08;
		letter-spacing: 0;
	}

	p {
		margin: 0;
		max-width: 700px;
		color: #5e5a52;
		line-height: 1.65;
	}

	.compact h2 {
		font-size: 1.2rem;
		line-height: 1.18;
	}
</style>

