<script lang="ts">
	import '../app.css';
	import SiteHeader from '$lib/components/site/SiteHeader.svelte';

	let { children } = $props();
</script>

<SiteHeader />

{@render children()}

<footer class="mt-20 border-t border-paper-line/60 py-8">
	<div class="shell flex justify-between gap-4 text-sm text-ink-mid max-sm:grid max-sm:justify-start">
		<p class="m-0 font-handwritten text-lg text-ink-dark">Voice of an African Child</p>
		<p class="m-0">Stories unbound. Rebuilt from the old WordPress archive.</p>
	</div>
</footer>

