<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Studio | Voice of an African Child</title>
</svelte:head>

<main class="shell studio">
	<p class="eyebrow">Studio</p>
	<h1>Editorial cockpit</h1>
	<p class="muted">
		This is the placeholder for the editor area: login, post list, Tiptap editing, media uploads,
		and comment moderation.
	</p>

	<div class="status">
		<strong>Supabase service connection</strong>
		<span class:ready={data.hasSupabaseServiceEnv}>
			{data.hasSupabaseServiceEnv ? 'Ready' : 'Waiting for env vars'}
		</span>
	</div>

	<section>
		<h2>Next studio modules</h2>
		<ul>
			<li>Auth guard using Supabase Auth profiles and editor roles.</li>
			<li>Post table with draft/published/archive filters.</li>
			<li>Tiptap rich editor with image picker and publish controls.</li>
			<li>Comment moderation queue for pending replies.</li>
		</ul>
	</section>
</main>

<style>
	.studio {
		max-width: 780px;
		padding-top: 4rem;
	}

	h1 {
		margin: 0.3rem 0 1rem;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(3rem, 9vw, 6rem);
		line-height: 0.94;
	}

	.status,
	section {
		margin-top: 2rem;
		padding: 1rem;
		border: 1px solid rgba(44, 42, 38, 0.12);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.52);
	}

	.status {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.status span {
		color: #9d3d2f;
		font-weight: 800;
	}

	.status span.ready {
		color: #276749;
	}

	h2 {
		margin-top: 0;
		font-family: Georgia, "Times New Roman", serif;
	}

	li {
		margin: 0.5rem 0;
	}
</style>
