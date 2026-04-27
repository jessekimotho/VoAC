<script lang="ts">
	import PostEditorForm from '$lib/components/editor/PostEditorForm.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>New Post | Voice of an African Child</title>
</svelte:head>

<main class="shell edit-page">
	<p class="eyebrow">Studio</p>
	<h1>New post</h1>
	<PostEditorForm post={data.post} {form} />
</main>

<style>
	.edit-page {
		padding-top: 3rem;
	}

	h1 {
		margin: 0.2rem 0 1.5rem;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(3rem, 9vw, 6rem);
		line-height: 0.92;
	}
</style>

