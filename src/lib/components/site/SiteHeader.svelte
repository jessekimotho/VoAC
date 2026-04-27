<script lang="ts">
	import LoginModal from './LoginModal.svelte';

	let { data }: { data?: { authenticated?: boolean } } = $props();
	let showLoginModal = $state(false);
</script>

<header class="relative z-20 border-b border-paper/10 text-paper">
	<div class="shell flex min-h-18 items-center justify-between gap-4">
		<a href="/" class="inline-flex items-center gap-3 text-paper transition-colors hover:text-note-1" aria-label="Voice of an African Child home">
			<span class="grid h-10 w-10 place-items-center border border-paper/24 font-serif text-[0.65rem] font-bold uppercase tracking-[0.14em] text-paper/90">VoAC</span>
			<strong class="hidden font-handwritten text-2xl leading-none sm:inline">Voice of an African Child</strong>
		</a>

		<nav aria-label="Main navigation" class="flex items-center gap-4 font-serif text-sm font-semibold text-paper/75">
			{#if data?.authenticated}
				<a href="/posts/new" class="hover:text-paper transition-colors">New post</a>
				<form method="POST" action="/api/auth/logout">
					<button type="submit" class="hover:text-paper transition-colors cursor-pointer">Sign out</button>
				</form>
			{/if}
		</nav>
	</div>
</header>
