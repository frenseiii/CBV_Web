# ClawbackVault Integration Guide

## Three repos, one Supabase project

|                | CBV_Web                | cb/ (Clawback Shield)      | cbv-app                  |
| -------------- | ---------------------- | -------------------------- | ------------------------ |
| Purpose        | Marketing site         | Product application        | **ARCHIVED scaffolding** |
| URL            | clawbackvault.com      | app.clawbackvault.com      | n/a                      |
| Runtime        | Cloudflare Workers (Vite) | Vercel (Next.js 14)     | n/a                      |
| Supabase       | Shared — same project  | Shared — same project      | n/a                      |
| Email          | hello@ (Loops/Mailchimp) | alerts@ (Resend), Ghost Assistant via Resend, T1 alerts via Twilio WhatsApp | n/a |
| State          | Live                   | Sprint 5+6 complete, v10 remediation done | Superseded — see cbv-app/ARCHIVED.md |

`cb/` (the `frenseiii/clawbackshield` repo, also referred to as Clawback Shield
in its own `CLAUDE.md`) is the full v10 product application. It already ships:
Gmail + Outlook OAuth with AES-256-GCM token encryption, the QStash worker
fleet (sync-emails, ghost-audit, classify-signal, silence-detector, …), the
NVIDIA NIM + Claude Sonnet classifier stack, alerting (Resend / Twilio / Slack),
Stripe billing with tier routing, and 18 production migrations.

`cbv-app` was scaffolded as a stand-alone Ghost Audit preview before that
overlap was understood. It is now archived (see [`cbv-app/ARCHIVED.md`](https://github.com/frenseiii/cbv-app/blob/main/ARCHIVED.md)).
Do not deploy it. Do not apply its migrations.

## Ghost Audit flow (cross-site)

1. Broker clicks CTA on clawbackvault.com
2. Browser navigates to **app.clawbackvault.com** (currently the CTAs target
   `/ghost-audit`; the entry path on `cb/` needs to be finalised — see
   [Open question](#open-question-ghost-audit-entry-path) below).
3. cb/ runs the broker through signup → Gmail OAuth → `/onboarding`
4. `/onboarding` polls the `ghost-audit` QStash worker via the SSE / status
   endpoint and renders live progress
5. Broker lands on `/onboarding/results` with their signal list and the
   upgrade path

## Open question — Ghost Audit entry path

CBV_Web CTAs currently point at `https://app.clawbackvault.com/ghost-audit`.
cb/ does not yet have that route. Two reconciliation options:

- **A.** Add a public `/ghost-audit` page to cb/ that does the pre-consent
  screen and then triggers signup → OAuth → onboarding. This matches what
  CBV_Web already promises.
- **B.** Change CBV_Web CTAs to `/signup` (or `/login?next=/onboarding`) so
  that the marketing site lands users into cb/'s existing flow.

Whichever wins, the change needs to land in this repo *and* the relevant
route needs to exist on cb/ before the marketing CTAs are pointed at
production.

## Environment variables needed before first run

### CBV_Web (Cloudflare / Wrangler)

- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY
- VITE_SUPABASE_PROJECT_ID

### cb/ (Vercel) — see cb/.env.example for the full list

Critical:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ENCRYPTION_KEY (64 hex chars — token encryption)
- ANTHROPIC_API_KEY
- NVIDIA_API_KEY (T1/T2 classifier via NIM)
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
- QSTASH_TOKEN / QSTASH_CURRENT_SIGNING_KEY / QSTASH_NEXT_SIGNING_KEY
- UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
- RESEND_API_KEY
- TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_WHATSAPP_FROM
- SLACK_BOT_TOKEN (optional, Growth/Agency tiers)
- STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET
- SENTRY_DSN

## Required manual actions

- [ ] **Rotate the Supabase anon key** (the original was exposed in this repo's
      git history; the README's security notice covers this)
- [ ] Register `app.clawbackvault.com/api/auth/callback/google` in Google Cloud
      Console (and `/microsoft` if/when Outlook is re-enabled — currently
      disabled in cb/ per its `CLAUDE.md`)
- [ ] Set every cb/ env var above in Vercel (production + preview)
- [ ] Decide CBV_Web CTA entry path (option A or B above) and ship the change
- [ ] Confirm Resend domain verification for `alerts@clawbackvault.com`
- [ ] Start Meta Business verification for WhatsApp (Twilio) — takes 2–4 weeks

## Database

**Do NOT** apply [`supabase/migrations/001_sprint1_schema.sql`](./supabase/migrations/001_sprint1_schema.sql)
from this repo. It is marked superseded and has a runtime guard that will
abort `supabase db push` if anyone tries.

Canonical schema is `cb/supabase/migrations/001..018` and is already deployed
on Supabase project `zdowaetbjtdojgkgoxmn` (eu-west-1).
