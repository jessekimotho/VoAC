<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Studio | Voice of an African Child</title>
</svelte:head>

<main class="shell studio">
	<p class="eyebrow">Studio</p>
	<h1>Editorial cockpit</h1>
	<p class="muted">
		Edit migrated posts, create new drafts, publish updates, and keep the archive tidy.
	</p>

	<div class="stats">
		<div><strong>{data.counts.total}</strong><span>Total</span></div>
		<div><strong>{data.counts.published}</strong><span>Published</span></div>
		<div><strong>{data.counts.draft}</strong><span>Drafts</span></div>
		<div><strong>{data.counts.archived}</strong><span>Archived</span></div>
	</div>

	<section>
		<div class="section-title">
			<h2>Recently updated</h2>
			<a href="/studio/posts">View all</a>
		</div>
		<div class="recent">
			{#each data.recent as post}
				<a href={`/studio/posts/${post.id}`}>
					<span>{post.status}</span>
					<strong>{post.title}</strong>
				</a>
			{/each}
		</div>
	</section>
</main>

<style>
	.studio {
		max-width: 780px;
		padding-top: 4rem;
	}

	h1 {
		margin: 0.3rem 0 1rem;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(3rem, 9vw, 6rem);
		line-height: 0.94;
	}

	.stats,
	section {
		margin-top: 2rem;
		padding: 1rem;
		border: 1px solid rgba(44, 42, 38, 0.12);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.52);
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.8rem;
	}

	.stats div {
		display: grid;
		gap: 0.2rem;
	}

	.stats strong {
		font-family: Georgia, "Times New Roman", serif;
		font-size: 2.2rem;
		line-height: 1;
	}

	.stats span,
	.recent span {
		color: #9d3d2f;
		font-weight: 800;
		text-transform: uppercase;
		font-size: 0.76rem;
	}

	.section-title {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
	}

	h2 {
		margin-top: 0;
		font-family: Georgia, "Times New Roman", serif;
	}

	.recent {
		display: grid;
		gap: 0.7rem;
	}

	.recent a {
		display: grid;
		gap: 0.2rem;
		padding-top: 0.7rem;
		border-top: 1px solid rgba(44, 42, 38, 0.12);
	}

	@media (max-width: 680px) {
		.stats {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
