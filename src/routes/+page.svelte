<script lang="ts">
	import PostCard from '$lib/components/site/PostCard.svelte';

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
	<section class="shell relative grid place-items-center py-[clamp(2rem,5vw,4rem)]">
		<div class="hero-paper paper-sheet relative isolate grid w-full place-items-center overflow-hidden px-5 py-12 text-center sm:px-10">
			<div aria-hidden="true" class="absolute left-[7.8%] top-0 h-full w-px bg-margin-red/70"></div>
			<p class="m-0 font-serif text-xs font-semibold uppercase tracking-[0.34em] text-accent-blue">The archive</p>
			<h1 class="m-0 max-w-[11ch] font-handwritten text-[clamp(3rem,10vw,8rem)] leading-[0.73] text-ink-dark">
				Voice of an African Child
			</h1>
			<div aria-hidden="true" class="mt-4 mb-4 h-px w-[min(280px,60vw)] bg-ink-dark/30"></div>
			<p class="m-0 font-serif text-sm text-ink-light leading-relaxed">
				Stories unbound from the archive
			</p>
		</div>
	</section>

	<section class="desk-stage mt-8 overflow-hidden pb-20 sm:mt-14" aria-label="All posts">
		<div class="shell mb-8 flex items-end justify-between gap-6 pt-10 max-sm:grid">
			<div>
				<p class="eyebrow text-paper/95">All posts</p>
				<h2 class="m-0 mt-1 font-handwritten text-[clamp(3rem,7vw,6rem)] leading-none text-paper">Desk notes</h2>
			</div>
			<p class="m-0 max-w-78 text-right font-serif text-lg leading-relaxed text-paper/82 max-sm:text-left">
				Sixty-five notes spread across the wood. No tags, no heavy stacking, just the writing.
			</p>
		</div>

		<div class="desk-grid shell">
			{#each data.allPosts as post, i}
				<div class="desk-post">
					<PostCard {post} index={i} />
				</div>
			{/each}
		</div>
	</section>
</main>
