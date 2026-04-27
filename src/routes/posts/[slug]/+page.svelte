<script lang="ts">
	import CommentList from '$lib/components/comments/CommentList.svelte';
	import PostEditorForm from '$lib/components/editor/PostEditorForm.svelte';

	let { data, form }: { data: any, form?: any } = $props();
	let isEditing = $state(false);
	let articleRef: HTMLElement | undefined = $state();

	const date = $derived(
		data.post.published_at
			? new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(data.post.published_at))
			: 'Undated'
	);
</script>

<svelte:head>
	<title>{data.post.title} | Voice of an African Child</title>
	<meta name="description" content={data.post.excerpt ?? data.post.title} />
</svelte:head>

<main class="desk-stage py-10 sm:py-16">
	{#if data.authenticated && isEditing && data.studioPost}
		<div class="shell min-w-0 max-w-[min(1120px,calc(100vw-32px))] pt-12">
			<p class="eyebrow">Edit mode</p>
			<h1 class="m-0 mb-6 font-handwritten text-[clamp(2.6rem,7vw,5.8rem)] leading-[0.94] text-ink-dark">Edit post</h1>
			<PostEditorForm post={data.studioPost} {form} />
			<button class="mt-4 cursor-pointer rounded-md border-0 bg-transparent px-4 py-2 text-ink-mid font-serif font-bold hover:text-accent-ink transition-colors" onclick={() => isEditing = false}>Cancel</button>
		</div>
	{:else}
		<article bind:this={articleRef} class="paper-sheet shell min-w-0 px-[clamp(1.1rem,4vw,4rem)] py-[clamp(1.4rem,5vw,4.5rem)]">
			<header class="relative mb-10">
				<div class="mb-8 flex items-center justify-between gap-3">
					<a href="/" class="eyebrow hover:text-ink-dark transition-colors">&lt;- Home</a>
					{#if data.authenticated}
						<button class="cursor-pointer rounded-md border-0 bg-ink-dark px-4 py-2 text-paper text-xs font-serif font-bold hover:bg-accent-ink transition-colors" onclick={() => isEditing = true}>Edit</button>
					{/if}
				</div>
				<div class="grid gap-7 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-end">
					<h1 class="m-0 max-w-[12ch] font-handwritten text-[clamp(3.3rem,10vw,8.5rem)] leading-[0.78] text-ink-dark">
						{data.post.title}
					</h1>
					<aside class="grid gap-2 border-t border-ink-dark/20 pt-4 font-serif text-sm text-ink-mid lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
						<span class="text-xs font-bold uppercase tracking-[0.22em] text-accent-blue">Archive note</span>
						<span>{data.post.author_name ?? 'VoAC'}</span>
						<span>{date}</span>
					</aside>
				</div>
			</header>

			<div class="rich-content mx-auto max-w-[760px]">
				{@html data.post.content_html}
			</div>
		</article>

		<section class="shell mx-auto mt-16 max-w-[760px] relative z-10" aria-labelledby="comments-title">
			<div class="grid gap-5 bg-[#fff9c4] p-6 shadow-lg rotate-[-0.5deg] rounded-sm">
				<div>
					<p class="eyebrow">Conversation</p>
					<h2 id="comments-title" class="m-0 mt-1 font-handwritten text-4xl text-ink-dark">Comments</h2>
					<p class="mt-2 font-serif text-ink-light">New comments are held for moderation once Supabase is connected.</p>
				</div>

				{#if data.canSubmitComments}
					<form method="POST" action={`/api/comments?returnTo=/posts/${data.post.slug}`} class="grid gap-4 rounded-md border border-paper-line/50 bg-paper-dark/30 p-4">
					<input type="hidden" name="postId" value={data.post.id} />
					<label class="grid gap-1.5 text-sm font-serif font-bold text-ink-mid">
						Name
						<input name="authorName" required minlength="2" maxlength="80" class="w-full rounded-md border border-paper-line/60 bg-paper px-3 py-2.5 text-ink-dark focus:border-accent-ink focus:outline-none transition-colors" />
					</label>
					<label class="grid gap-1.5 text-sm font-serif font-bold text-ink-mid">
						Email
						<input name="authorEmail" type="email" class="w-full rounded-md border border-paper-line/60 bg-paper px-3 py-2.5 text-ink-dark focus:border-accent-ink focus:outline-none transition-colors" />
					</label>
					<label class="grid gap-1.5 text-sm font-serif font-bold text-ink-mid">
						Comment
						<textarea name="body" required minlength="3" maxlength="4000" class="w-full min-h-30 resize-y rounded-md border border-paper-line/60 bg-paper px-3 py-2.5 text-ink-dark focus:border-accent-ink focus:outline-none transition-colors"></textarea>
					</label>
					<button class="cursor-pointer rounded-md border-0 bg-ink-dark px-5 py-2.5 text-paper font-serif font-bold hover:bg-accent-ink transition-colors">Submit for moderation</button>
				</form>
				{:else}
					<p class="m-0 rounded-md border border-accent-ink/20 bg-paper-dark/30 p-4 font-serif text-ink-mid leading-relaxed">
						Comment posting will switch on after Supabase env vars are added. The UI is wired; the
						database needs its keys.
					</p>
				{/if}

				<CommentList comments={data.comments} />
			</div>
		</section>
	{/if}
</main>
