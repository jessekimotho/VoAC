<script lang="ts">
	let { children, data } = $props();
</script>

{#if data.authenticated}
	<div class="studio-nav">
		<div class="shell nav-inner">
			<a href="/studio">Studio</a>
			<a href="/studio/posts">Posts</a>
			<a href="/studio/posts/new">New</a>
			<a href="/studio/link-audit">Links</a>
			<form method="POST" action="/studio/login?/logout">
				<button>Sign out</button>
			</form>
		</div>
	</div>
{/if}

{@render children()}

<style>
	.studio-nav {
		border-bottom: 1px solid rgba(44, 42, 38, 0.12);
		background: rgba(255, 253, 250, 0.72);
	}

	.nav-inner {
		display: flex;
		align-items: center;
		gap: 1rem;
		min-height: 52px;
	}

	a {
		font-weight: 800;
		color: #514d47;
	}

	form {
		margin-left: auto;
	}

	button {
		border: 1px solid rgba(44, 42, 38, 0.16);
		border-radius: 6px;
		background: #fffdfa;
		min-height: 34px;
		padding: 0 0.8rem;
		font-weight: 800;
		cursor: pointer;
	}
</style>

