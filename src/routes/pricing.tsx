import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing · ClawbackVault" },
      { name: "description", content: "Compare Defensive, Offensive, and Firm tiers. €99/month early access. €20 fully refundable deposit." },
      { property: "og:title", content: "ClawbackVault pricing" },
      { property: "og:description", content: "Pick the job: stop the leak, reopen the book, or wrap the whole firm." },
    ],
  }),
  component: PricingPage,
});

const SAVE_AMOUNT = 7000;
const PRICE = 99;
const MONTHS_COVERED = Math.round(SAVE_AMOUNT / PRICE);

function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Pick the job. <span className="text-brand-orange">Or do both.</span>
          </>
        }
        lead={`Defensive keeps the commissions you've already earned. Offensive adds the dormant-client engine. Firm wraps your whole team. One save covers ~${MONTHS_COVERED} months of any tier.`}
      >
        <Link to="/contact" className="inline-flex h-12 items-center justify-center rounded-md bg-brand-orange px-6 text-sm font-medium text-white shadow-md shadow-brand-orange/25 hover:opacity-90">
          Reserve a slot, €20 deposit
        </Link>
        <Link to="/" hash="calculator" className="inline-flex h-12 items-center justify-center rounded-md border border-brand-navy/15 bg-white/70 px-5 text-sm font-medium text-brand-navy backdrop-blur hover:bg-brand-navy/5">
          Run your numbers
        </Link>
      </PageHero>

      {/* Tier comparison */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">Compare tiers</div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-brand-navy md:text-4xl">
            Three tiers. <span className="text-brand-orange">One outcome.</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Same product, scaled to the job you need it to do.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
          {[
            {
              tag: "Defensive",
              price: "€99",
              tagline: "Stop the leak.",
              features: [
                "Watchlist monitoring",
                "Exit-intent signals",
                "Ready-to-send drafts",
                "Reply YES from your phone",
              ],
            },
            {
              tag: "Defensive + Offensive",
              price: "€179",
              tagline: "Stop the leak. Reopen the book.",
              featured: true,
              features: [
                "Everything in Defensive",
                "Recommissioning engine",
                "Dormant-client signal scan",
                "Reason-to-reach-out drafts",
              ],
            },
            {
              tag: "Firm",
              price: "€299",
              tagline: "Per broker. Team-wide visibility.",
              features: [
                "Everything in Defensive + Offensive",
                "Team dashboard",
                "4-hour escalation",
                "SSO + audit logs",
              ],
            },
          ].map((tier) => (
            <div
              key={tier.tag}
              className="group relative overflow-hidden rounded-2xl p-[1px] transition-transform duration-300 hover:-translate-y-1"
              style={{
                background: tier.featured
                  ? "linear-gradient(135deg, rgba(255,143,77,0.7) 0%, rgba(255,255,255,0.2) 50%, rgba(255,143,77,0.6) 100%)"
                  : "linear-gradient(135deg, rgba(20,33,61,0.15) 0%, rgba(255,143,77,0.35) 100%)",
              }}
            >
              <div
                className={`relative flex h-full flex-col rounded-2xl p-7 ${tier.featured ? "text-white" : "bg-white"}`}
                style={
                  tier.featured
                    ? {
                        background: "linear-gradient(160deg, #14213d 0%, #0e1830 60%, #1a2a4f 100%)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 30px 60px -25px rgba(0,0,0,0.6)",
                      }
                    : undefined
                }
              >
                {tier.featured && (
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl opacity-50" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)" }} />
                )}
                <div className="relative">
                  <div className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${tier.featured ? "text-brand-orange" : "text-muted-foreground"}`}>
                    {tier.tag}
                  </div>
                  <div className="mt-5 flex items-baseline gap-2">
                    <div className={`text-4xl font-semibold tracking-tight ${tier.featured ? "text-white" : "text-brand-navy"}`}>{tier.price}</div>
                    <div className={`text-xs ${tier.featured ? "text-white/55" : "text-muted-foreground"}`}>/ broker / month</div>
                  </div>
                  <p className={`mt-2 text-sm ${tier.featured ? "text-white/75" : "text-muted-foreground"}`}>{tier.tagline}</p>
                  <ul className={`mt-6 space-y-2.5 text-sm ${tier.featured ? "text-white/85" : "text-brand-navy/80"}`}>
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className={`mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${tier.featured ? "bg-brand-orange/20 text-brand-orange" : "bg-brand-orange-soft/60 text-brand-orange"}`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5"><path d="m5 12 5 5L20 7"/></svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs uppercase tracking-[0.22em] text-brand-navy/55">
          One save covers ~{MONTHS_COVERED} months of any tier.
        </p>
      </Section>

      {/* Firm plan */}
      <Section>
        <div
          className="mx-auto max-w-5xl overflow-hidden rounded-2xl p-[1px]"
          style={{ background: "linear-gradient(135deg, rgba(20,33,61,0.2) 0%, rgba(255,143,77,0.5) 100%)" }}
        >
          <div className="grid gap-0 rounded-2xl bg-white md:grid-cols-12">
            <div
              className="relative overflow-hidden p-8 text-white md:col-span-5"
              style={{ background: "linear-gradient(160deg, #14213d 0%, #0e1830 60%, #1a2a4f 100%)" }}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-50" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)" }} />
              <div className="relative">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-orange">Firm plan</div>
                <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  When a broker loses a clawback, <span className="text-brand-orange">you lose it too.</span>
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-white/70">
                  Override commission disappears with theirs. The firm plan adds team-wide visibility and 4-hour escalation.
                </p>
              </div>
            </div>
            <div className="p-8 md:col-span-7">
              <ul className="space-y-3 text-sm text-brand-navy/80">
                {[
                  ["Team dashboard", "Aggregate exposure, top risks, and saves across every broker, one screen."],
                  ["4-hour escalation", "If a broker ignores a critical alert, it routes to you automatically."],
                  ["Ghost Audit", "12-month replay across the firm to surface what was missed before."],
                  ["SSO + audit logs", "SAML SSO, role-based access, and exportable audit trails."],
                ].map(([t, d]) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="m5 12 5 5L20 7"/></svg>
                    </span>
                    <span>
                      <span className="font-semibold text-brand-navy">{t}.</span>{" "}
                      <span className="text-muted-foreground">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-7 inline-flex h-11 items-center justify-center rounded-md bg-brand-navy px-5 text-sm font-medium text-white hover:opacity-90"
              >
                Talk to us about a firm plan →
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
