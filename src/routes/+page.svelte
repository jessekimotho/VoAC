<script lang="ts">
	import PostCard from '$lib/components/site/PostCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Voice of an African Child</title>
	<meta
		name="description"
		content="Stories unbound from the Voice of an African Child archive."
	/>
</svelte:head>

<main>
	<section class="hero shell">
		<div class="hero-copy">
			<p class="eyebrow">Stories unbound</p>
			<h1>Voice of an African Child</h1>
			<p>
				Essays, travel notes, book reviews, campus stories, and the beautifully stubborn archive
				of an old WordPress life brought into a new home.
			</p>
		</div>

		{#if data.featured}
			<a class="featured" href={`/posts/${data.featured.slug}`}>
				<span class="eyebrow">{data.featured.category_name ?? 'Featured'}</span>
				<h2>{data.featured.title}</h2>
				<p>{data.featured.excerpt}</p>
				<strong>Read essay</strong>
			</a>
		{/if}
	</section>

	<section class="shell content-grid" aria-label="All posts">
		<div>
			<div class="section-heading">
				<p class="eyebrow">All posts</p>
				<h2>Writing</h2>
			</div>

			<div class="post-list">
				{#each data.allPosts as post}
					<PostCard {post} />
				{/each}
			</div>
		</div>
	</section>
</main>

<style>
	main {
		padding-top: 3rem;
	}

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 0.95fr) minmax(320px, 0.75fr);
		gap: clamp(1.5rem, 4vw, 4rem);
		align-items: end;
		min-height: min(620px, calc(100vh - 88px));
		padding-bottom: 3rem;
	}

	.hero-copy {
		display: grid;
		gap: 1rem;
	}

	h1 {
		margin: 0;
		max-width: 760px;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(3.4rem, 11vw, 8.7rem);
		line-height: 0.86;
		letter-spacing: 0;
	}

	.hero-copy p:not(.eyebrow) {
		max-width: 620px;
		margin: 0;
		color: #514d47;
		font-size: 1.08rem;
		line-height: 1.65;
	}

	.featured {
		display: grid;
		gap: 1rem;
		padding: 1.4rem;
		background: #1f2933;
		color: #f7f4ed;
		border-radius: 8px;
		box-shadow: 0 24px 60px rgba(31, 41, 51, 0.18);
	}

	.featured .eyebrow {
		color: #f1b15b;
	}

	.featured h2 {
		margin: 0;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(1.8rem, 3vw, 3rem);
		line-height: 1;
	}

	.featured p {
		margin: 0;
		color: rgba(247, 244, 237, 0.78);
		line-height: 1.65;
	}

	.featured strong {
		color: #f1b15b;
	}

	.content-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 280px;
		gap: clamp(2rem, 6vw, 5rem);
		align-items: start;
	}

	.section-heading {
		margin-bottom: 1rem;
	}

	.section-heading h2 {
		margin: 0.2rem 0 0;
		font-family: Georgia, "Times New Roman", serif;
		font-size: 2rem;
	}

	@media (max-width: 820px) {
		.hero {
			grid-template-columns: 1fr;
		}

		.hero {
			min-height: auto;
		}
	}
</style>

