import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionLabel } from "@/components/site/Section";
import { GmailAlertMock } from "@/components/site/GmailAlertMock";
import { MacbookFrame } from "@/components/site/MacbookFrame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClawbackVault — See which clients are about to leave" },
      { name: "description", content: "ClawbackVault reads the client threads you nominate, detects exit intent before they act, and hands you a ready-to-send reply. One YES from you. Commission protected." },
      { property: "og:title", content: "ClawbackVault — See which clients are about to leave" },
      { property: "og:description", content: "Detects exit signals in your inbox. Hands you a ready-to-send draft. One reply protects the commission." },
    ],
  }),
  component: Home,
});

function GhostAuditCTA({ variant = "primary" }: { variant?: "primary" | "navy" }) {
  const base =
    "inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-medium shadow-md transition-opacity hover:opacity-90";
  const styles =
    variant === "navy"
      ? "bg-brand-orange text-white shadow-brand-orange/30"
      : "bg-brand-orange text-white shadow-brand-orange/25";
  return (
    <Link to="/contact" className={`${base} ${styles}`}>
      See what's in your inbox — Free Ghost Audit
    </Link>
  );
}

function Home() {
  return (
    <>
      {/* Hero — cinematic matrix */}
      <section className="relative isolate overflow-hidden bg-brand-navy">
        {/* Matrix grid (drifting) */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0 animate-grid-drift opacity-[0.18]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,143,77,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)",
              backgroundSize: "56px 56px, 56px 56px",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 85%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 85%)",
            }}
          />
          {/* Vertical scan beam — orange */}
          <div className="absolute inset-x-0 top-0 h-[28%] animate-scan-beam"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(255,143,77,0.18) 45%, rgba(255,143,77,0.32) 50%, rgba(255,143,77,0.18) 55%, transparent 100%)",
              filter: "blur(2px)",
            }}
          />
          {/* Horizontal scan beam — white */}
          <div className="absolute inset-y-0 left-0 w-[24%] animate-scan-beam-h"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.06) 55%, transparent 100%)",
              filter: "blur(2px)",
            }}
          />
          {/* Central orbit glow */}
          <div className="absolute left-1/2 top-1/2 h-[680px] w-[680px] animate-orbit-glow rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,143,77,0.28) 0%, rgba(255,143,77,0.10) 35%, transparent 70%)",
            }}
          />
          {/* Vignette */}
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(8,14,30,0.85) 100%)" }}
          />
          {/* Pulsing nodes at grid intersections */}
          {[
            { top: "22%", left: "18%", d: "0s" },
            { top: "34%", left: "78%", d: "1.2s" },
            { top: "68%", left: "22%", d: "2.1s" },
            { top: "72%", left: "74%", d: "0.6s" },
            { top: "48%", left: "12%", d: "1.8s" },
            { top: "26%", left: "62%", d: "2.5s" },
          ].map((n, i) => (
            <span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-brand-orange shadow-[0_0_12px_oklch(0.7_0.2_47)]"
              style={{ top: n.top, left: n.left, animation: `node-pulse 3.6s ease-in-out ${n.d} infinite` }}
            />
          ))}
        </div>

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pt-20 pb-24 text-center md:pt-28 md:pb-32">
          {/* Status chip */}
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-medium tracking-[0.18em] uppercase text-white/80 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-orange/70 pulse-dot" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-orange" />
            </span>
            Live · Validated by mortgage pros
          </span>

          {/* Eyebrow — terminal style */}
          <div className="animate-fade-up-delay-1 mt-10 font-mono text-[11px] tracking-[0.3em] uppercase text-brand-orange/90">
            <span className="text-white/40">$</span> clawback_engine --watch
            <span className="ml-1 inline-block h-3 w-[7px] translate-y-[1px] bg-brand-orange animate-caret" />
          </div>

          {/* Master headline */}
          <h1 className="animate-fade-up-delay-2 mt-6 text-balance font-semibold tracking-[-0.045em] text-white text-[3.2rem] leading-[0.95] md:text-[6.25rem] md:leading-[0.9]">
            Stop losing
            <span className="block">
              <span
                className="bg-clip-text text-transparent text-shimmer"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #ff8f4d 0%, #ffd1a8 25%, #ff8f4d 50%, #ffd1a8 75%, #ff8f4d 100%)",
                }}
              >
                earned commission.
              </span>
            </span>
          </h1>

          {/* Single supporting line — sharp, no box */}
          <p className="animate-fade-up-delay-3 mt-8 max-w-2xl text-pretty text-lg text-white/70 md:text-xl">
            ClawbackVault reads the client threads you nominate, catches exit signals before they act, and hands you a ready-to-send reply. <span className="text-white">One tap. Commission saved.</span>
          </p>

          {/* Defensive / Offensive split — minimal pills, not a box */}
          <div className="animate-fade-up-delay-3 mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              <span className="font-semibold text-white">Defensive</span>
              <span className="text-white/55">stop the leak</span>
            </span>
            <span className="hidden h-3 w-px bg-white/15 md:inline-block" />
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              <span className="font-semibold text-white">Offensive</span>
              <span className="text-white/55">recover dormant clients</span>
            </span>
          </div>

          {/* CTAs */}
          <div className="animate-fade-up-delay-4 mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-brand-orange px-7 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(255,143,77,0.7)] transition-transform hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Run my Free Ghost Audit →</span>
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/15 bg-white/5 px-5 text-sm font-medium text-white/90 backdrop-blur transition-colors hover:bg-white/10"
            >
              See how it works
            </Link>
          </div>
          <p className="animate-fade-up-delay-4 mt-5 font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
            Scan free · Results in minutes · No card
          </p>
        </div>

        {/* Bottom hairline transition */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent" />
      </section>

      {/* Gmail mockup */}
      <Section className="bg-background">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <SectionLabel>What you actually receive</SectionLabel>
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-brand-navy md:text-3xl">
            One alert. One draft. One YES.
          </h2>
        </div>
        <div className="relative mx-auto max-w-5xl">
          {/* Premium ambient drop shadow — feels like a real laptop sitting on a surface */}
          <div className="pointer-events-none absolute -inset-x-12 -bottom-10 -z-10 h-40 rounded-[50%] bg-brand-navy/40 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-1/4 -bottom-4 -z-10 h-16 rounded-[50%] bg-black/35 blur-2xl" />
          <MacbookFrame>
            <GmailAlertMock />
          </MacbookFrame>
        </div>
      </Section>

      {/* No behaviour change — navy panel */}
      <Section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">No new tools. No new habits.</div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
            You don't change a thing.
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 md:grid-cols-3">
          <div className="border-b border-white/10 p-7 md:border-b-0 md:border-r">
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">Before</div>
            <h3 className="mt-3 text-lg font-medium text-white">Today</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>You check email when it arrives.</li>
              <li>You respond when you have time.</li>
              <li>You hope you didn't miss anything.</li>
            </ul>
          </div>
          <div className="border-b border-white/10 p-7 md:border-b-0 md:border-r">
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-orange">With ClawbackVault</div>
            <h3 className="mt-3 text-lg font-medium text-white">Tomorrow</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li>You check email when it arrives.</li>
              <li>You respond when you have time.</li>
              <li>You get one alert when something needs you — with the reply already written.</li>
            </ul>
          </div>
          <div className="bg-brand-orange p-7 text-white">
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/85">The difference</div>
            <h3 className="mt-3 text-lg font-medium text-white">One extra tap.</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/95">
              Tap <span className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[11px]">YES</span> on the alert. The draft sends from your inbox. The commission stays yours.
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <GhostAuditCTA variant="navy" />
        </div>
      </Section>

      {/* Trust panels — premium navy rectangles with embossed seals */}
      <Section className="bg-brand-navy text-white relative overflow-hidden">
        {/* ambient glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">
            Built on trust
          </div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Three guarantees, by design.
          </h2>
        </div>

        <div className="relative mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                  <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              ),
              eyebrow: "01 · Scope",
              t: "Client-only scope",
              d: "We watch only the threads on your watchlist. Your bank, your family, your vendors — never touched.",
              metric: "0 emails read outside watchlist",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              ),
              eyebrow: "02 · Security",
              t: "Bank-grade encryption",
              d: "AES-256 at rest. TLS 1.3 in transit. SOC 2-aligned. GDPR compliant from day one.",
              metric: "AES-256 · TLS 1.3 · SOC 2",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
                  <path d="m4 4 16 16"/>
                </svg>
              ),
              eyebrow: "03 · Invisibility",
              t: "Client never knows",
              d: "Replies send from your inbox, in your voice. No third-party branding. No fingerprints. Ever.",
              metric: "Sent from your address",
            },
          ].map((b) => (
            <div
              key={b.t}
              className="group relative overflow-hidden rounded-2xl p-[1px] transition-transform duration-300 hover:-translate-y-1"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 30%, rgba(255,143,77,0.35) 100%)",
              }}
            >
              <div
                className="relative h-full rounded-2xl p-7"
                style={{
                  background:
                    "linear-gradient(160deg, #14213d 0%, #0e1830 55%, #1a2a4f 100%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.4), 0 30px 60px -25px rgba(0,0,0,0.6)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl opacity-60"
                  style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)" }}
                />
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)" }}
                />

                <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "linear-gradient(145deg, #ff8f4d 0%, #f97316 50%, #c2410c 100%)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.35), 0 8px 20px -6px rgba(249,115,22,0.55)",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-70"
                    style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 55%)" }}
                  />
                  <span className="relative text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">{b.icon}</span>
                </div>

                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-orange/90">
                  {b.eyebrow}
                </div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">{b.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{b.d}</p>

                <div className="mt-6 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="font-mono text-[11px] text-white/85">{b.metric}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/50">
          <Link to="/security" className="underline-offset-4 hover:text-white hover:underline">Read the full security model →</Link>
        </div>
      </Section>

      {/* Final Ghost Audit CTA — navy panel */}
      <Section className="border-b-0 bg-brand-navy text-white">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-orange/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-orange">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
            Free Ghost Audit
          </div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
            See what signals are already sitting in your inbox.
          </h2>
          <p className="mt-4 text-lg text-white/70">
            We open the last 90 days of your client threads and show you what you missed —
            with the dollar amount attached. Free. No commitment.
          </p>
          <div className="mt-8 flex justify-center">
            <GhostAuditCTA variant="navy" />
          </div>
        </div>
      </Section>
    </>
  );
}
