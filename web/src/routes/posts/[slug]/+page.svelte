<script lang="ts">
	import CommentList from '$lib/components/comments/CommentList.svelte';
	import PostCard from '$lib/components/site/PostCard.svelte';

	let { data } = $props();

	const date = $derived(
		data.post.published_at
			? new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(data.post.published_at))
			: 'Undated'
	);
</script>

<svelte:head>
	<title>{data.post.title} | Voice of an African Child</title>
	<meta name="description" content={data.post.excerpt ?? data.post.title} />
</svelte:head>

<main class="post-shell shell">
	<article>
		<header class="post-header">
			<a href="/posts" class="eyebrow">Archive</a>
			<h1>{data.post.title}</h1>
			<p class="muted">
				{date}
				{#if data.post.category_name}
					<span> / {data.post.category_name}</span>
				{/if}
			</p>
		</header>

		<div class="rich-content">
			{@html data.post.content_html}
		</div>
	</article>

	<section class="comments-section" aria-labelledby="comments-title">
		<div>
			<p class="eyebrow">Conversation</p>
			<h2 id="comments-title">Comments</h2>
			<p class="muted">New comments are held for moderation once Supabase is connected.</p>
		</div>

		<form method="POST" action="/api/comments" class="comment-form">
			<input type="hidden" name="postId" value={data.post.id} />
			<label>
				Name
				<input name="authorName" required minlength="2" maxlength="80" />
			</label>
			<label>
				Email
				<input name="authorEmail" type="email" />
			</label>
			<label>
				Comment
				<textarea name="body" required minlength="3" maxlength="4000"></textarea>
			</label>
			<button>Submit for moderation</button>
		</form>

		<CommentList comments={data.comments} />
	</section>

	{#if data.related.length}
		<section class="related" aria-labelledby="related-title">
			<p class="eyebrow">Keep reading</p>
			<h2 id="related-title">Related posts</h2>
			{#each data.related as post}
				<PostCard {post} compact />
			{/each}
		</section>
	{/if}
</main>

<style>
	.post-shell {
		display: grid;
		grid-template-columns: minmax(0, 760px) minmax(280px, 1fr);
		gap: clamp(2rem, 6vw, 5rem);
		padding-top: 4rem;
		align-items: start;
	}

	article {
		min-width: 0;
	}

	.post-header {
		margin-bottom: 2.2rem;
	}

	h1 {
		margin: 0.4rem 0 0.8rem;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(2.6rem, 7vw, 5.8rem);
		line-height: 0.94;
	}

	.comments-section,
	.related {
		display: grid;
		gap: 1.2rem;
	}

	.comments-section h2,
	.related h2 {
		margin: 0.2rem 0 0;
		font-family: Georgia, "Times New Roman", serif;
		font-size: 2rem;
	}

	.comment-form {
		display: grid;
		gap: 0.8rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.52);
		border: 1px solid rgba(44, 42, 38, 0.12);
		border-radius: 8px;
	}

	label {
		display: grid;
		gap: 0.35rem;
		color: #514d47;
		font-size: 0.9rem;
		font-weight: 700;
	}

	input,
	textarea {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid rgba(44, 42, 38, 0.18);
		border-radius: 6px;
		background: #fffdfa;
		padding: 0.75rem;
		color: #1b1b19;
	}

	textarea {
		min-height: 120px;
		resize: vertical;
	}

	button {
		border: 0;
		border-radius: 6px;
		background: #1f2933;
		color: #f7f4ed;
		min-height: 42px;
		font-weight: 800;
		cursor: pointer;
	}

	@media (max-width: 980px) {
		.post-shell {
			grid-template-columns: 1fr;
		}
	}
</style>

