<script lang="ts">
	import CommentList from '$lib/components/comments/CommentList.svelte';
	import PostCard from '$lib/components/site/PostCard.svelte';
	import PostEditorForm from '$lib/components/editor/PostEditorForm.svelte';
	import gsap from 'gsap';
	import { onMount } from 'svelte';

	let { data, form }: { data: any, form?: any } = $props();
	let isEditing = $state(false);
	let articleRef: HTMLElement | undefined = $state();

	const date = $derived(
		data.post.published_at
			? new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(data.post.published_at))
			: 'Undated'
	);

	onMount(() => {
		if (!articleRef) return;
		const els = articleRef.querySelectorAll('.post-animate');
		gsap.fromTo(
			els,
			{ opacity: 0, y: 30 },
			{ opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out' }
		);
	});
</script>

<svelte:head>
	<title>{data.post.title} | Voice of an African Child</title>
	<meta name="description" content={data.post.excerpt ?? data.post.title} />
</svelte:head>

<main class="shell grid gap-[clamp(2rem,6vw,5rem)] pt-16 items-start max-lg:grid-cols-1 lg:grid-cols-[minmax(0,760px)_minmax(280px,1fr)]">
	{#if data.authenticated && isEditing && data.studioPost}
		<div class="min-w-0 max-w-[min(1120px,calc(100vw-32px))] pt-12">
			<p class="eyebrow">Edit mode</p>
			<h1 class="m-0 mb-6 font-handwritten text-[clamp(2.6rem,7vw,5.8rem)] leading-[0.94] text-ink-dark">Edit post</h1>
			<PostEditorForm post={data.studioPost} {form} />
			<button class="mt-4 cursor-pointer rounded-md border-0 bg-transparent px-4 py-2 text-ink-mid font-serif font-bold hover:text-accent-ink transition-colors" onclick={() => isEditing = false}>Cancel</button>
		</div>
	{:else}
		<article bind:this={articleRef} class="min-w-0">
			<header class="post-animate opacity-0 relative mb-10">
				<div class="flex items-center gap-3 mb-4">
					<a href="/" class="eyebrow hover:text-ink-dark transition-colors">&larr; Home</a>
					{#if data.authenticated}
						<button class="cursor-pointer rounded-md border-0 bg-ink-dark px-4 py-2 text-paper text-xs font-serif font-bold hover:bg-accent-ink transition-colors" onclick={() => isEditing = true}>Edit</button>
					{/if}
				</div>
				<h1 class="post-animate opacity-0 m-0 font-handwritten text-[clamp(2.6rem,7vw,5.8rem)] leading-[0.94] text-ink-dark">
					{data.post.title}
				</h1>
				<p class="post-animate opacity-0 mt-3 font-handwritten text-xl text-ink-light">
					{date}
					{#if data.post.category_name}
						<span class="text-ink-faint"> / </span>
						<span class="text-accent-ink">{data.post.category_name}</span>
					{/if}
				</p>
				{#if data.post.tags && data.post.tags.length > 0}
					<div class="post-animate opacity-0 mt-4 flex flex-wrap gap-2">
						{#each data.post.tags as tag}
							<span class="rounded-full border border-paper-line/60 bg-paper/60 px-3 py-1 font-handwritten text-base text-ink-mid">{tag}</span>
						{/each}
					</div>
				{/if}
			</header>

			<div class="post-animate opacity-0 rich-content">
				{@html data.post.content_html}
			</div>

			<section class="post-animate opacity-0 mt-16 grid gap-5" aria-labelledby="comments-title">
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
			</section>

			{#if data.related.length}
				<section class="post-animate opacity-0 mt-16 grid gap-5" aria-labelledby="related-title">
					<p class="eyebrow">Keep reading</p>
					<h2 id="related-title" class="m-0 mt-1 font-handwritten text-4xl text-ink-dark">Related posts</h2>
					{#each data.related as post, i}
						<PostCard {post} compact index={i} />
					{/each}
				</section>
			{/if}
		</article>
	{/if}
</main>
