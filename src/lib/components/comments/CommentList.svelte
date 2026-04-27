<script lang="ts">
	import type { CommentNode } from '$lib/server/types';
	import CommentList from './CommentList.svelte';

	let { comments }: { comments: CommentNode[] } = $props();
</script>

{#if comments.length}
	<ol class="comments">
		{#each comments as comment}
			<li>
				<article>
					<header>
						<strong>{comment.author_name}</strong>
						<span>{new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(comment.created_at))}</span>
					</header>
					<p>{comment.body}</p>
				</article>

				{#if comment.replies.length}
					<div class="replies">
						<CommentList comments={comment.replies} />
					</div>
				{/if}
			</li>
		{/each}
	</ol>
{:else}
	<p class="muted">No approved comments yet.</p>
{/if}

<style>
	.comments {
		display: grid;
		gap: 1rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	article {
		background: rgba(255, 255, 255, 0.55);
		border: 1px solid rgba(44, 42, 38, 0.12);
		border-radius: 8px;
		padding: 1rem;
	}

	header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.6rem;
		font-size: 0.9rem;
	}

	header span {
		color: #706d66;
	}

	p {
		margin: 0;
		line-height: 1.6;
	}

	.replies {
		margin: 0.8rem 0 0 1.2rem;
	}
</style>
