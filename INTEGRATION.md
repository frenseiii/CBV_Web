# ClawbackVault Integration Guide

## Two repos, one Supabase project

|                | CBV_Web                | cbv-app                  |
| -------------- | ---------------------- | ------------------------ |
| Purpose        | Marketing site         | Product application      |
| URL            | clawbackvault.com      | app.clawbackvault.com    |
| Runtime        | Cloudflare Workers (Vite) | Vercel (Next.js 14)   |
| Supabase       | Shared — same project  | Shared — same project    |
| Email          | hello@ (Loops/Mailchimp) | alerts@ (Resend)       |

## Ghost Audit flow (cross-site)

1. Broker clicks CTA on clawbackvault.com
2. Browser navigates to app.clawbackvault.com/ghost-audit
3. Pre-consent screen renders
4. Broker approves Gmail OAuth
5. OAuth callback hits app.clawbackvault.com/api/auth/callback
6. Scan runs, results render at app.clawbackvault.com/ghost-audit/results

## Environment variables needed before first run

### CBV_Web (Cloudflare / Wrangler)

- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY
- VITE_SUPABASE_PROJECT_ID

### cbv-app (Vercel)

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_APP_URL
- SUPABASE_SERVICE_ROLE_KEY
- ANTHROPIC_API_KEY
- RESEND_API_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

## Before Sprint 2 starts — required manual actions

- [ ] Rotate Supabase anon key (current one was exposed in public repo)
- [ ] Register app.clawbackvault.com/api/auth/callback in Google Cloud Console
- [ ] Register app.clawbackvault.com/api/auth/callback in Microsoft Azure App Registration
- [ ] Set NEXT_PUBLIC_APP_URL in Vercel environment variables
- [ ] Start Meta Business verification for WhatsApp (Twilio) — takes 2-4 weeks
- [ ] Confirm Resend domain verification for alerts@clawbackvault.com

## Database

Run `supabase/migrations/001_sprint1_schema.sql` against the shared Supabase project before any feature work begins.
Apply via: `supabase db push` or paste directly into the Supabase SQL editor.
