create extension if not exists pgcrypto;

create type public.post_status as enum ('draft', 'published', 'scheduled', 'archived');
create type public.post_type as enum ('post', 'page');
create type public.comment_status as enum ('pending', 'approved', 'rejected', 'spam');
create type public.profile_role as enum ('owner', 'editor', 'contributor', 'reader');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  email text,
  role public.profile_role not null default 'reader',
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete set null,
  primary_category_id uuid references public.categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  content_source text not null default 'tiptap',
  content_json jsonb,
  content_html text not null default '',
  status public.post_status not null default 'draft',
  post_type public.post_type not null default 'post',
  featured boolean not null default false,
  hero_image_url text,
  seo_title text,
  seo_description text,
  wordpress_id text,
  wordpress_source text,
  original_url text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_status_published_at_idx on public.posts (status, published_at desc);
create index posts_post_type_idx on public.posts (post_type);
create index posts_primary_category_idx on public.posts (primary_category_id);

create table public.post_categories (
  post_id uuid not null references public.posts(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (post_id, category_id)
);

create table public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  author_email text,
  author_url text,
  body text not null,
  status public.comment_status not null default 'pending',
  source text not null default 'site',
  wordpress_id text,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index comments_post_status_idx on public.comments (post_id, status, created_at);
create index comments_parent_idx on public.comments (parent_id);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  post_id uuid references public.posts(id) on delete set null,
  bucket text not null default 'media',
  storage_path text not null,
  public_url text,
  alt_text text,
  caption text,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  wordpress_id text,
  original_url text,
  created_at timestamptz not null default now()
);

create unique index media_assets_bucket_path_idx on public.media_assets (bucket, storage_path);

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('owner', 'editor')
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.posts enable row level security;
alter table public.post_categories enable row level security;
alter table public.post_tags enable row level security;
alter table public.comments enable row level security;
alter table public.media_assets enable row level security;

create policy "Public can read published posts"
on public.posts for select
using (status = 'published' or public.is_editor());

create policy "Editors manage posts"
on public.posts for all
using (public.is_editor())
with check (public.is_editor());

create policy "Public can read taxonomy"
on public.categories for select
using (true);

create policy "Editors manage categories"
on public.categories for all
using (public.is_editor())
with check (public.is_editor());

create policy "Public can read tags"
on public.tags for select
using (true);

create policy "Editors manage tags"
on public.tags for all
using (public.is_editor())
with check (public.is_editor());

create policy "Public can read post categories"
on public.post_categories for select
using (
  public.is_editor()
  or exists (
    select 1
    from public.posts
    where posts.id = post_categories.post_id
      and posts.status = 'published'
  )
);

create policy "Editors manage post categories"
on public.post_categories for all
using (public.is_editor())
with check (public.is_editor());

create policy "Public can read post tags"
on public.post_tags for select
using (
  public.is_editor()
  or exists (
    select 1
    from public.posts
    where posts.id = post_tags.post_id
      and posts.status = 'published'
  )
);

create policy "Editors manage post tags"
on public.post_tags for all
using (public.is_editor())
with check (public.is_editor());

create policy "Public can read approved comments"
on public.comments for select
using (
  public.is_editor()
  or (
    status = 'approved'
    and exists (
      select 1
      from public.posts
      where posts.id = comments.post_id
        and posts.status = 'published'
    )
  )
);

create policy "Anyone can create pending comments"
on public.comments for insert
with check (
  status = 'pending'
  and exists (
    select 1
    from public.posts
    where posts.id = comments.post_id
      and posts.status = 'published'
  )
);

create policy "Editors manage comments"
on public.comments for all
using (public.is_editor())
with check (public.is_editor());

create policy "Profiles are visible"
on public.profiles for select
using (true);

create policy "Users can update own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "Editors read media assets"
on public.media_assets for select
using (public.is_editor() or public_url is not null);

create policy "Editors manage media assets"
on public.media_assets for all
using (public.is_editor())
with check (public.is_editor());
