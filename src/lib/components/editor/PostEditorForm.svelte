<script lang="ts">
	import RichTextEditor from './RichTextEditor.svelte';

	let { post, form = undefined }: { post: any; form?: { message?: string } | null } = $props();
	const initial = (() => ({
		html: post.content_html ?? '<p></p>',
		title: post.title ?? '',
		slug: post.slug ?? ''
	}))();
	let html = $state(initial.html);
	let title = $state(initial.title);
	let slug = $state(initial.slug);

	function makeSlug(value: string) {
		return value
			.toLowerCase()
			.replace(/&/g, ' and ')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')
			.slice(0, 96);
	}

	function syncSlug() {
		if (!slug) slug = makeSlug(title);
	}
</script>

<form method="POST" class="editor-form">
	<div class="top-grid">
		<label class="wide">
			Title
			<input name="title" bind:value={title} onblur={syncSlug} required />
		</label>

		<label>
			Slug
			<input name="slug" bind:value={slug} required />
		</label>

		<label>
			Status
			<select name="status">
				{#each ['draft', 'published', 'archived'] as status}
					<option value={status} selected={post.status === status}>{status}</option>
				{/each}
			</select>
		</label>

		<label>
			Type
			<select name="postType">
				<option value="post" selected={post.post_type === 'post'}>post</option>
				<option value="page" selected={post.post_type === 'page'}>page</option>
			</select>
		</label>

		<label class="wide">
			Excerpt
			<textarea name="excerpt">{post.excerpt ?? ''}</textarea>
		</label>

		<label class="wide">
			Hero image URL
			<input name="heroImageUrl" value={post.hero_image_url ?? ''} />
		</label>

		<label class="check">
			<input type="checkbox" name="featured" checked={post.featured} />
			Featured
		</label>
	</div>

	<input type="hidden" name="contentHtml" value={html} />
	<RichTextEditor bind:html />

	{#if form?.message}
		<p class="error">{form.message}</p>
	{/if}

	<div class="actions">
		<button>Save post</button>
		{#if post.slug}
			<a href={`/posts/${post.slug}`} target="_blank" rel="noreferrer">View public page</a>
		{/if}
	</div>
</form>

<style>
	.editor-form {
		display: grid;
		gap: 1rem;
		min-width: 0;
		max-width: 100%;
	}

	.top-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 220px) minmax(0, 160px) minmax(0, 120px);
		gap: 0.8rem;
		align-items: end;
		min-width: 0;
	}

	.wide {
		grid-column: 1 / -1;
	}

	label {
		display: grid;
		gap: 0.35rem;
		min-width: 0;
		color: #514d47;
		font-size: 0.9rem;
		font-weight: 800;
	}

	input,
	select,
	textarea {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid rgba(44, 42, 38, 0.18);
		border-radius: 6px;
		background: #fffdfa;
		padding: 0.75rem;
		color: #1b1b19;
		min-width: 0;
	}

	textarea {
		min-height: 88px;
		resize: vertical;
	}

	.check {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.check input {
		width: auto;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
	}

	button {
		min-height: 44px;
		border: 0;
		border-radius: 6px;
		background: #1f2933;
		color: #f7f4ed;
		padding: 0 1.1rem;
		font-weight: 900;
		cursor: pointer;
	}

	.actions a {
		color: #9d3d2f;
		font-weight: 800;
	}

	.error {
		color: #9d3d2f;
	}

	@media (max-width: 860px) {
		.top-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
