import { useEffect, useRef, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { GmailAlertMock } from "@/components/site/GmailAlertMock";
import { MacbookFrame } from "@/components/site/MacbookFrame";
import { EarlyAccessModal } from "@/components/site/EarlyAccessModal";
import { Reveal } from "@/components/site/Reveal";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClawbackVault, See which clients are about to leave" },
      {
        name: "description",
        content:
          "ClawbackVault reads the client threads you nominate, detects exit intent before they act, and hands you a ready-to-send reply. One YES from you. Commission protected.",
      },
      { property: "og:title", content: "ClawbackVault, See which clients are about to leave" },
      {
        property: "og:description",
        content:
          "Detects exit signals in your inbox. Hands you a ready-to-send draft. One reply protects the commission.",
      },
    ],
  }),
  component: Home,
});

function GhostAuditCTA({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-12 items-center justify-center rounded-md bg-brand-orange px-6 text-sm font-medium text-white shadow-md shadow-brand-orange/30 transition-opacity hover:opacity-90"
    >
      See who's about to refinance →
    </button>
  );
}

function OrangeExpandSection({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const triggerLine = Math.min(window.innerHeight * 0.38, 320);

      if (rect.top <= triggerLine) {
        setShown(true);
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-white">
      {/* White stage placeholder, visible until the orange wipes over */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-6 md:pt-8"
        style={{
          opacity: shown ? 0 : 1,
          transition: "opacity 320ms ease-out",
        }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-brand-navy/50">
            How it works
          </div>
          <div className="text-xl font-semibold tracking-tight text-brand-navy/80 md:text-2xl">
            Keep scrolling
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="mt-3 h-6 w-6 animate-bounce text-brand-orange"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Orange overlay, slides up over the white stage (GPU-accelerated transform) */}
      <div
        className="relative bg-brand-orange text-white will-change-transform"
        style={{
          transform: shown ? "translate3d(0,0,0)" : "translate3d(0,100%,0)",
          transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-14 md:pt-12 md:pb-20">{children}</div>
      </div>
    </section>
  );
}

// Live data ticker entries, feels like a Bloomberg rail
const TICKER = [
  { tag: "SYD · 09:42", txt: "Refinance enquiry detected · M.K", lvl: "high" },
  { tag: "MEL · 09:41", txt: "Rate-quote thread opened · S.L", lvl: "med" },
  { tag: "BNE · 09:39", txt: "Dormant 14mo · re-engage opportunity", lvl: "opp" },
  { tag: "PER · 09:37", txt: "Discharge form requested · A.T", lvl: "high" },
  { tag: "ADL · 09:35", txt: "Broker compare email · J.R", lvl: "med" },
  { tag: "AKL · 09:32", txt: "Settlement anniversary · D.P", lvl: "opp" },
  { tag: "DUB · 09:30", txt: "Cashback enquiry · L.O", lvl: "med" },
  { tag: "LON · 09:28", txt: "Product switch query · N.B", lvl: "high" },
];

const SAVE_AMOUNT = 7000;
const PRICE = 99;
const MONTHS_COVERED = Math.round(SAVE_AMOUNT / PRICE);

function Field({ label, value, min, max, step, onChange, unit }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; unit: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-semibold text-brand-navy">{label}</label>
        <div className="font-mono text-sm font-semibold text-brand-orange">
          {unit === "$" && unit}{value.toLocaleString()}{unit !== "$" && unit}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-brand-orange"
      />
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{unit === "$" ? `$${min.toLocaleString()}` : `${min}${unit}`}</span>
        <span>{unit === "$" ? `$${max.toLocaleString()}` : `${max}${unit}`}</span>
      </div>
    </div>
  );
}

function Home() {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState(40);
  const [commission, setCommission] = useState(SAVE_AMOUNT);
  const [rate, setRate] = useState(12);

  const expectedLoss = Math.round(clients * (rate / 100) * commission);
  const annualCost = PRICE * 12;
  const netHalfSaved = Math.max(0, Math.round(expectedLoss / 2 - annualCost));

  return (
    <>
      <EarlyAccessModal open={open} onOpenChange={setOpen} />

      {/* ===================== HERO, clean, premium ===================== */}
      <section className="relative isolate overflow-hidden bg-white">
        {/* Hero content */}
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pt-16 pb-10 text-center md:pt-24 md:pb-14">
          <h1 className="animate-fade-up-delay-2 text-balance font-semibold tracking-[-0.045em] text-brand-navy text-[3.2rem] leading-[0.95] md:text-[6.25rem] md:leading-[0.9]">
            Stop losing
            <span className="block">
              <span
                className="bg-clip-text text-transparent text-shimmer"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #E89220 0%, #f7c073 25%, #E89220 50%, #f7c073 75%, #E89220 100%)",
                }}
              >
                earned commission.
              </span>
            </span>
          </h1>

          {/* Subhead, premium, restrained */}
          <div className="animate-fade-up-delay-3 mt-10 max-w-2xl">
            <p className="text-pretty text-base leading-[1.55] text-brand-navy/60 md:text-lg">
              ClawbackVault is the world's most advanced AI built specifically for mortgage & insurance brokers.
            </p>
            <p className="mt-6 text-balance text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-brand-navy md:text-[1.875rem]">
              Prevents clawbacks. Revives lost deals.
            </p>
            <p className="mt-3 text-base text-brand-navy/55 md:text-lg">
              So brokers can focus on{" "}
              <span className="font-semibold text-brand-orange">growing new business.</span>
            </p>
          </div>

          {/* CTAs */}
          <div className="animate-fade-up-delay-4 mt-12 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="inline-flex h-12 items-center justify-center rounded-full border border-brand-orange/30 bg-white px-7 text-base font-semibold text-brand-orange shadow-sm transition-colors hover:bg-brand-orange/5"
            >
              See who's about to refinance →
            </button>
            <Link
              to="/how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-full px-5 text-base font-medium text-brand-orange transition-colors hover:text-brand-orange/80"
            >
              Learn more →
            </Link>
          </div>
        </div>

      </section>

      {/* Gmail mockup, white space first, then orange expands over it */}
      <OrangeExpandSection>
        <Reveal>
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-white/85">
              What you actually receive
            </div>
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-white md:text-3xl">
              One alert. One draft. One YES.
            </h2>
          </div>
        </Reveal>
        <Reveal variant="card" delay={120}>
          <div className="relative mx-auto max-w-5xl">
            {/* Premium ambient drop shadow, feels like a real laptop sitting on a surface */}
            <div className="pointer-events-none absolute -inset-x-12 -bottom-10 -z-10 h-40 rounded-[50%] bg-brand-navy/40 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-1/4 -bottom-4 -z-10 h-16 rounded-[50%] bg-black/35 blur-2xl" />
            <MacbookFrame>
              <GmailAlertMock />
            </MacbookFrame>
          </div>
        </Reveal>
      </OrangeExpandSection>

      {/* No behaviour change, curtain-rise navy panel */}
      <Reveal variant="curtain" curtainClassName="bg-background">
        <Section className="bg-brand-navy text-white">
          <Reveal delay={120}>
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">
                No new tools. No new habits.
              </div>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
                You don't change a thing.
              </h2>
            </div>
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-5xl gap-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 md:grid-cols-3">
            <Reveal delay={220}>
              <div className="border-b border-white/10 p-7 md:border-b-0 md:border-r h-full">
                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">
                  Before
                </div>
                <h3 className="mt-3 text-lg font-medium text-white">Today</h3>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  <li>You check email when it arrives.</li>
                  <li>You respond when you have time.</li>
                  <li>You hope you didn't miss anything.</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={340}>
              <div className="border-b border-white/10 p-7 md:border-b-0 md:border-r h-full">
                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-orange">
                  With ClawbackVault
                </div>
                <h3 className="mt-3 text-lg font-medium text-white">Tomorrow</h3>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  <li>You check email when it arrives.</li>
                  <li>You respond when you have time.</li>
                  <li>
                    You get one alert when something needs you, with the reply already written.
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={460}>
              <div className="bg-brand-orange p-7 text-white h-full">
                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/85">
                  The difference
                </div>
                <h3 className="mt-3 text-lg font-medium text-white">One extra tap.</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/95">
                  Tap{" "}
                  <span className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[11px]">
                    YES
                  </span>{" "}
                  on the alert. The draft sends from your inbox. The commission stays yours.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={580}>
            <div className="mt-12 flex justify-center">
              <GhostAuditCTA onClick={() => setOpen(true)} />
            </div>
          </Reveal>
        </Section>
      </Reveal>

      {/* Guarantees, white header-style surface with premium centered badges */}
      <Reveal variant="curtain" curtainClassName="bg-brand-navy">
        <Section className="relative overflow-hidden bg-white text-brand-navy">
          <div
            className="pointer-events-none absolute inset-0 -z-10 animate-hue-breathe"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #ffffff 0%, #f6f9ff 34%, #eef3fb 58%, #fff7ed 82%, #ffffff 100%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.10]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(20,33,61,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,33,61,0.55) 1px, transparent 1px)",
              backgroundSize: "44px 44px, 44px 44px",
              maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 35%, transparent 90%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 70% at 50% 45%, black 35%, transparent 90%)",
            }}
          />
          <div
            className="pointer-events-none absolute left-[8%] top-[12%] -z-10 h-[260px] w-[260px] rounded-full blur-3xl opacity-45 animate-aurora-a"
            style={{
              background:
                "radial-gradient(circle, rgba(232,146,32,0.48) 0%, rgba(232,146,32,0) 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute right-[6%] bottom-[8%] -z-10 h-[320px] w-[320px] rounded-full blur-3xl opacity-35 animate-aurora-b"
            style={{
              background:
                "radial-gradient(circle, rgba(20,33,61,0.18) 0%, rgba(20,33,61,0) 70%)",
            }}
          />

          <Reveal>
            <div className="relative mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-navy/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange shadow-sm backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange shadow-[0_0_10px_rgba(232,146,32,0.85)]" />
                Guarantees
              </div>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-brand-navy md:text-4xl">
                Safe enough for finance. Simple enough to trust.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-brand-navy/65">
                Invisible to clients. Inevitable to you.
              </p>
            </div>
          </Reveal>

          <div className="relative mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
            {[
              {
                k: "01",
                badge: "Watchlist",
                title: "Only chosen threads.",
                benefit: "No inbox roaming.",
                tech: "Scoped read access",
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12">
                    <path d="M24 6 10 11v11c0 9 5.9 16.4 14 20 8.1-3.6 14-11 14-20V11L24 6Z" fill="currentColor" opacity="0.12" />
                    <path d="M24 6 10 11v11c0 9 5.9 16.4 14 20 8.1-3.6 14-11 14-20V11L24 6Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
                    <path d="M18 24h12M24 18v12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                k: "02",
                badge: "Encrypted",
                title: "Locked end to end.",
                benefit: "Bank-grade protection.",
                tech: "AES-256 · TLS 1.3",
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12">
                    <rect x="10" y="21" width="28" height="19" rx="5" fill="currentColor" opacity="0.12" />
                    <rect x="10" y="21" width="28" height="19" rx="5" stroke="currentColor" strokeWidth="2.2" />
                    <path d="M16 21v-5a8 8 0 0 1 16 0v5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M24 29v5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    <circle cx="24" cy="28" r="2" fill="currentColor" />
                  </svg>
                ),
              },
              {
                k: "03",
                badge: "Invisible",
                title: "Still sounds like you.",
                benefit: "No client confusion.",
                tech: "Native send · no signature",
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12">
                    <path d="M7 24s6-11 17-11 17 11 17 11-6 11-17 11S7 24 7 24Z" fill="currentColor" opacity="0.12" />
                    <path d="M7 24s6-11 17-11 17 11 17 11-6 11-17 11S7 24 7 24Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
                    <path d="M11 10 37 38" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                ),
              },
            ].map((item, idx) => (
              <Reveal key={item.title} variant="card" delay={idx * 120}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-brand-navy/10 bg-white/82 p-6 text-center shadow-[0_24px_70px_-45px_rgba(20,33,61,0.7)] backdrop-blur transition-transform duration-300 hover:-translate-y-1">
                  <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/70 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-0 transition-all duration-1000 ease-out group-hover:translate-x-full group-hover:opacity-100" />

                  <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-brand-orange/12 blur-2xl transition-opacity duration-300 group-hover:opacity-90" />
                    <div
                      className="absolute inset-0 rounded-full p-[1px]"
                      style={{
                        background:
                          "conic-gradient(from 160deg, rgba(20,33,61,0.12), rgba(232,146,32,0.9), rgba(255,255,255,0.65), rgba(20,33,61,0.18))",
                      }}
                    />
                    <div className="absolute inset-[1px] rounded-full bg-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.9),inset_0_-14px_25px_rgba(20,33,61,0.08),0_22px_40px_-24px_rgba(20,33,61,0.9)]" />
                    <div className="absolute inset-3 rounded-full bg-gradient-to-br from-brand-navy to-brand-navy-soft text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_14px_25px_-16px_rgba(20,33,61,0.9)]" />
                    <div className="absolute inset-3 overflow-hidden rounded-full">
                      <span className="absolute left-[-70%] top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/45 to-transparent transition-all duration-1000 group-hover:left-[120%]" />
                    </div>
                    <div className="relative text-brand-orange drop-shadow-[0_0_14px_rgba(232,146,32,0.5)]">
                      {item.icon}
                    </div>
                    <div className="absolute -right-1 top-3 rounded-full border border-brand-orange/30 bg-brand-orange px-2 py-1 text-[10px] font-semibold text-white shadow-[0_8px_18px_-10px_rgba(232,146,32,0.9)]">
                      {item.k}
                    </div>
                  </div>

                  <div className="relative inline-flex rounded-full border border-brand-navy/10 bg-brand-navy/[0.04] px-3 py-1 font-mono text-[11px] text-brand-navy/70">
                    {item.tech}
                  </div>
                  <h3 className="relative mt-4 text-xl font-semibold tracking-tight text-brand-navy">
                    {item.title}
                  </h3>
                  <p className="relative mt-2 text-base font-medium text-brand-orange">{item.benefit}</p>
                  <div className="relative mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-brand-orange/25 bg-brand-orange/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-navy">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                    {item.badge}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={420}>
            <div className="relative mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3 rounded-full border border-brand-navy/10 bg-white/75 px-5 py-3 text-center text-xs text-brand-navy/65 shadow-sm backdrop-blur">
              <span className="font-medium text-brand-navy">Plain English:</span>
              <span>we watch less, protect more, and your client only sees you.</span>
              <Link to="/security" className="font-semibold text-brand-orange underline-offset-4 hover:underline">
                Security model →
              </Link>
            </div>
          </Reveal>
        </Section>
      </Reveal>

      {/* ===================== PRICING — moved from /pricing ===================== */}
      <Reveal variant="curtain" curtainClassName="bg-white">
        <Section className="bg-background">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">Pricing</div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-brand-navy md:text-4xl">
              One save covers <span className="text-brand-orange">~{MONTHS_COVERED} months</span> of subscription.
            </h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Average commission preserved per save: $7,000. The product pays for itself the first time it works.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
            <div
              className="group relative overflow-hidden rounded-2xl p-[1px] transition-transform duration-300 hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg, rgba(255,143,77,0.6) 0%, rgba(255,255,255,0.2) 50%, rgba(255,143,77,0.5) 100%)" }}
            >
              <div
                className="relative h-full rounded-2xl p-8 text-white"
                style={{
                  background: "linear-gradient(160deg, #14213d 0%, #0e1830 60%, #1a2a4f 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 30px 60px -25px rgba(0,0,0,0.6)",
                }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl opacity-50" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)" }} />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-orange">Early access</div>
                    <div className="rounded-full border border-brand-orange/40 bg-brand-orange/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                      Limited slots
                    </div>
                  </div>
                  <div className="mt-6 flex items-baseline gap-2">
                    <div className="text-5xl font-semibold tracking-tight text-white">€{PRICE}</div>
                    <div className="text-sm text-white/60">/ broker / month</div>
                  </div>
                  <p className="mt-3 text-sm text-white/70">Locked-in pricing for the lifetime of your subscription. €20 fully refundable deposit reserves your slot.</p>
                  <ul className="mt-6 space-y-2.5 text-sm text-white/80">
                    {[
                      "Full product access",
                      "Direct line to the founders",
                      "Locked rate for as long as you stay",
                      "Free Ghost Audit on signup",
                    ].map((i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-orange/20 text-brand-orange">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5"><path d="m5 12 5 5L20 7"/></svg>
                        </span>
                        {i}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-md bg-brand-orange px-5 text-sm font-semibold text-white shadow-md shadow-brand-orange/30 hover:opacity-90">
                    Reserve a slot
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-navy/10 bg-white p-8 shadow-sm">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Standard</div>
              <div className="mt-6 flex items-baseline gap-2">
                <div className="text-5xl font-semibold tracking-tight text-brand-navy">€199</div>
                <div className="text-sm text-muted-foreground">/ broker / month</div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Public pricing once early access closes. Same product, no founder access.</p>
              <ul className="mt-6 space-y-2.5 text-sm text-brand-navy/80">
                {["Everything in early access", "Standard onboarding", "Priority support"].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5"><path d="m5 12 5 5L20 7"/></svg>
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-md border border-brand-navy/15 bg-background px-5 text-sm font-medium text-brand-navy hover:bg-brand-navy/5">
                Join the waitlist
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/pricing" className="text-sm font-semibold text-brand-orange underline-offset-4 hover:underline">
              Compare all tiers (Defensive · Offensive · Firm) →
            </Link>
          </div>
        </Section>
      </Reveal>

      {/* The math */}
      <Section className="bg-brand-navy text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-brand-orange/15 blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <div className="text-center">
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">The math</div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
              One save. <span className="text-brand-orange">Then everything is gravy.</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { v: "$7,000", l: "Average commission preserved per saved clawback" },
              { v: `${MONTHS_COVERED} months`, l: "Of subscription covered by a single save" },
              { v: "~3 weeks", l: "Of detectable signals before a client leaves" },
            ].map((s) => (
              <div key={s.l} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm">
                <div className="text-4xl font-semibold tracking-tight text-white md:text-5xl">{s.v}</div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ROI calculator */}
      <Section id="calculator">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-brand-orange">ROI calculator</div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-brand-navy md:text-4xl">
            The math, on your numbers.
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Drag the sliders. The product pays for itself the first time it prevents a single save.
          </p>
        </div>

        <div
          className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl p-[1px]"
          style={{ background: "linear-gradient(135deg, rgba(20,33,61,0.15) 0%, rgba(255,143,77,0.4) 100%)" }}
        >
          <div className="grid gap-0 rounded-2xl bg-white md:grid-cols-2">
            <div className="space-y-7 p-8">
              <Field label="Clients on watchlist" value={clients} min={1} max={500} step={1} onChange={setClients} unit="" />
              <Field label="Average commission per client" value={commission} min={500} max={20000} step={100} onChange={setCommission} unit="$" />
              <Field label="Expected clawback rate" value={rate} min={1} max={30} step={1} onChange={setRate} unit="%" />
            </div>
            <div
              className="relative overflow-hidden p-8 text-white"
              style={{ background: "linear-gradient(160deg, #14213d 0%, #0e1830 60%, #1a2a4f 100%)" }}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 opacity-50" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)" }} />
              <div className="relative">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-orange">Annual exposure</div>
                <div className="mt-2 text-5xl font-semibold tracking-tight text-white">${expectedLoss.toLocaleString()}</div>

                <div className="mt-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">ClawbackVault, early access</div>
                <div className="mt-2 text-2xl font-medium text-white">${annualCost.toLocaleString()}<span className="text-sm text-white/55"> / year</span></div>

                <div className="mt-7 border-t border-white/10 pt-6">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-orange">Net protected if we save half</div>
                  <div className="mt-2 text-4xl font-semibold tracking-tight text-brand-orange md:text-5xl">
                    ${netHalfSaved.toLocaleString()}
                  </div>
                </div>
                <p className="mt-6 text-xs text-white/55">Indicative only. Average commission preserved per save in our pilot data: ~$7,000.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Final Ghost Audit CTA, orange panel */}
      <Reveal variant="curtain" curtainClassName="bg-white">
        <Section className="border-b-0 bg-brand-orange text-white">
          <Reveal variant="scale" delay={160}>
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Free Ghost Audit
              </div>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-white md:text-4xl">
                See what signals are already sitting in your inbox.
              </h2>
              <p className="mt-4 text-lg text-white/70">
                We open the last 90 days of your client threads and show you what you missed, with
                the dollar amount attached. Free. No commitment.
              </p>
              <div className="mt-8 flex justify-center">
                <GhostAuditCTA onClick={() => setOpen(true)} />
              </div>
            </div>
          </Reveal>
        </Section>
      </Reveal>
    </>
  );
}
