# CBV_Web

Marketing site for ClawbackVault (clawbackvault.com).

Stack: TanStack Start + Vite + Cloudflare Workers + Supabase.

## Local setup

1. Copy `.env.example` to `.env` and fill in real values:

   ```bash
   cp .env.example .env
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the dev server:

   ```bash
   pnpm dev
   ```

## SECURITY NOTICE — rotate the Supabase anon key

A previous version of this repository committed a real `.env` file containing
the Supabase publishable (anon) key to the public GitHub history. Anyone who
cloned or viewed the repo before that commit was removed may have a copy.

**Required immediate action:**

1. Open the Supabase dashboard for project `zdowaetbjtdojgkgoxmn` (eu-west-1).
2. Go to **Project Settings → API**.
3. Rotate the `anon` / `publishable` key.
4. Update the new key in:
   - Local `.env` files for every developer
   - Cloudflare Workers / Wrangler secrets for this site
   - Vercel environment variables for the `cbv-app` product application
5. After rotation, purge the old key from any cached deployments.

The `.env` file is now listed in `.gitignore` and must never be committed. Use
`.env.example` as the template for required variable names.

## Related repositories

This is one of two repositories that share the same Supabase project. See
[`INTEGRATION.md`](./INTEGRATION.md) for the full integration map between this
marketing site and the `cbv-app` product application.
