import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security · ClawbackVault" },
      { name: "description", content: "Read-only inbox access, watchlist-only processing, AES-256 encryption, SOC 2-aligned, GDPR compliant. We do less than we could, on purpose." },
      { property: "og:title", content: "Security at ClawbackVault" },
      { property: "og:description", content: "Minimum permissions. Narrowest scope. Bank-grade encryption. Your YES required, every time." },
    ],
  }),
  component: SecurityPage,
});

const seals = [
  {
    eyebrow: "01 · Scope",
    t: "Client-only scope",
    d: "We watch only the threads on your watchlist. Your bank, your family, your vendors, never touched.",
    metric: "0 emails read outside watchlist",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
  {
    eyebrow: "02 · Security",
    t: "Bank-grade encryption",
    d: "AES-256 at rest. TLS 1.3 in transit. SOC 2-aligned controls. GDPR compliant from day one.",
    metric: "AES-256 · TLS 1.3 · SOC 2",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    eyebrow: "03 · Invisibility",
    t: "Client never knows",
    d: "Replies send from your inbox, in your voice. No third-party branding. No fingerprints. Ever.",
    metric: "Sent from your address",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
        <path d="m4 4 16 16"/>
      </svg>
    ),
  },
  {
    eyebrow: "04 · Portability",
    t: "Your data leaves with you",
    d: "Cancel any time. We send you a 12-month report of every signal we caught and every commission we protected, yours to keep.",
    metric: "Full export · 12-mo report",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
        <path d="M12 3v12"/>
        <path d="m7 10 5 5 5-5"/>
        <path d="M5 21h14"/>
      </svg>
    ),
  },
];

const accessRows: Array<[string, string, "yes" | "no" | "limited"]> = [
  ["Read email metadata", "Watchlist threads only", "limited"],
  ["Read email content", "In memory · never persisted", "limited"],
  ["Send email", "Never autonomously", "no"],
  ["Modify or delete email", "Never", "no"],
  ["Access non-watchlist threads", "Blocked at first filter", "no"],
  ["Trigger actions without your input", "Never", "no"],
  ["Revoke access at any time", "One click in your provider", "yes"],
];

const faqs = [
  {
    q: "What happens if I remove a client from the watchlist?",
    a: "They become invisible to the system immediately. Existing signal metadata is purged within 24 hours.",
  },
  {
    q: "Where is data stored?",
    a: "EU data residency by default (Frankfurt). Optional US region for North American firms.",
  },
  {
    q: "Do you train AI models on my data?",
    a: "No. Your inbox content is never used to train shared or external models, full stop.",
  },
  {
    q: "What's your incident response window?",
    a: "Confirmed incidents are disclosed to affected customers within 24 hours, with a full root-cause report within 7 days.",
  },
];

function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Security"
        title={
          <span className="block space-y-2 md:space-y-3">
            <span className="block text-5xl font-semibold tracking-[-0.03em] text-brand-navy md:text-7xl md:leading-[0.95]">
              Minimum data.
            </span>
            <span className="block text-5xl font-semibold tracking-[-0.03em] text-brand-navy md:text-7xl md:leading-[0.95]">
              Narrowest permissions.
            </span>
            <span className="block pt-2 text-3xl font-light italic tracking-[-0.01em] text-brand-orange md:pt-4 md:text-5xl">
              By design.
            </span>
          </span>
        }
      />

      {/* Three trust seals */}
      <Section className="bg-brand-navy text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">Built on trust</div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Four guarantees, by design.
          </h2>
        </div>

        <div className="relative mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {seals.map((b) => (
            <div
              key={b.t}
              className="group relative overflow-hidden rounded-2xl p-[1px] transition-transform duration-300 hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 30%, rgba(255,143,77,0.35) 100%)" }}
            >
              <div
                className="relative h-full rounded-2xl p-7"
                style={{
                  background: "linear-gradient(160deg, #14213d 0%, #0e1830 55%, #1a2a4f 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.4), 0 30px 60px -25px rgba(0,0,0,0.6)",
                }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl opacity-60" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)" }} />
                <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center">
                  <div className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(145deg, #ff8f4d 0%, #f97316 50%, #c2410c 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.35), 0 8px 20px -6px rgba(249,115,22,0.55)" }} />
                  <span className="relative text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">{b.icon}</span>
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-orange/90">{b.eyebrow}</div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">{b.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{b.d}</p>
                <div className="mt-6 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="font-mono text-[11px] text-white/85">{b.metric}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Access matrix */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">Access model</div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-brand-navy md:text-4xl">
            The least-privilege table.
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Exactly what we can and cannot do, written in your provider's permission terms, not ours.
          </p>
        </div>
        <div
          className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl p-[1px]"
          style={{ background: "linear-gradient(135deg, rgba(20,33,61,0.15) 0%, rgba(255,143,77,0.4) 100%)" }}
        >
          <div className="overflow-hidden rounded-2xl bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-navy text-white">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-tight">Capability</th>
                  <th className="px-6 py-4 font-semibold tracking-tight">ClawbackVault</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy/10">
                {accessRows.map(([k, v, kind]) => (
                  <tr key={k} className="hover:bg-brand-orange-soft/15">
                    <td className="px-6 py-4 font-medium text-brand-navy">{k}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                          kind === "yes"
                            ? "bg-emerald-50 text-emerald-700"
                            : kind === "no"
                            ? "bg-red-50 text-red-700"
                            : "bg-brand-orange-soft/50 text-brand-orange"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${kind === "yes" ? "bg-emerald-500" : kind === "no" ? "bg-red-500" : "bg-brand-orange"}`} />
                        {v}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Data lifecycle */}
      <Section className="bg-brand-navy text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">Data lifecycle</div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Process the signal. <span className="text-brand-orange">Drop the message.</span>
          </h2>
        </div>
        <div className="relative mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {[
            ["In memory", "Email bodies are read into volatile memory, scored, and discarded within seconds. They never hit disk."],
            ["At rest", "Only signal metadata, sender, timestamp, signal type, risk band, is stored. AES-256 encrypted."],
            ["In transit", "TLS 1.3 on every connection between your inbox provider, our service, and your devices."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <div className="text-base font-semibold text-white">{t}</div>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">Frequently asked</div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-brand-navy md:text-4xl">
            The detail brokers actually ask about.
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
          {faqs.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
            >
              <h3 className="text-base font-semibold tracking-tight text-brand-navy">{f.q}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link to="/contact" className="inline-flex h-12 items-center justify-center rounded-md bg-brand-orange px-6 text-sm font-medium text-white shadow-md shadow-brand-orange/25 hover:opacity-90">
            Talk to us about your firm's requirements
          </Link>
        </div>
      </Section>
    </>
  );
}
