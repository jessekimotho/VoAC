<script lang="ts">
	import type { CommentNode } from '$lib/server/types';
	import CommentList from './CommentList.svelte';

	let { comments, depth = 0 }: { comments: CommentNode[]; depth?: number } = $props();

	const noteColors = ['bg-note-1', 'bg-note-2', 'bg-note-3', 'bg-note-4'];

	function getRandomRotation() {
		const rotations = [-1.5, -1, -0.5, 0.5, 1, 1.5];
		return rotations[Math.floor(Math.random() * rotations.length)];
	}
</script>

{#if comments.length}
	<ol class="comments">
		{#each comments as comment, i}
			<li>
				<article
					class="{noteColors[i % noteColors.length]} comment-card"
					style="--rotation: {getRandomRotation()}deg;"
				>
					<span class="tape-mark" aria-hidden="true"></span>
					<header>
						<strong>{comment.author_name}</strong>
						<span>{new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(comment.created_at))}</span>
					</header>
					<p>{comment.body}</p>
				</article>

				{#if comment.replies.length}
					<div class="replies">
						<CommentList comments={comment.replies} depth={depth + 1} />
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
		gap: 1.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.comment-card {
		position: relative;
		background-image:
			linear-gradient(rgba(36, 95, 115, 0.1) 1px, transparent 1px),
			linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0));
		background-size: 100% 29px, 100% 100%;
		border: 1px solid rgba(0, 0, 0, 0.12);
		border-radius: 3px;
		padding: 1.25rem;
		box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
		transform: rotate(var(--rotation, 0deg));
	}

	.comment-card::before {
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

	.comment-card:nth-child(3n + 2) .tape-mark {
		transform: translateX(-50%) rotate(3deg);
	}

	.comment-card:nth-child(4n) .tape-mark {
		left: 18%;
		transform: rotate(-8deg);
	}

	header {
		position: relative;
		z-index: 2;
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.6rem;
		font-size: 0.9rem;
		font-family: 'EB Garamond', Georgia, serif;
	}

	header span {
		color: rgba(0, 0, 0, 0.6);
	}

	p {
		position: relative;
		z-index: 2;
		margin: 0;
		line-height: 1.6;
		font-family: 'EB Garamond', Georgia, serif;
	}

	.replies {
		margin: 0.8rem 0 0 1.2rem;
	}
</style>
