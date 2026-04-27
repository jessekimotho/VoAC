<script lang="ts">
	import '../app.css';
	import SiteHeader from '$lib/components/site/SiteHeader.svelte';

	let { children } = $props();
</script>

<SiteHeader />

{@render children()}

<footer class="site-footer">
	<div class="shell footer-inner">
		<p>Voice of an African Child</p>
		<p class="muted">Stories unbound. Rebuilt from the old WordPress archive.</p>
	</div>
</footer>

<style>
	.site-footer {
		margin-top: 5rem;
		padding: 2rem 0;
		border-top: 1px solid rgba(44, 42, 38, 0.12);
	}

	.footer-inner {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		font-size: 0.92rem;
	}

	.footer-inner p {
		margin: 0;
	}

	@media (max-width: 680px) {
		.footer-inner {
			display: grid;
		}
	}
</style>

