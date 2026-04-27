<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Link Audit | Voice of an African Child</title>
</svelte:head>

<main class="shell audit">
	<p class="eyebrow">Studio</p>
	<h1>Link audit</h1>
	<p class="muted">
		Old internal links should point at current post URLs. Dead external links are converted into
		non-clickable spans by the repair script.
	</p>

	<div class="stats">
		<div><strong>{data.oldInternal.length}</strong><span>Old internal links</span></div>
		<div><strong>{data.deadMarked.length}</strong><span>Posts with dead-link notes</span></div>
	</div>

	<section>
		<h2>Run repair locally</h2>
		<code>cd web && npm run fix:links</code>
	</section>

	{#if data.oldInternal.length}
		<section>
			<h2>Remaining old internal links</h2>
			{#each data.oldInternal as item}
				<p><a href={`/studio/posts/${item.id}`}>{item.title}</a> <span>{item.href}</span></p>
			{/each}
		</section>
	{/if}
</main>

<style>
	.audit {
		max-width: 880px;
		padding-top: 3rem;
	}

	h1 {
		margin: 0.2rem 0 1rem;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(3rem, 9vw, 6rem);
		line-height: 0.92;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin: 2rem 0;
	}

	.stats div,
	section {
		padding: 1rem;
		border: 1px solid rgba(44, 42, 38, 0.12);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.52);
	}

	.stats strong {
		display: block;
		font-family: Georgia, "Times New Roman", serif;
		font-size: 2.6rem;
	}

	.stats span {
		color: #9d3d2f;
		font-weight: 900;
		text-transform: uppercase;
		font-size: 0.76rem;
	}

	code {
		display: block;
		overflow-x: auto;
		padding: 0.8rem;
		border-radius: 6px;
		background: #1f2933;
		color: #f7f4ed;
	}

	p span {
		display: block;
		color: #706d66;
		word-break: break-word;
	}
</style>
