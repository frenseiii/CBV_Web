import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features · ClawbackVault" },
      { name: "description", content: "Signal detection, retention heatmap, clawback calendar, ready-to-send drafts, exposure forecasting, ghost audit, and team dashboards." },
      { property: "og:title", content: "ClawbackVault features" },
      { property: "og:description", content: "Detection, visibility, action, and forecasting tools brokers actually need." },
    ],
  }),
  component: Features,
});

const groups = [
  {
    label: "Detection",
    title: "Signals, not reminders.",
    items: [
      ["Explicit signals", "Rate questions, “shopping around,” direct mentions of competitors."],
      ["Implicit signals", "Tone shifts, hesitation, clarifying questions about exit terms."],
      ["Behavioural signals", "Forwarded statements, CC'd advisors, off-pattern reply timing."],
      ["Silence signals", "Sudden drop-off in conversations that were previously consistent."],
    ],
  },
  {
    label: "Visibility",
    title: "See the book the way risk actually moves through it.",
    items: [
      ["Retention heatmap", "Clients ranked by current risk, not by date last contacted."],
      ["Clawback calendar", "Month-by-month view of which commissions are most exposed."],
      ["90-day forecast", "Projected exposure based on live signals and clawback windows."],
    ],
  },
  {
    label: "Action",
    title: "From alert to sent reply in one tap.",
    items: [
      ["Ready-to-send drafts", "Each alert ships with a written reply tuned to the signal type."],
      ["Reply YES", "Send the draft from your phone without opening the app."],
      ["In your voice", "Drafts learn your tone over time, so the reply sounds like you, not a tool."],
      ["WhatsApp + email", "Alerts reach you on the channel you actually check first."],
    ],
  },
  {
    label: "Recommissioning",
    title: "No dormant client stays hidden without a chance to return.",
    items: [
      ["The James case", "A broker re-engaged a 4-year-dormant client whose rate had reset, $700,000 of new business from one outbound message."],
      ["Dormant signal scan", "We replay your historical book to surface clients whose situation has materially changed since you last spoke."],
      ["Reason-to-reach-out", "Each surfaced client comes with a one-line, specific reason, not a generic “check in.”"],
      ["Ranked by likelihood", "We rank by the probability they're transactable now, not by who you haven't called in longest."],
    ],
  },
  {
    label: "For firms",
    title: "Same tool, team scale.",
    items: [
      ["Team dashboard", "Aggregate exposure, top risks, and saves across the firm."],
      ["Ghost Audit", "Replay the last 12 months of email to surface signals you missed before."],
    ],
  },
];

function Features() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title={
          <>
            Small on purpose. <span className="text-brand-orange">Every part exists to keep one commission.</span>
          </>
        }
        lead="No CRM bloat. No automation theatre. Four capabilities, detection, visibility, action, firm scale, each tied directly to revenue retained."
      >
        <Link to="/contact" className="inline-flex h-12 items-center justify-center rounded-md bg-brand-orange px-6 text-sm font-medium text-white shadow-md shadow-brand-orange/25 hover:opacity-90">
          Free Ghost Audit
        </Link>
        <Link to="/how-it-works" className="inline-flex h-12 items-center justify-center rounded-md border border-brand-navy/15 bg-white/70 px-5 text-sm font-medium text-brand-navy backdrop-blur hover:bg-brand-navy/5">
          See how it works
        </Link>
      </PageHero>

      {groups.map((g, gi) => {
        const isNavy = gi % 2 === 1;
        return (
          <Section
            key={g.label}
            className={isNavy ? "bg-brand-navy text-white relative overflow-hidden" : ""}
          >
            {isNavy && (
              <div className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-brand-orange/10 blur-3xl" />
            )}
            <div className="relative mx-auto max-w-3xl text-center">
              <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">
                {String(gi + 1).padStart(2, "0")} · {g.label}
              </div>
              <h2 className={`text-balance text-3xl font-semibold tracking-tight md:text-4xl ${isNavy ? "text-white" : "text-brand-navy"}`}>
                {g.title}
              </h2>
            </div>
            <div className="relative mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
              {g.items.map(([t, d]) => (
                <div
                  key={t}
                  className={`group relative overflow-hidden rounded-2xl p-[1px] transition-transform duration-300 hover:-translate-y-0.5`}
                  style={{
                    background: isNavy
                      ? "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,143,77,0.35) 100%)"
                      : "linear-gradient(135deg, rgba(20,33,61,0.12) 0%, rgba(255,143,77,0.4) 100%)",
                  }}
                >
                  <div
                    className={`relative h-full rounded-2xl p-6 ${isNavy ? "" : "bg-white shadow-sm"}`}
                    style={
                      isNavy
                        ? {
                            background: "linear-gradient(160deg, #14213d 0%, #0e1830 60%, #1a2a4f 100%)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                          }
                        : undefined
                    }
                  >
                    <h3 className={`text-lg font-semibold tracking-tight ${isNavy ? "text-white" : "text-brand-navy"}`}>{t}</h3>
                    <p className={`mt-2 text-sm leading-relaxed ${isNavy ? "text-white/70" : "text-muted-foreground"}`}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        );
      })}

      <Section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Ready to see it on your own book?
          </h2>
          <p className="mt-4 text-base text-white/70 md:text-lg">
            Free Ghost Audit, we replay your last 90 days of client threads and show you what you missed, with the dollar amount attached.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/contact" className="inline-flex h-12 items-center justify-center rounded-md bg-brand-orange px-6 text-sm font-medium text-white shadow-md shadow-brand-orange/30 hover:opacity-90">
              Free Ghost Audit
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
