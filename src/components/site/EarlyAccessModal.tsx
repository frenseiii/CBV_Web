import { useMemo, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const COUNTRIES = ["Australia", "Ireland", "United Kingdom", "Canada", "Other"] as const;
type Country = (typeof COUNTRIES)[number];

const BROKERAGES: Record<Country, string[]> = {
  Australia: [
    "Independent Broker", "AFG", "Aussie", "Connective", "Finsure", "Loan Market",
    "Mortgage Choice", "Yellow Brick Road", "Nectar", "Specialist Finance Group",
    "Smartline", "PLAN Australia", "Choice Aggregation Services", "Astute Financial", "Other",
  ],
  Ireland: [
    "Independent Broker", "Brokers Ireland", "MoneySherpa", "Doddl", "Mortgage Store",
    "Park Financial", "Trust Mortgages", "Other",
  ],
  "United Kingdom": [
    "Independent Broker", "Mortgage Advice Bureau", "John Charcol", "London & Country (L&C)",
    "Habito", "Trinity Financial", "SPF Private Clients", "Coreco", "Alexander Hall", "Other",
  ],
  Canada: [
    "Independent Broker", "Mortgage Alliance", "Dominion Lending Centres", "M3 Group",
    "TMG The Mortgage Group", "Centum", "Verico", "Mortgage Architects", "Other",
  ],
  Other: ["Independent Broker", "Other"],
};

const TEAM_SIZES = ["Just me", "2–5", "6–15", "16–50", "50+"];
const CONCERNS = [
  "Clients refinancing elsewhere",
  "Clawback exposure",
  "Losing visibility into my book",
  "Re-engaging dormant clients",
  "Scaling follow-up",
  "Protecting trail income",
  "Just exploring",
];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">{label}</span>
      {children}
    </label>
  );
}

const inputCx =
  "w-full h-11 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-brand-orange/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-brand-orange/20";

type Tier = "free" | "founding";

