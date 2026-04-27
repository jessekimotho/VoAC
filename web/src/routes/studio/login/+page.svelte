<script lang="ts">
	let { data, form } = $props();
</script>

<svelte:head>
	<title>Studio Login | Voice of an African Child</title>
</svelte:head>

<main class="shell login">
	<p class="eyebrow">Studio</p>
	<h1>Sign in</h1>

	{#if data.configured}
		<form method="POST" action="?/login">
			<label>
				Password
				<input type="password" name="password" required />
			</label>
			{#if form?.message}
				<p class="error">{form.message}</p>
			{/if}
			<button>Enter studio</button>
		</form>
	{:else}
		<p class="notice">Set <code>ADMIN_PASSWORD</code> before using the studio.</p>
	{/if}
</main>

<style>
	.login {
		max-width: 480px;
		padding-top: 5rem;
	}

	h1 {
		margin: 0.3rem 0 1.5rem;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(3rem, 9vw, 5rem);
		line-height: 0.92;
	}

	form {
		display: grid;
		gap: 1rem;
	}

	label {
		display: grid;
		gap: 0.4rem;
		font-weight: 800;
	}

	input {
		min-height: 44px;
		border: 1px solid rgba(44, 42, 38, 0.18);
		border-radius: 6px;
		padding: 0 0.8rem;
		background: #fffdfa;
	}

	button {
		min-height: 44px;
		border: 0;
		border-radius: 6px;
		background: #1f2933;
		color: #f7f4ed;
		font-weight: 900;
		cursor: pointer;
	}

	.error,
	.notice {
		margin: 0;
		color: #9d3d2f;
	}
</style>
