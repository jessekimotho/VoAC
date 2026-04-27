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
	</div>
</header>
