<script lang="ts">
	import LoginModal from './LoginModal.svelte';

	let { data }: { data?: { authenticated?: boolean } } = $props();
	let showLoginModal = $state(false);
</script>

<header class="relative z-20 border-b border-paper/10 text-paper">
	<div class="shell flex min-h-14 items-center justify-center gap-4">
		<a href="/" class="font-handwritten text-xl leading-none text-paper transition-colors hover:text-note-1" aria-label="Voice of an African Child home">
			Voice of an African Child
		</a>

		<nav aria-label="Main navigation" class="absolute right-0 flex items-center gap-4 font-serif text-sm font-semibold text-paper/75">
			{#if data?.authenticated}
				<a href="/posts/new" class="hover:text-paper transition-colors">New post</a>
				<form method="POST" action="/api/auth/logout">
					<button type="submit" class="hover:text-paper transition-colors cursor-pointer">Sign out</button>
				</form>
			{/if}
		</nav>
	</div>
</header>
