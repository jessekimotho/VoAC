# VoAC SvelteKit Architecture

## Product Shape

The rebuild should be a real publication app, not just static nostalgia preservation:

- Public blog homepage with featured writing, recent posts, category navigation, and search/filtering.
- Public post detail pages with preserved migrated content, images, tags, comments, and threaded replies.
- Authenticated editor area for writing, editing, publishing, uploading media, and curating tags/categories.
- Supabase-backed comments with moderation so the public site does not become a spam sink.
- Vercel-hosted SvelteKit app with server-side reads for SEO and stable share links.

## Recommended Stack

- SvelteKit with TypeScript.
- `@sveltejs/adapter-vercel` for deployment.
- Supabase Postgres as source of truth.
- Supabase Auth for editor login and optional commenter identity.
- Supabase Storage bucket named `media` for post images.
- Tiptap for the rich editor, storing both JSON and rendered HTML.

Why store both editor JSON and HTML:

- Tiptap JSON is the editable source.
- HTML is the fast render source for public pages.
- Migrated WordPress content can start as HTML even before every post is manually polished.

## Route Map

```txt
src/routes/
  +layout.server.ts
  +layout.svelte
  +page.server.ts
  +page.svelte                         Blog homepage
  posts/
    +page.server.ts
    +page.svelte                       Paginated archive
    [slug]/
      +page.server.ts
      +page.svelte                     Post detail + comments
  categories/
    [slug]/
      +page.server.ts
      +page.svelte
  tags/
    [slug]/
      +page.server.ts
      +page.svelte
  auth/
    login/
      +page.svelte
      +page.server.ts
    callback/
      +server.ts
  studio/
    +layout.server.ts                  Editor-only guard
    +layout.svelte
    +page.server.ts                    Dashboard
    posts/
      +page.server.ts
      +page.svelte                     Table/list editor
      new/
        +page.server.ts
        +page.svelte
      [id]/
        +page.server.ts
        +page.svelte                   Tiptap editor
    media/
      +page.server.ts
      +page.svelte                     Upload/browser
    comments/
      +page.server.ts
      +page.svelte                     Moderate comments
  api/
    comments/
      +server.ts                       Create comment/reply
    media/
      sign-upload/
        +server.ts                     Signed upload flow
```

## App Library Layout

```txt
src/lib/
  server/
    supabase.ts                        Server admin helpers
    posts.ts                           Post queries/mutations
    comments.ts                        Comment queries/mutations
    media.ts                           Storage helpers
    auth.ts                            Role checks
  components/
    site/
      Header.svelte
      Footer.svelte
      PostCard.svelte
      CategoryNav.svelte
    comments/
      CommentList.svelte
      CommentForm.svelte
      ReplyForm.svelte
    editor/
      RichTextEditor.svelte
      PostSettings.svelte
      MediaPicker.svelte
      PublishControls.svelte
  styles/
    app.css
```

## Public Homepage

The first screen should feel like an editorial home:

- Large latest/featured post area using real post title, excerpt, category, date, and hero image.
- A tight recent posts list for scanning.
- Category rail: Travel, Book Review, Village Stories, Politricks, Slice of Life, Whack Poetry, etc.
- Search input that filters by title/excerpt/tags.
- No marketing hero. The writing itself is the hero.

Suggested query:

```sql
select
  p.slug,
  p.title,
  p.excerpt,
  p.published_at,
  p.hero_image_url,
  c.name as category_name,
  c.slug as category_slug
from posts p
left join categories c on c.id = p.primary_category_id
where p.status = 'published'
order by p.featured desc, p.published_at desc
limit 12;
```

## Post Detail

Each post page should load server-side:

- Post by slug.
- Author profile.
- Categories and tags.
- Approved comments as a tree.
- Related posts by category/tags.

Render `posts.content_html` with server-sanitized HTML. For new Tiptap posts, generate HTML from JSON on save. For imported WordPress posts, preserve the WordPress HTML first, then clean post-by-post over time.

## Comments

Comments should support anonymous names/emails or authenticated users. Keep anonymous comments moderated by default.

Flow:

1. Visitor submits top-level comment or reply.
2. Server validates body length, post status, parent comment, and basic spam fields.
3. Insert comment with `status = 'pending'`.
4. Editor approves it in `/studio/comments`.
5. Approved comments appear publicly.

Optional later:

- Email notifications.
- Turnstile/hCaptcha.
- Supabase Realtime updates on post pages.

## Editor Area

Use `/studio` for the editorial back office.

Roles:

- `owner`: full control.
- `editor`: create/edit/publish posts and moderate comments.
- `contributor`: create drafts only.

Editor screens:

- Dashboard: recent drafts, pending comments, migration cleanup progress.
- Post list: status filters, category filters, search.
- Post editor: title, slug, excerpt, hero image, tags, categories, rich text body, SEO metadata.
- Media library: upload, preview, copy/select image.
- Comments: approve, reject, mark spam, reply.

## Rich Editor

Use Tiptap with:

- StarterKit
- Link
- Image
- Placeholder
- CharacterCount
- CodeBlockLowlight if code snippets matter

Storage:

- `content_json`: Tiptap JSON document.
- `content_html`: render-ready HTML.
- `content_source`: `wordpress`, `tiptap`, or `markdown`.

For old posts, set `content_source = 'wordpress'` and keep the migrated HTML. When edited in Tiptap, convert to Tiptap JSON once and change `content_source = 'tiptap'`.

## Media

Supabase Storage:

- Bucket: `media`
- Paths:
  - `posts/{post_id}/{filename}`
  - `imports/wordpress/{filename}`
  - `authors/{profile_id}/{filename}`

Store metadata in `media_assets`, not only in Storage. This lets the editor search, reuse images, and replace broken WordPress links later.

## Data Import Path

1. Use `migration_export/content/posts` and `migration_export/content/pages` as the cleaned source.
2. Import posts into Supabase with `content_html` populated from the body.
3. Import categories/tags from frontmatter.
4. Import WordPress comments into `comments` with `source = 'wordpress'` and `status = 'approved'` unless you want to re-moderate.
5. Download attachment URLs with `tools/download_wordpress_media.py`.
6. Upload downloaded files to Supabase Storage.
7. Rewrite old image URLs in `content_html` to Supabase public/signed URLs.

## Deployment

Vercel environment variables:

```txt
PUBLIC_SUPABASE_URL
PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
PUBLIC_SITE_URL
```

Use the service role key only in server-only modules and never expose it to client code.

## Build Phases

1. Scaffold SvelteKit app in `web/`.
2. Wire Supabase SSR auth.
3. Create schema and RLS policies.
4. Build public homepage and post detail pages.
5. Build comments with moderation.
6. Build editor login and guarded `/studio`.
7. Add Tiptap editor and media uploads.
8. Write importer from `migration_export` to Supabase.
9. Deploy to Vercel.

