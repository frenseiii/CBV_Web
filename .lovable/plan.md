## ClawbackVault — Marketing Site Plan

A multi-route TanStack Start marketing site for a B2B SaaS that detects early exit signals in broker email to prevent commission clawbacks. Design-agnostic but calm, precise, professional — closer to a product interface than a typical startup landing page.

### Route structure

```
src/routes/
  __root.tsx           shared shell (header + footer, nav, meta defaults)
  index.tsx            home / narrative spine (sections 1–10 of journey)
  how-it-works.tsx     deep dive on the 3-step mechanism
  features.tsx         full feature set (signal detection, heatmap, calendar, drafts, forecast, ghost audit, recommissioning, team)
  security.tsx         trust + architecture details
  pricing.tsx          plans, deposit, ROI calculator
  contact.tsx          early-access request form
```

Each route gets unique `head()` metadata (title, description, og:title, og:description). Shared header links between them; home page tells the full story end-to-end and CTAs deep-link into the dedicated pages for users who want detail.

### Home page section flow (matches the 10-step journey)

1. **Hero** — One-line positioning ("Detect client exits 3 weeks before they happen"), subline naming brokers + clawbacks, primary CTA (Request access) + secondary (See how it works). No stock illustrations.
2. **Stat strip** — The 5 key data points as visual anchors (92%, $10K+, $29K, 2×, ~3 weeks) with one-line context each.
3. **Problem** — Why upfront commissions get clawed back, what brokers experience (income loss, no visibility, no warning).
4. **Scale** — Reinforce numbers; show a simple visualization of clawback rate doubling (6% → 12%).
5. **Core insight** — The 3-week signal window. Single focused screen, one idea.
6. **Mechanism** — 3 steps: Connect inbox (read-only) → Upload watchlist → Receive alert + draft. Emphasize zero workflow change.
7. **Differentiation** — Side-by-side contrast: calendar-based follow-ups vs intent-based detection. Explicitly: not a CRM, not a reminder tool.
8. **Feature preview** — 3–4 highest-signal features with a link to `/features` for the full set. Avoid feature wall.
9. **Security** — Calm factual block: read-only, watchlist-only, no body storage, metadata only, AES-256, user-controlled actions. Link to `/security`.
10. **Pricing summary** — €99 early access / €199 standard / €20 refundable deposit + ROI line ("One prevented clawback ≈ $4,900 — pays for itself after the first save"). Link to `/pricing`.
11. **Final CTA** — Single focused action: request early access.

### Subpage content

- **/how-it-works** — Expanded 3-step mechanism with constraints (no auto-send, no full inbox scan, watchlist-only), example alert + "Reply YES" flow, FAQ.
- **/features** — Grouped sections: Detection (signal types), Visibility (heatmap, calendar, forecast), Action (drafts, recommissioning), Team. Introduced after mechanism is understood.
- **/security** — Architecture diagram (text/ASCII or simple SVG), data handling table, permissions scope list, compliance posture.
- **/pricing** — Two plan cards (Early Access / Standard), deposit explanation, simple ROI calculator (clients on watchlist × avg commission × clawback rate).
- **/contact** — Early-access form (name, firm, broker type, inbox provider, watchlist size). Frontend-only for now; submission posts to a placeholder server function that logs and returns success.

### Design system

- Tokens defined in `src/styles.css` using `oklch` (no hard-coded colors in components).
- Restrained palette: neutral background, single accent for CTAs and risk highlights, semantic colors for risk levels (low/medium/high) used in heatmap/forecast visuals.
- Typography hierarchy via size + weight + spacing, not boxes. Generous whitespace.
- Components built on existing shadcn/ui primitives (button, card, badge, separator, table, accordion for FAQ, form for contact).
- One section = one idea. No dense grids of cards. Stats use large numbers + thin labels.

### Technical notes

- Pure frontend; no Lovable Cloud needed for v1 (contact form can stub or be wired later).
- Each route file defines `head()` with route-specific SEO meta.
- Shared `Header` and `Footer` components in `src/components/site/`.
- Reusable presentation pieces: `StatBlock`, `SectionHeading`, `StepCard`, `ContrastTable`, `RoiCalculator`, `PricingCard`, `SecurityItem`.
- Single H1 per page, semantic HTML (`<section>`, `<header>`, `<main>`, `<footer>`), alt text on any imagery, responsive viewport already in root.

### Out of scope for this build

- Real inbox OAuth, real backend, real payments.
- Auth, dashboards, app-side UI (this is the marketing site only).
- Animations beyond subtle transitions.

After your approval I'll implement the routes, shared components, and design tokens in one pass.
