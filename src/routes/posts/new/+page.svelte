<script lang="ts">
	import PostEditorForm from '$lib/components/editor/PostEditorForm.svelte';
	
	let { form }: { form?: any } = $props();
</script>

<svelte:head>
	<title>New post | Voice of an African Child</title>
</svelte:head>

<main class="shell edit-page">
	<p class="eyebrow"><a href="/">Home</a></p>
	<h1>New post</h1>
	<PostEditorForm post={null} {form} />
</main>

<style>
	.edit-page {
		padding-top: 3rem;
		min-width: 0;
		max-width: min(1120px, calc(100vw - 32px));
	}

	h1 {
		margin: 0.2rem 0 1.5rem;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(3rem, 9vw, 6rem);
		line-height: 0.92;
	}
</style>
