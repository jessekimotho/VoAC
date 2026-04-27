<script lang="ts">
	import LoginModal from './LoginModal.svelte';

	let { data }: { data?: { authenticated?: boolean } } = $props();
	let showLoginModal = $state(false);
</script>

<header class="relative z-20 pt-6 pb-2 text-paper">
	<div class="shell flex min-h-14 items-center justify-center gap-4">
		<a href="/" class="max-w-full font-handwritten text-xl leading-none text-paper transition-colors hover:text-note-1 text-center text-pretty" aria-label="Voice of an African Child home" data-sveltekit-prefetch>
			Voice of an African Child
		</a>
	</div>
</header>
