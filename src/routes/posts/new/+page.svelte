<script lang="ts">
	import PostEditorForm from '$lib/components/editor/PostEditorForm.svelte';
	
	let { form }: { form?: any } = $props();
</script>

<svelte:head>
	<title>New post | Voice of an African Child</title>
</svelte:head>

<main class="desk-stage py-10">
	<div class="shell">
		<article class="paper-sheet px-[clamp(1.1rem,4vw,4rem)] py-[clamp(1.4rem,5vw,4.5rem)]">
			<p class="eyebrow"><a href="/" data-sveltekit-prefetch>Home</a></p>
			<h1 class="m-0 font-handwritten text-[clamp(3rem,9vw,6rem)] leading-[0.92] text-ink-dark">New post</h1>
			<PostEditorForm post={null} {form} />
		</article>
	</div>
</main>
