import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { PageHero } from "@/components/site/PageHero";
import { PipelineMock } from "@/components/site/PipelineMock";
import { DashboardMock } from "@/components/site/DashboardMock";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works · ClawbackVault" },
      { name: "description", content: "Read-only inbox. Watchlist-only monitoring. Signal model. One alert with a ready-to-send draft. Reply YES." },
      { property: "og:title", content: "How ClawbackVault works" },
      { property: "og:description", content: "From inbox connection to commission saved, the full mechanism in five steps." },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  {
    n: "01",
    t: "Connect your inbox, read-only.",
    d: "Sign in with Google or Microsoft. We request read-only scopes only. No send. No modify. No delete. You can revoke from your provider in one click.",
    chip: "OAuth · read-only scopes",
  },
  {
    n: "02",
    t: "Upload your watchlist.",
    d: "A CSV of clients in their clawback window. Name + email is enough. Add commission and clawback expiry to sharpen the alerts.",
    chip: "CSV · 30 seconds",
  },
  {
    n: "03",
    t: "We watch only those threads.",
    d: "Every 5 minutes, in the background. Newsletters and junk are dropped. Personal data is masked into tokens before any analysis.",
    chip: "5 min · background",
  },
  {
    n: "04",
    t: "The signal model scores intent.",
    d: "Payout questions, rate shopping, sudden silence, forwarded statements. Each thread gets a confidence score and risk band.",
    chip: "Confidence + risk band",
  },
  {
    n: "05",
    t: "One alert. One draft. One YES.",
    d: "You get an email + WhatsApp with the context, the dollar value at risk, and a pre-written reply. Reply YES to send it from your inbox.",
    chip: "Email + WhatsApp",
  },
];

function HowItWorks() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title={
          <>
            A signal layer on top of <span className="text-brand-orange">the inbox you already use.</span>
          </>
        }
        lead="ClawbackVault doesn't replace your tools or change how you work. It listens to a deliberate slice of your email, and tells you when a commission is about to walk."
      >
        <Link to="/contact" className="inline-flex h-12 items-center justify-center rounded-md bg-brand-orange px-6 text-sm font-medium text-white shadow-md shadow-brand-orange/25 hover:opacity-90">
          Free Ghost Audit
        </Link>
        <Link to="/security" className="inline-flex h-12 items-center justify-center rounded-md border border-brand-navy/15 bg-white/70 px-5 text-sm font-medium text-brand-navy backdrop-blur hover:bg-brand-navy/5">
          Security model
        </Link>
      </PageHero>

      {/* The 5 steps */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">The mechanism</div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-brand-navy md:text-4xl">
            Five steps. Ninety seconds to set up.
          </h2>
        </div>
        <div className="mx-auto mt-14 max-w-4xl space-y-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group relative overflow-hidden rounded-2xl p-[1px] transition-transform duration-300 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, rgba(20,33,61,0.12) 0%, rgba(255,143,77,0.4) 100%)" }}
            >
              <div className="relative grid gap-6 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-12 md:p-8">
                <div className="md:col-span-3">
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white font-mono text-sm font-semibold"
                    style={{
                      background: "linear-gradient(145deg, #14213d 0%, #0e1830 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 6px 16px -6px rgba(20,33,61,0.4)",
                    }}
                  >
                    {s.n}
                  </div>
                </div>
                <div className="md:col-span-9">
                  <h3 className="text-lg font-semibold tracking-tight text-brand-navy md:text-xl">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{s.d}</p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-orange/25 bg-brand-orange/5 px-3 py-1 font-mono text-[11px] text-brand-orange">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(249,115,22,0.7)]" />
                    {s.chip}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Two intents, one pipeline */}
      <Section>
        <div
          className="mx-auto max-w-5xl overflow-hidden rounded-2xl p-[1px]"
          style={{ background: "linear-gradient(135deg, rgba(20,33,61,0.18) 0%, rgba(255,143,77,0.5) 100%)" }}
        >
          <div className="grid gap-0 rounded-2xl bg-white md:grid-cols-2">
            <div className="border-b border-brand-navy/10 p-8 md:border-b-0 md:border-r">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-orange">Defensive intent</div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-brand-navy">No commission leaves without a fight.</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The pipeline watches live threads on your watchlist and flags exit signals, payout questions, rate shopping, sudden silence, before the client commits to leaving.
              </p>
            </div>
            <div className="p-8">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-orange">Offensive intent</div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-brand-navy">No dormant client stays hidden.</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The same pipeline replays your historical book to surface old clients whose situation has materially changed, with a one-line reason to reach back out.
              </p>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs uppercase tracking-[0.22em] text-brand-navy/55">
          Two intents · one pipeline · one inbox
        </p>
      </Section>

      {/* Live pipeline */}
      <Section className="bg-brand-navy text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="relative grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">Under the hood</div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Privacy-first by construction, <span className="text-brand-orange">not by promise.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              We scan only the client threads you nominate. Junk is dropped. Personal details are stripped into tokens before any analysis runs.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/65">
              <li>· Newsletters and notifications discarded in &lt;50ms</li>
              <li>· Names, emails, dollar values masked to placeholders</li>
              <li>· Email bodies are processed in memory, never stored</li>
            </ul>
          </div>
          <div className="md:col-span-7">
            <PipelineMock />
          </div>
        </div>
      </Section>

      {/* Dashboard preview */}
      <Section>
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">The dashboard</div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-brand-navy md:text-4xl">
            One screen. You know exactly who to call today.
          </h2>
          <p className="mt-5 text-base text-muted-foreground md:text-lg">
            A red-amber-green heatmap of your watchlist, the dollar value you've already protected, and your 90-day exposure, at a glance.
          </p>
        </div>
        <DashboardMock />
      </Section>

      {/* What it deliberately won't do */}
      <Section className="bg-brand-navy text-white relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">Constraints</div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
            What ClawbackVault deliberately <span className="text-brand-orange">won't do.</span>
          </h2>
        </div>
        <div className="relative mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
          {[
            ["No auto-sending.", "Every outbound message requires your explicit YES on that specific alert."],
            ["No full-inbox monitoring.", "We only process threads with people on your watchlist. Everything else is invisible."],
            ["No CRM behaviour.", "We don't schedule sequences or chase clients. The product has one job."],
            ["No surprise data.", "Signal metadata is retained. Email bodies are not stored, ever."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange/20 text-brand-orange">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="h-3 w-3"><path d="M6 6 18 18M18 6 6 18"/></svg>
                </span>
                <div>
                  <div className="text-base font-semibold text-white">{t}</div>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">{d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="relative mt-12 flex justify-center">
          <Link to="/contact" className="inline-flex h-12 items-center justify-center rounded-md bg-brand-orange px-6 text-sm font-medium text-white shadow-md shadow-brand-orange/30 hover:opacity-90">
            See what's in your inbox, Free Ghost Audit
          </Link>
        </div>
      </Section>
    </>
  );
}
