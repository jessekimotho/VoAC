<script lang="ts">
	import PostCard from '$lib/components/site/PostCard.svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';

	let { data } = $props();

	let heroRef: HTMLElement | undefined = $state();
	let cardsRef: HTMLElement | undefined = $state();

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

			// Hero entrance animation
		if (heroRef) {
			const heroEls = heroRef.querySelectorAll('.hero-animate');
			gsap.fromTo(
				heroEls,
				{ opacity: 0, y: 30, rotate: -1 },
				{ opacity: 1, y: 0, rotate: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }
			);
		}

		// Post cards scroll animation
		if (cardsRef) {
			const cards = cardsRef.querySelectorAll('.post-card');
			gsap.fromTo(
				cards,
				{ opacity: 0, y: 50, rotate: Math.random() > 0.5 ? -2 : 2 },
				{
					opacity: 1,
					y: 0,
					rotate: 0,
					duration: 0.8,
					stagger: 0.12,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: cardsRef,
						start: 'top 80%',
						toggleActions: 'play none none none'
					}
				}
			);
		}
	});
</script>

<svelte:head>
	<title>Voice of an African Child</title>
	<meta
		name="description"
		content="Stories unbound from the Voice of an African Child archive."
	/>
</svelte:head>

<main class="pt-12">
	<section bind:this={heroRef} class="shell grid gap-[clamp(1.5rem,4vw,4rem)] pb-12 max-md:grid-cols-1 md:min-h-[min(620px,calc(100vh-88px))] md:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.75fr)] md:items-end">
		<div class="grid gap-4">
			<p class="eyebrow hero-animate opacity-0">Stories unbound</p>
			<h1 class="hero-animate opacity-0 m-0 max-w-190 font-handwritten text-[clamp(3.4rem,11vw,8.7rem)] leading-[0.86] text-ink-dark">
				Voice of an African Child
			</h1>
			<p class="hero-animate opacity-0 m-0 max-w-155 font-serif text-ink-mid leading-relaxed">
				Essays, travel notes, book reviews, campus stories, and the beautifully stubborn archive
				of an old WordPress life brought into a new home.
			</p>
		</div>

		{#if data.featured}
			<a class="hero-animate opacity-0 grid gap-4 rounded-sm border border-paper-line/40 bg-note-1 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md" href={`/posts/${data.featured.slug}`}>
				<span class="font-handwritten text-xl text-accent-ink">{data.featured.category_name ?? 'Featured'}</span>
				<h2 class="m-0 font-handwritten text-[clamp(1.8rem,3vw,3rem)] leading-none text-ink-dark">
					{data.featured.title}
				</h2>
				<p class="m-0 font-serif text-ink-mid leading-relaxed">
					{data.featured.excerpt}
				</p>
				<strong class="font-handwritten text-xl text-accent-ink">Read essay &rarr;</strong>
			</a>
		{/if}
	</section>

	<section class="shell" aria-label="All posts">
		<div class="mb-6">
			<p class="eyebrow">All posts</p>
			<h2 class="m-0 mt-1 font-handwritten text-4xl text-ink-dark">Writing</h2>
		</div>

		<div bind:this={cardsRef} class="grid gap-6">
			{#each data.allPosts as post, i}
				<PostCard {post} index={i} />
			{/each}
		</div>
	</section>
</main>

