<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Studio Posts | Voice of an African Child</title>
</svelte:head>

<main class="shell posts">
	<div class="heading">
		<div>
			<p class="eyebrow">Studio</p>
			<h1>Posts</h1>
		</div>
		<a class="new" href="/studio/posts/new">New post</a>
	</div>

	<div class="table">
		{#each data.posts as post}
			<a class="row" href={`/studio/posts/${post.id}`}>
				<div>
					<strong>{post.title}</strong>
					<span>{post.slug}</span>
				</div>
				<span class="status">{post.status}</span>
				<span>{post.post_type}</span>
			</a>
		{/each}
	</div>
</main>

<style>
	.posts {
		padding-top: 3rem;
	}

	.heading,
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	h1 {
		margin: 0.2rem 0 0;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(3rem, 9vw, 6rem);
		line-height: 0.92;
	}

	.new {
		display: inline-flex;
		align-items: center;
		min-height: 42px;
		padding: 0 1rem;
		border-radius: 6px;
		background: #1f2933;
		color: #f7f4ed;
		font-weight: 900;
	}

	.table {
		margin-top: 2rem;
		border-top: 1px solid rgba(44, 42, 38, 0.12);
	}

	.row {
		padding: 1rem 0;
		border-bottom: 1px solid rgba(44, 42, 38, 0.12);
	}

	.row div {
		display: grid;
		gap: 0.25rem;
		min-width: 0;
	}

	.row strong,
	.row span:first-of-type {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.row div span {
		color: #706d66;
		font-size: 0.9rem;
	}

	.status {
		color: #9d3d2f;
		font-weight: 900;
		text-transform: uppercase;
		font-size: 0.78rem;
	}
</style>

