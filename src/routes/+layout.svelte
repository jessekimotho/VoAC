<script lang="ts">
	import '../app.css';
	import SiteHeader from '$lib/components/site/SiteHeader.svelte';
	import LoginModal from '$lib/components/site/LoginModal.svelte';
	import woodTextureUrl from '$lib/assets/generated/mahogany-motif.jpg';

	let { children, data }: { children: any; data?: { authenticated?: boolean } } = $props();
	let showLoginModal = $state(false);
</script>

<div class="wood-world" style={`--wood-texture: url(${woodTextureUrl});`}>
	<SiteHeader {data} />

	{@render children()}

	<footer class="pt-20 py-8 text-paper">
		<div class="shell flex justify-between gap-4 text-sm text-paper/72 max-sm:grid max-sm:justify-start">
			<p class="m-0 font-handwritten text-xl leading-none text-paper text-pretty">Voice of an African Child</p>
			<p class="m-0 text-pretty">An archive laid out across a desk, made for slow reading.</p>
			{#if data?.authenticated}
				<div class="flex items-center gap-4 font-serif text-sm font-semibold text-paper/75">
					<a href="/posts/new" class="hover:text-paper transition-colors" data-sveltekit-prefetch>New post</a>
					<form method="POST" action="/api/auth/logout">
						<button type="submit" class="hover:text-paper transition-colors cursor-pointer">Sign out</button>
					</form>
				</div>
			{:else}
				<div class="group relative">
					<button
						onclick={() => showLoginModal = true}
						class="m-0 cursor-pointer text-paper/35 transition-colors hover:text-paper/80"
						aria-label="Editor login"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
							<path d="m15 5 4 4"></path>
						</svg>
					</button>
					<div class="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-ink-dark px-2 py-1 text-xs whitespace-nowrap text-paper opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
						Editor
					</div>
				</div>
			{/if}
		</div>
	</footer>
</div>

<LoginModal bind:open={showLoginModal} />