export function EarlyAccessModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [step, setStep] = useState<"intro" | "form">("intro");
  const [tier, setTier] = useState<Tier>("free");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState<Country>("Australia");
  const [form, setForm] = useState({
    fullName: "", email: "", mobile: "", brokerage: "", teamSize: "", concern: "",
  });

  const brokerages = useMemo(() => BROKERAGES[country], [country]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const email = form.email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid work email.");
      return;
    }
    const [first, ...rest] = form.fullName.trim().split(/\s+/);
    setSubmitting(true);
    const { error: insertError } = await supabase.from("leads").insert({
      first_name: (first || form.fullName.trim()).slice(0, 100),
      last_name: (rest.join(" ") || null)?.slice(0, 100) ?? null,
      email,
      brokerage: form.brokerage || null,
      notes: [
        `tier: ${tier}`,
        `mobile: ${form.mobile}`,
        `country: ${country}`,
        `team_size: ${form.teamSize}`,
        `concern: ${form.concern}`,
      ].join(" | ").slice(0, 2000),
      status: "audit_requested",
      source: tier === "founding" ? "early_access_founding" : "early_access_free",
    });
    setSubmitting(false);
    if (insertError && insertError.code !== "23505") {
      setError("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  const close = (v: boolean) => {
    onOpenChange(v);
    if (!v) {
      setTimeout(() => {
        setStep("intro");
        setTier("free");
        setSubmitted(false);
        setError(null);
        setSubmitting(false);
        setForm({ fullName: "", email: "", mobile: "", brokerage: "", teamSize: "", concern: "" });
        setCountry("Australia");
      }, 250);
    }
  };

  const pickTier = (t: Tier) => {
    setTier(t);
    setStep("form");
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent
        className="max-w-2xl overflow-hidden border-white/10 bg-[#0b1226] p-0 text-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
      >
        {/* ambient bg */}
        <div className="pointer-events-none absolute inset-0 -z-0 opacity-80">
          <div className="absolute -top-32 left-1/2 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-brand-orange/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />
        </div>

        <div className="relative max-h-[88vh] overflow-y-auto p-7 md:p-9">
          {step === "intro" ? (
            <IntroGate onPick={pickTier} />
          ) : !submitted ? (
            <>
              <div className="mb-1 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-orange">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-orange animate-pulse" />
                  {tier === "founding" ? "Founding Seat · 50 only" : "Free Pre-register"}
                </div>
                <button
                  type="button"
                  onClick={() => setStep("intro")}
                  className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/45 hover:text-white/80"
                >
                  ← Back
                </button>
              </div>
              <DialogTitle className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-[1.7rem]">
                {tier === "founding" ? "Claim your founding seat." : "Reserve your spot on the waitlist."}
              </DialogTitle>
              <p className="mt-2 text-sm text-white/60">
                {tier === "founding"
                  ? "€20 fully-refundable deposit. Locks in lifetime founder pricing (~40% off) and Cohort 01 onboarding the day we launch."
                  : "Launching in 8 weeks. Tell us a bit about your book, we'll line up your free inbox scan first."}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Full name">
                  <input required className={inputCx} value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Jane Doe" maxLength={100} />
                </Field>
                <Field label="Work email">
                  <input required type="email" className={inputCx} value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@brokerage.com" maxLength={255} />
                </Field>
                <Field label="Mobile number">
                  <input required type="tel" className={inputCx} value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    placeholder="+61 4xx xxx xxx" maxLength={32} />
                </Field>
                <Field label="Country">
                  <select required className={inputCx} value={country}
                    onChange={(e) => { setCountry(e.target.value as Country); setForm({ ...form, brokerage: "" }); }}>
                    {COUNTRIES.map((c) => <option key={c} value={c} className="bg-[#0b1226]">{c}</option>)}
                  </select>
                </Field>
                <Field label="Brokerage / Aggregator">
                  <select required className={inputCx} value={form.brokerage}
                    onChange={(e) => setForm({ ...form, brokerage: e.target.value })}>
                    <option value="" className="bg-[#0b1226]">Select…</option>
                    {brokerages.map((b) => <option key={b} value={b} className="bg-[#0b1226]">{b}</option>)}
                  </select>
                </Field>
                <Field label="Team size">
                  <select required className={inputCx} value={form.teamSize}
                    onChange={(e) => setForm({ ...form, teamSize: e.target.value })}>
                    <option value="" className="bg-[#0b1226]">Select…</option>
                    {TEAM_SIZES.map((s) => <option key={s} value={s} className="bg-[#0b1226]">{s}</option>)}
                  </select>
                </Field>
                <div className="md:col-span-2">
                  <Field label="Biggest concern right now">
                    <select required className={inputCx} value={form.concern}
                      onChange={(e) => setForm({ ...form, concern: e.target.value })}>
                      <option value="" className="bg-[#0b1226]">Select…</option>
                      {CONCERNS.map((c) => <option key={c} value={c} className="bg-[#0b1226]">{c}</option>)}
                    </select>
                  </Field>
                </div>

                {error && (
                  <p className="md:col-span-2 -mb-1 text-sm text-brand-orange">{error}</p>
                )}
                <div className="md:col-span-2 mt-2 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                    {tier === "founding"
                      ? "Encrypted · Deposit link emailed · Refundable"
                      : "Encrypted · No card · Free inbox scan first"}
                  </p>
                  <button type="submit" disabled={submitting}
                    className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-md bg-brand-orange px-6 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(255,143,77,0.7)] transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0">
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">
                      {submitting
                        ? "Reserving…"
                        : tier === "founding" ? "Reserve my founding seat →" : "Reserve my spot →"}
                    </span>
                  </button>
                </div>

              </form>
            </>
          ) : (
            <GhostAuditPreview name={form.fullName.split(" ")[0] || "there"} tier={tier} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function IntroGate({ onPick }: { onPick: (t: Tier) => void }) {
  return (
    <div className="relative">
      <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-orange">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-orange animate-pulse" />
        Launching in 8 weeks
      </div>
      <DialogTitle className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-[1.7rem]">
        Pick how you want in.
      </DialogTitle>
      <p className="mt-2 text-sm text-white/60">
        Every broker who joins gets a free Ghost Audit on their inbox first, we show you the leaks before you commit to anything.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <button
          onClick={() => onPick("free")}
          className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-white/25 hover:bg-white/[0.06]"
        >
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Option 1</div>
          <div className="mt-2 text-lg font-semibold text-white">Pre-register, free</div>
          <p className="mt-2 text-sm text-white/60">
            Join the private waitlist. We'll line up your free inbox scan and notify you when Cohort 01 opens.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-orange">
            Continue free <span aria-hidden>→</span>
          </div>
        </button>

        <button
          onClick={() => onPick("founding")}
          className="group relative overflow-hidden rounded-xl border border-brand-orange/40 bg-gradient-to-br from-brand-orange/15 to-transparent p-5 text-left transition hover:border-brand-orange/70 hover:from-brand-orange/20"
        >
          <div className="absolute right-3 top-3 rounded-full border border-brand-orange/40 bg-brand-orange/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-orange">
            37 / 50 left
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-orange">Option 2 · recommended</div>
          <div className="mt-2 text-lg font-semibold text-white">Founding Seat, €20</div>
          <p className="mt-2 text-sm text-white/65">
            Fully refundable deposit. Locks lifetime founder pricing (~40% off) and Day-1 onboarding when we go live.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
            Claim my seat <span aria-hidden>→</span>
          </div>
        </button>
      </div>

      <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
        Either path · Free Ghost Audit before you commit
      </p>
    </div>
  );
}

function GhostAuditPreview({ name, tier }: { name: string; tier: Tier }) {
  return (
    <div className="relative">
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
        {tier === "founding" ? "Founding seat reserved" : "You're on the early access list"}
      </div>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
        Welcome in, {name}.
      </h3>
      <p className="mt-2 text-sm text-white/60">
        {tier === "founding"
          ? "We'll email you a secure €20 deposit link within the hour. Refundable any time before launch. Here's a preview of your Ghost Audit."
          : "Here's a preview of what your Ghost Audit will look like. Your real data, surfaced instantly."}
      </p>

      {/* Mock terminal */}
      <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#070d1c]">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand-orange/70" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            ghost_audit · scanning
          </div>
          <div className="font-mono text-[10px] text-emerald-400">● live</div>
        </div>

        {/* Risk cards (blurred to show "hidden" feel, then sharp on hover) */}
        <div className="grid gap-3 p-4 md:grid-cols-3">
          {[
            { who: "M. K████", sig: "Refinance shop signal", risk: "HIGH", amt: "$6,840", hue: "from-rose-500/30 to-rose-500/0", chip: "bg-rose-400/15 text-rose-300 border-rose-400/30" },
            { who: "S. L████", sig: "Rate-quote thread", risk: "MED", amt: "$4,210", hue: "from-amber-500/25 to-amber-500/0", chip: "bg-amber-400/15 text-amber-300 border-amber-400/30" },
            { who: "J. R████", sig: "Dormant · re-engage", risk: "OPP", amt: "$700k LVR", hue: "from-emerald-500/25 to-emerald-500/0", chip: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30" },
          ].map((c, i) => (
            <div key={i} className={`group relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br ${c.hue} p-3`} style={{ animation: `fade-up 0.7s ease ${i * 120}ms both` }}>
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">{c.sig}</div>
                <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-widest ${c.chip}`}>{c.risk}</span>
              </div>
              <div className="mt-2 select-none text-base font-semibold text-white blur-[3px] transition group-hover:blur-0">
                {c.who}
              </div>
              <div className="mt-1 font-mono text-[11px] text-white/70">Est. exposure {c.amt}</div>
              {/* mini heatmap */}
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: 18 }).map((_, k) => (
                  <span key={k} className="h-2 flex-1 rounded-sm" style={{
                    background: `oklch(0.7 ${0.05 + (k % 7) * 0.025} ${i === 0 ? 30 : i === 1 ? 70 : 150} / ${0.25 + (k % 5) * 0.13})`
                  }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Signal stream */}
        <div className="border-t border-white/5 px-4 py-3 font-mono text-[11px] leading-relaxed text-white/55">
          <div><span className="text-emerald-400">›</span> watchlist · 184 threads attached</div>
          <div><span className="text-emerald-400">›</span> exit_intent_model · loaded · v2.1</div>
          <div><span className="text-brand-orange">›</span> 7 high-risk signals queued for your inbox<span className="ml-1 inline-block h-3 w-[6px] translate-y-[1px] bg-brand-orange animate-caret" /></div>
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-white/45">
        We'll be in touch within 48 hours to schedule your live audit.
      </p>
    </div>
  );
}
