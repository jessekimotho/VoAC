<script lang="ts">
	let { open = $bindable(false) } = $props();
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin() {
		error = '';
		loading = true;
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password })
			});

			if (!response.ok) {
				const data = await response.json();
				error = data.message || 'Login failed';
				return;
			}

			open = false;
			password = '';
			window.location.reload();
		} catch (e) {
			error = 'Login failed';
		} finally {
			loading = false;
		}
	}
</script>

{#if open}
	<div class="modal-backdrop" role="button" tabindex="-1" onclick={() => open = false} onkeydown={(e) => { if (e.key === 'Escape') open = false; }}>
		<div class="modal" role="dialog" aria-modal="true" tabindex="-1">
			<h2>Login</h2>
			{#if error}
				<p class="error">{error}</p>
			{/if}
			<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
				<label>
					Password
					<input type="password" bind:value={password} disabled={loading} />
				</label>
				<button type="submit" disabled={loading || !password}>
					{loading ? 'Logging in...' : 'Login'}
				</button>
			</form>
			<button class="close" onclick={() => open = false}>Cancel</button>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		place-items: center;
		justify-content: center;
		z-index: 100;
	}

	.modal {
		background: #fffdfa;
		padding: 2rem;
		border-radius: 8px;
		min-width: 320px;
		max-width: 400px;
		display: grid;
		gap: 1rem;
	}

	h2 {
		margin: 0;
		font-family: Georgia, "Times New Roman", serif;
	}

	.error {
		margin: 0;
		padding: 0.75rem;
		background: rgba(157, 61, 47, 0.1);
		border: 1px solid rgba(157, 61, 47, 0.3);
		border-radius: 6px;
		color: #9d3d2f;
		font-size: 0.9rem;
	}

	label {
		display: grid;
		gap: 0.35rem;
		color: #514d47;
		font-size: 0.9rem;
		font-weight: 700;
	}

	input {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid rgba(44, 42, 38, 0.18);
		border-radius: 6px;
		background: #fff;
		padding: 0.75rem;
		color: #1b1b19;
	}

	button {
		border: 0;
		border-radius: 6px;
		background: #1f2933;
		color: #f7f4ed;
		min-height: 42px;
		font-weight: 800;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.close {
		background: transparent;
		color: #514d47;
	}
</style>
