# Implementation Checklist

## Repo Setup

- [x] Run `git init`.
- [x] Scaffold SvelteKit into `web/`.
- [x] Add Vercel adapter.
- [ ] Add Supabase env vars to `.env.local`.
- [ ] Create Supabase project.
- [ ] Run `supabase/schema.sql`.

## Public Site

- [x] Blog homepage.
- [x] Post archive.
- [x] Post detail pages.
- [ ] Category pages.
- [ ] Tag pages.
- [ ] SEO metadata.
- [ ] RSS feed.

## Comments

- [x] Comment form.
- [ ] Reply form.
- [x] Server validation.
- [x] Pending-by-default insert.
- [x] Approved comment tree rendering.
- [ ] Studio moderation queue.

## Editor

- [ ] Auth login.
- [ ] `/studio` route guard.
- [ ] Post list.
- [ ] Rich text editor.
- [ ] Tag/category controls.
- [ ] Hero image selector.
- [ ] Media upload.
- [ ] Publish controls.

## Migration

- [x] Import categories.
- [x] Import tags.
- [x] Import posts/pages.
- [ ] Import comments.
- [ ] Download WordPress media.
- [ ] Upload media to Supabase Storage.
- [ ] Rewrite old media URLs.
