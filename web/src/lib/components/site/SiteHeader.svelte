<header class="site-header">
	<div class="shell header-inner">
		<a href="/" class="brand" aria-label="Voice of an African Child home">
			<span>VoAC</span>
			<strong>Voice of an African Child</strong>
		</a>

		<nav aria-label="Main navigation">
			<a href="/posts">Archive</a>
			<a href="/studio">Studio</a>
		</nav>
	</div>
</header>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 10;
		background: rgba(247, 244, 237, 0.88);
		backdrop-filter: blur(14px);
		border-bottom: 1px solid rgba(44, 42, 38, 0.1);
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 68px;
		gap: 1rem;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		font-weight: 800;
	}

	.brand span {
		display: grid;
		place-items: center;
		width: 42px;
		aspect-ratio: 1;
		background: #1f2933;
		color: #f7f4ed;
		border-radius: 50%;
		font-size: 0.78rem;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 1rem;
		color: #5e5a52;
		font-size: 0.94rem;
	}

	nav a:hover {
		color: #9d3d2f;
	}

	@media (max-width: 560px) {
		.brand strong {
			display: none;
		}
	}
</style>

