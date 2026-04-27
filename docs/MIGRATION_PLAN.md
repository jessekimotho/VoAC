# Migration Plan

## Source Assets

- `voiceofanafricanchild.wordpress.2019-03-11.001.xml`: WordPress.com export.
- `voiceofanafricanchild.WordPress.2019-03-12.xml`: self-hosted WordPress export and likely the better primary source.
- `migration_export/`: parsed and merged working copy.

## Already Done

- Parsed both WXR XML files.
- Removed null bytes from the older XML copy.
- Created frontmatter-wrapped post/page files.
- Created JSON chunks for AI cleanup and staged imports.
- Created attachment metadata from WXR records.

## Import Order

1. Import authors into `profiles`.
2. Import categories and tags.
3. Import posts/pages.
4. Import post-category and post-tag joins.
5. Import comments.
6. Download and upload media.
7. Rewrite inline media links.

## Content Decisions

- Published WordPress posts should become `published`.
- Draft WordPress posts should remain `draft`.
- Trashed WordPress posts should import as `archived` or stay out of public routes.
- WordPress pages can live in the same `posts` table with `post_type = 'page'`, unless the site later needs a more page-builder-like CMS.

## AI Cleanup Batches

Use `migration_export/chunks/post-001.json` through `post-004.json`.

Suggested cleanup prompt:

```txt
Clean these migrated WordPress posts for a SvelteKit/Supabase blog.
Preserve voice and paragraph structure.
Return JSON with title, slug, excerpt, categories, tags, content_html, and cleanup_notes.
Do not invent facts or add new sections.
```

## Broken Media Risk

The WordPress export contains attachment URLs, not image binaries. Some old URLs may be unavailable. Run:

```bash
python3 tools/download_wordpress_media.py --attachments migration_export/data/attachments.json --out migration_export/media
```

Then upload anything recovered into Supabase Storage.

