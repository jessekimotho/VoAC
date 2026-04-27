<script lang="ts">
	import LoginModal from './LoginModal.svelte';

	let { data }: { data?: { authenticated?: boolean } } = $props();
	let showLoginModal = $state(false);
</script>

<header class="sticky top-0 z-10 border-b border-paper-line/50 bg-paper/80 backdrop-blur-md">
	<div class="shell flex min-h-17 items-center justify-between gap-4">
		<a href="/" class="inline-flex items-center gap-3 font-handwritten text-2xl text-ink-dark hover:text-accent-ink transition-colors" aria-label="Voice of an African Child home">
			<span class="grid h-10.5 w-10.5 place-items-center rounded-full bg-ink-dark text-paper text-sm font-serif font-bold">VoAC</span>
			<strong class="hidden sm:inline">Voice of an African Child</strong>
		</a>

		<nav aria-label="Main navigation" class="flex items-center gap-4 text-ink-mid text-sm font-serif">
			{#if data?.authenticated}
				<a href="/posts/new" class="hover:text-accent-ink transition-colors">New post</a>
				<form method="POST" action="/api/auth/logout">
					<button type="submit" class="hover:text-accent-ink transition-colors cursor-pointer">Sign out</button>
				</form>
			{:else}
				<button onclick={() => showLoginModal = true} class="hover:text-accent-ink transition-colors cursor-pointer">Sign in</button>
			{/if}
		</nav>
	</div>
	<LoginModal bind:open={showLoginModal} />
</header>

