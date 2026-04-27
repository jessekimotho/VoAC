<script lang="ts">
	// Temporarily simplified to isolate error
	let { data } = $props();
</script>

<svelte:head>
	<title>Voice of an African Child</title>
	<meta
		name="description"
		content="Stories unbound from the Voice of an African Child archive."
	/>
</svelte:head>

<main>
	<section class="shell relative grid min-h-[calc(100svh-72px)] place-items-center py-[clamp(3rem,7vw,6rem)]">
		<div class="paper-sheet relative isolate grid min-h-[min(78svh,720px)] w-full place-items-center overflow-hidden px-5 py-18 text-center sm:px-10">
			<p class="m-0 font-serif text-xs font-semibold uppercase tracking-[0.34em] text-accent-blue">The archive</p>
			<h1 class="m-0 max-w-[11ch] font-handwritten text-[clamp(5.2rem,16vw,13.5rem)] leading-[0.73] text-ink-dark">
				Voice of an African Child
			</h1>
		</div>
	</section>
</main>
