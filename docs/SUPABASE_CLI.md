# Supabase CLI Setup

The Supabase CLI is initialized in this repo.

## What Is Ready

- `supabase/config.toml`
- `supabase/migrations/20260427090000_initial_voac_schema.sql`
- `supabase/seed.sql`

## Hosted Project Blocker

Creating a new hosted `VoAC` project failed because the Supabase organization is already at the free-plan limit of 2 active projects.

Existing projects visible to the CLI:

- `aidmap`: `wlsqtyxroxjafycdadho`
- `drug-index-store`: `ipkbpevmnowttyyejmar`

## After Freeing A Slot Or Choosing An Existing Project

Link the repo:

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Push the schema:

```bash
supabase db push
```

Fetch API keys:

```bash
supabase projects api-keys --project-ref YOUR_PROJECT_REF --output json
```

Create `web/.env.local`:

```txt
PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
PUBLIC_SITE_URL=http://localhost:5173
```

Import the migrated WordPress content:

```bash
cd web
npm run import:migration
```

## Local Supabase Note

`supabase start` currently cannot run on this machine because Docker is unavailable/not running in this shell.
