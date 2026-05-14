import { useEffect, useState } from "react";

/**
 * Visualizes the inbox → filter → mask → analyze → alert pipeline.
 * A token "pulse" travels through the stages on a loop.
 */
const STEPS = [
  { t: "Inbox scan", d: "Every 5 min · background" },
  { t: "Junk filter", d: "Newsletters discarded < 50ms" },
  { t: "PII masked", d: "Name, email, $ → tokens" },
  { t: "Signal model", d: "Payout · rate · silence" },
  { t: "Alert + draft", d: "Email + WhatsApp on T1" },
];

export function PipelineMock() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((s) => (s + 1) % STEPS.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-[1px] shadow-2xl shadow-brand-navy/30"
      style={{ background: "linear-gradient(135deg, rgba(255,143,77,0.55) 0%, rgba(255,255,255,0.18) 40%, rgba(255,143,77,0.4) 100%)" }}
    >
      <div
        className="relative rounded-2xl p-6 text-white"
        style={{
          background: "linear-gradient(160deg, #14213d 0%, #0e1830 60%, #1a2a4f 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 rounded-t-2xl opacity-50" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)" }} />

        <div className="relative mb-6 flex items-center justify-between">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-orange">
            Live pipeline
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/70">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            Healthy
          </div>
        </div>

        <div className="relative">
          {/* track */}
          <div className="absolute left-0 right-0 top-4 h-px bg-white/15" />
          <div
            className="absolute left-0 top-4 h-px bg-gradient-to-r from-brand-orange to-brand-orange/40 transition-all duration-700"
            style={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
          />
          <div className="grid grid-cols-5 gap-3">
            {STEPS.map((s, i) => (
              <div key={s.t} className="relative">
                <div
                  className={`relative z-10 mx-auto flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-mono transition-all duration-500 ${
                    i === active
                      ? "border-brand-orange bg-brand-orange text-white scale-110 shadow-[0_0_20px_rgba(249,115,22,0.6)]"
                      : i < active
                      ? "border-brand-orange/50 bg-brand-orange/15 text-brand-orange"
                      : "border-white/20 bg-white/5 text-white/50"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-3 text-center">
                  <div className="text-xs font-medium text-white">{s.t}</div>
                  <div className="mt-0.5 text-[10px] leading-tight text-white/55">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample line */}
        <div className="relative mt-7 rounded-md border border-white/10 bg-black/30 p-3 font-mono text-[11px] leading-relaxed text-white/80">
          <span className="text-brand-orange">→ </span>
          {active === 0 && <>fetched 3 new threads · marta.j@…, peter.q@…, news@cba</>}
          {active === 1 && <>discarded 1 (newsletter: news@cba) · 2 forwarded</>}
          {active === 2 && <>"Hi [CLIENT], my payout figure on [LOAN_ID]…"</>}
          {active === 3 && <>signal: payout_request · confidence 0.94 · risk: HIGH</>}
          {active === 4 && <>alert dispatched · email + whatsapp · draft attached</>}
        </div>
      </div>
    </div>
  );
}
