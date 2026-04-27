<script lang="ts">
	import { browser } from '$app/environment';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';

	let { html = $bindable('') }: { html: string } = $props();

	let element: HTMLDivElement;
	let editor: Editor | null = null;

	$effect(() => {
		if (!browser || editor || !element) return;

		editor = new Editor({
			element,
			extensions: [
				StarterKit,
				Link.configure({
					openOnClick: false,
					autolink: true
				}),
				Image
			],
			content: html || '<p></p>',
			onUpdate: ({ editor }) => {
				html = editor.getHTML();
			}
		});

		return () => {
			editor?.destroy();
			editor = null;
		};
	});

	function run(command: () => void) {
		command();
		html = editor?.getHTML() ?? html;
	}

	function addLink() {
		const href = window.prompt('Link URL');
		if (!href) return;
		run(() => editor?.chain().focus().extendMarkRange('link').setLink({ href }).run());
	}

	function addImage() {
		const src = window.prompt('Image URL');
		if (!src) return;
		run(() => editor?.chain().focus().setImage({ src }).run());
	}
</script>

<div class="toolbar" aria-label="Editor toolbar">
	<button type="button" onclick={() => run(() => editor?.chain().focus().toggleBold().run())}>B</button>
	<button type="button" onclick={() => run(() => editor?.chain().focus().toggleItalic().run())}>I</button>
	<button type="button" onclick={() => run(() => editor?.chain().focus().toggleHeading({ level: 2 }).run())}>H2</button>
	<button type="button" onclick={() => run(() => editor?.chain().focus().toggleBulletList().run())}>List</button>
	<button type="button" onclick={() => run(() => editor?.chain().focus().toggleBlockquote().run())}>Quote</button>
	<button type="button" onclick={addLink}>Link</button>
	<button type="button" onclick={addImage}>Image</button>
</div>

<div bind:this={element} class="editor"></div>

<style>
	.toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		padding: 0.5rem;
		border: 1px solid rgba(44, 42, 38, 0.14);
		border-bottom: 0;
		border-radius: 8px 8px 0 0;
		background: #f7f4ed;
	}

	button {
		min-width: 38px;
		min-height: 34px;
		border: 1px solid rgba(44, 42, 38, 0.16);
		border-radius: 6px;
		background: #fffdfa;
		color: #1b1b19;
		font-weight: 800;
		cursor: pointer;
	}

	.editor {
		min-height: 480px;
		padding: 1rem;
		border: 1px solid rgba(44, 42, 38, 0.14);
		border-radius: 0 0 8px 8px;
		background: #fffdfa;
	}

	:global(.ProseMirror) {
		min-height: 450px;
		outline: none;
		font-family: Georgia, "Times New Roman", serif;
		font-size: 1.08rem;
		line-height: 1.75;
	}
</style>
