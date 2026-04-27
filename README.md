# Voice of an African Child

Repo blueprint for rebuilding the old WordPress site as a SvelteKit app on Vercel with Supabase for auth, content, comments, and media storage.

## Current State

- Original WordPress WXR exports live in this folder.
- Processed migration output lives in `migration_export/`.
- Export/reprocessing scripts live in `tools/`.
- Architecture and build plan live in `docs/`.
- Supabase starter schema lives in `supabase/schema.sql`.

## Target Stack

- SvelteKit + TypeScript
- Vercel deployment with `@sveltejs/adapter-vercel`
- Supabase Postgres, Auth, Storage, and optional Realtime
- Tiptap rich text editor for admin editing
- HTML/JSON content storage for migrated WordPress posts

## First Build Commands

```bash
npm create svelte@latest web
cd web
npm install
npm install @sveltejs/adapter-vercel @supabase/supabase-js @supabase/ssr
npm install @tiptap/core @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image
```

After scaffolding, copy the architecture from `docs/ARCHITECTURE.md` into the app structure and run the SQL in `supabase/schema.sql` in your Supabase project.

