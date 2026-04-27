<script lang="ts">
	import PostCard from '$lib/components/site/PostCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Archive | Voice of an African Child</title>
</svelte:head>

<main class="shell archive">
	<header>
		<p class="eyebrow">Archive</p>
		<h1>All posts</h1>
		<p class="muted">{data.posts.length} migrated published posts, ready for cleanup and rebirth.</p>
	</header>

	<div class="post-list">
		{#each data.posts as post}
			<PostCard {post} />
		{/each}
	</div>
</main>

<style>
	.archive {
		padding-top: 4rem;
	}

	header {
		margin-bottom: 2rem;
	}

	h1 {
		margin: 0;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(3rem, 9vw, 7rem);
		line-height: 0.92;
	}
</style>

