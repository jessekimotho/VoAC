<script lang="ts">
	import PostCard from '$lib/components/site/PostCard.svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';

	let { data } = $props();

	let heroRef: HTMLElement | undefined = $state();
	let cardsRef: HTMLElement | undefined = $state();
	let cardLayouts = $state<Array<{ x: number; y: number; r: number }>>([]);

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);
		cardLayouts = data.allPosts.map(() => ({
			x: (Math.random() - 0.5) * 1.6,
			y: (Math.random() - 0.5) * 0.9,
			r: (Math.random() - 0.5) * 4.6
		}));

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduceMotion) return;

		const ctx = gsap.context(() => {
			const heroEls = gsap.utils.toArray<HTMLElement>('.hero-animate');

			gsap.fromTo(
				heroEls,
				{ opacity: 0, y: 28, rotate: -1.2, transformOrigin: '50% 100%' },
				{ opacity: 1, y: 0, rotate: 0, duration: 1.05, stagger: 0.11, ease: 'power3.out' }
			);

			gsap.to('.hero-paper', {
				yPercent: -2,
				rotate: 0.35,
				ease: 'none',
				scrollTrigger: {
					trigger: heroRef,
					start: 'top top',
					end: 'bottom top',
					scrub: true
				}
			});
		});

		return () => ctx.revert();
	});
</script>

<svelte:head>
	<title>Voice of an African Child</title>
	<meta
		name="description"
		content="Stories unbound from the Voice of an African Child archive."
	/>
</svelte:head>

<main>
	<section bind:this={heroRef} class="shell relative grid min-h-[calc(100svh-72px)] place-items-center py-[clamp(3rem,7vw,6rem)]">
		<div class="hero-paper paper-sheet relative isolate grid min-h-[min(78svh,720px)] w-full place-items-center overflow-hidden px-5 py-18 text-center sm:px-10">
			<div aria-hidden="true" class="absolute left-[7.8%] top-0 h-full w-px bg-margin-red/70"></div>
			<div aria-hidden="true" class="absolute right-[8%] top-[10%] hidden h-26 w-26 rotate-6 rounded-full border border-accent-blue/30 sm:block"></div>
			<p class="hero-animate opacity-0 m-0 font-serif text-xs font-semibold uppercase tracking-[0.34em] text-accent-blue">The archive</p>
			<h1 class="hero-animate opacity-0 m-0 max-w-[11ch] font-handwritten text-[clamp(5.2rem,16vw,13.5rem)] leading-[0.73] text-ink-dark">
				Voice of an African Child
			</h1>
			<div aria-hidden="true" class="hero-animate opacity-0 mt-7 h-px w-[min(420px,70vw)] bg-ink-dark/30"></div>
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

		<div bind:this={cardsRef} class="desk-grid shell">
			{#each data.allPosts as post, i}
				<div
					class="desk-post"
					style={`--desk-x: ${cardLayouts[i]?.x ?? 0}rem; --desk-y: ${cardLayouts[i]?.y ?? 0}rem; --desk-r: ${cardLayouts[i]?.r ?? 0}deg;`}
				>
					<PostCard {post} index={i} />
				</div>
			{/each}
		</div>
	</section>
</main>
