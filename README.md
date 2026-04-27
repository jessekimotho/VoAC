# Voice of an African Child

Repo blueprint for rebuilding the old WordPress site as a SvelteKit app on Vercel with Supabase for auth, content, comments, and media storage.

## Current State

- SvelteKit app lives in `web/`.
- Original WordPress WXR exports live in this folder.
- Processed migration output lives in `migration_export/`.
- Export/reprocessing scripts live in `tools/`.
- Architecture and build plan live in `docs/`.
- Supabase starter schema lives in `supabase/schema.sql`.
- Supabase CLI notes live in `docs/SUPABASE_CLI.md`.

## Target Stack

- SvelteKit + TypeScript
- Vercel deployment with `@sveltejs/adapter-vercel`
- Supabase Postgres, Auth, Storage, and optional Realtime
- Tiptap rich text editor for admin editing
- HTML/JSON content storage for migrated WordPress posts

## First Build Commands

```bash
cd web
npm run dev
```

The app currently falls back to `migration_export/content` when Supabase env vars are not present. After creating a Supabase project, run the SQL in `supabase/schema.sql`, add `web/.env.local`, then import the migration:

```bash
cd web
npm run import:migration
```
