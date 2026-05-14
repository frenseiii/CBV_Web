import { useEffect, useState } from "react";

/**
 * Cinematic product-demo animation that fits inside a 16:10 MacBook screen.
 *
 * Choreography (loops every ~14s):
 *   0  notification toast slides in (top-right), "ClawbackVault Alert"
 *   1  cursor glides to it and clicks
 *   2  email opens with staged reveal (header → body → draft → status)
 *   3  REPLY YES, typed response, send animation
 *   4  ✓ Sent, green confirmation pulse, then loop
 */

const STAGE_MS = [2400, 1800, 4200, 2600, 1800] as const;
const TOTAL = STAGE_MS.reduce((a, b) => a + b, 0);

export function GmailAlertMock() {
  const [t, setT] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      setT((now - start) % TOTAL);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // derive stage + local progress
  let stage = 0;
  let acc = 0;
  for (let i = 0; i < STAGE_MS.length; i++) {
    if (t < acc + STAGE_MS[i]) {
      stage = i;
      break;
    }
    acc += STAGE_MS[i];
  }
  const local = Math.min(1, Math.max(0, (t - acc) / STAGE_MS[stage]));
  const ease = (x: number) => 1 - Math.pow(1 - x, 3);
  const e = ease(local);

  // Toast: visible only during stage 0 and start of stage 1
  const toastOpacity =
    stage === 0 ? Math.min(1, local * 2) : stage === 1 ? 1 - local : 0;
  const toastY = stage === 0 ? -20 + 20 * e : 0;
  const toastScale = stage === 1 ? 1 - 0.05 * local : 1;

  // Cursor path during stage 1: from bottom-right to the TOP email row
  const cursorVisible = stage >= 0 && stage <= 1;
  const cx = stage <= 0 ? 78 : 78 - 33 * e; // ~45% across main area (top email)
  const cy = stage <= 0 ? 80 : 80 - 72 * e; // ~8% from top (first row)
  const clickPulse = stage === 1 && local > 0.85 ? (local - 0.85) / 0.15 : 0;

  // Email open: stage 2 reveals; remains visible through 3-4
  const emailOpen = stage >= 2;
  const emailReveal = stage === 2 ? e : 1;

  // Stage 3: button approval, no typing needed


  // Sent, stage 4
  const sent = stage === 4;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f6f8fc] font-sans text-[12px] text-zinc-800">
      {/* Chrome browser chrome */}
      <div className="flex items-center gap-1.5 bg-[#dee1e6] px-3 pt-2">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex h-7 w-72 items-center gap-2 rounded-t-lg bg-white px-3 text-[10px] text-zinc-600 shadow-[inset_0_-1px_0_white]">
          <svg viewBox="0 0 24 24" className="h-3 w-3.5" aria-hidden>
            <path fill="#EA4335" d="M2 6.5v11A1.5 1.5 0 003.5 19H6V9.6l6 4.5 6-4.5V19h2.5A1.5 1.5 0 0022 17.5v-11L12 14 2 6.5z" />
          </svg>
          <span className="truncate">Inbox (127), james@brokerage.com</span>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-[#dee1e6] px-3 pb-2">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] text-zinc-600 shadow-sm">
          <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 text-emerald-600" fill="currentColor">
            <path d="M12 2a5 5 0 015 5v3h1a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h1V7a5 5 0 015-5zm3 8V7a3 3 0 10-6 0v3h6z" />
          </svg>
          mail.google.com/mail/u/0/#inbox
        </div>
      </div>

      {/* Gmail header */}
      <div className="flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-2">
        <svg viewBox="0 0 24 24" className="h-5 w-6" aria-hidden>
          <path fill="#4285F4" d="M2 6.5v11A1.5 1.5 0 003.5 19H6V9.6l6 4.5 6-4.5V19h2.5A1.5 1.5 0 0022 17.5v-11L12 14 2 6.5z" />
          <path fill="#34A853" d="M6 19V9.6L2 6.5v11A1.5 1.5 0 003.5 19H6z" />
          <path fill="#FBBC04" d="M18 19h2.5a1.5 1.5 0 001.5-1.5v-11l-4 3.1V19z" />
          <path fill="#EA4335" d="M6 9.6l6 4.5 6-4.5V5l-6 4.5L6 5v4.6z" />
        </svg>
        <span className="text-base font-normal text-zinc-700" style={{ fontFamily: "'Product Sans', system-ui" }}>
          Gmail
        </span>
        <div className="ml-4 flex h-8 flex-1 items-center gap-2 rounded-lg bg-[#EAF1FB] px-3 text-[11px] text-zinc-600">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-zinc-500" fill="currentColor">
            <path d="M10 4a6 6 0 104.47 10.03l4.25 4.25 1.41-1.41-4.25-4.25A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z" />
          </svg>
          Search mail
        </div>
        <div className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy text-[10px] font-semibold text-white">
          JD
        </div>
      </div>

      {/* Body, sidebar + main */}
      <div className="flex h-[calc(100%-92px)]">
        {/* Sidebar */}
        <div className="w-32 shrink-0 border-r border-zinc-200 bg-white px-2 py-2.5">
          <button className="mb-2 flex h-9 w-full items-center gap-2 rounded-2xl bg-[#C2E7FF] px-3 text-[11px] font-medium text-zinc-800">
            <span className="text-base leading-none">+</span> Compose
          </button>
          <ul className="space-y-0.5 text-[11px] text-zinc-700">
            {[
              ["Inbox", "127", true],
              ["Starred", "", false],
              ["Snoozed", "", false],
              ["Sent", "", false],
              ["Drafts", "3", false],
            ].map(([n, c, active]) => (
              <li
                key={n as string}
                className={`flex items-center justify-between rounded-r-full px-3 py-1 ${
                  active ? "bg-[#FCE8E6] font-semibold text-[#C5221F]" : ""
                }`}
              >
                <span>{n}</span>
                {c && <span className="text-[10px]">{c as string}</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Main content area */}
        <div className="relative min-w-0 flex-1 bg-white">
          {/* INBOX LIST (visible before email open) */}
          <div
            className="absolute inset-0 transition-opacity"
            style={{ opacity: emailOpen ? 0 : 1, transition: "opacity 350ms ease" }}
          >
            <div className="divide-y divide-zinc-100">
              {[
                { from: "Marta J.", subj: "Quick question about my loan", time: "9:14 AM", unread: true, accent: true },
                { from: "Sarah Chen", subj: "Re: Pre-approval letter", time: "8:42 AM", unread: true },
                { from: "Lender Updates", subj: "Rate sheet, week of Mar 4", time: "8:01 AM" },
                { from: "Tom Reilly", subj: "Settlement docs attached", time: "Yesterday" },
                { from: "Compliance", subj: "Q2 audit reminder", time: "Yesterday" },
                { from: "Pat Murphy", subj: "Refinance follow-up", time: "Mar 3" },
              ].map((row, i) => {
                const isTop = i === 0;
                const highlight = stage === 1 && local > 0.3;
                return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-2 text-[11px] transition-all duration-500 ${
                    row.unread ? "bg-white font-semibold text-zinc-900" : "bg-[#f6f8fc] text-zinc-600"
                  } ${isTop && highlight ? "ring-2 ring-brand-orange/60 shadow-md relative z-10 scale-[1.01]" : ""}`}
                  style={{
                    filter: !isTop && highlight ? "blur(2px)" : "none",
                    opacity: !isTop && highlight ? 0.45 : 1,
                  }}
                >
                  <span className="h-3 w-3 rounded-sm border border-zinc-300" />
                  <svg viewBox="0 0 24 24" className="h-3 w-3 text-zinc-300" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="w-24 truncate">{row.from}</span>
                  <span className="flex-1 truncate">
                    {row.subj}
                    {row.accent && (
                      <span className="ml-2 rounded-sm bg-brand-orange/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-brand-orange">
                        ClawbackVault
                      </span>
                    )}
                  </span>
                  <span className="ml-auto text-[10px]">{row.time}</span>
                </div>
                );
              })}
            </div>
          </div>

          {/* OPENED EMAIL */}
          <div
            className="absolute inset-0 overflow-hidden bg-white"
            style={{
              opacity: emailOpen ? 1 : 0,
              transform: `translateY(${(1 - emailReveal) * 16}px)`,
              transition: "opacity 350ms ease, transform 450ms ease",
            }}
          >
            <div className="flex h-full flex-col px-5 pt-4">
              <div className="flex items-start gap-2">
                <h3 className="flex-1 text-[15px] font-normal leading-tight text-zinc-900">
                  Marta J. asked broker A for a refinance quote
                </h3>
                <span className="rounded-sm bg-[#FCE8E6] px-1.5 py-0.5 text-[9px] font-medium text-[#C5221F]">
                  Inbox
                </span>
                <span className="rounded-sm bg-brand-orange/15 px-1.5 py-0.5 text-[9px] font-semibold text-brand-orange">
                  ClawbackVault
                </span>
              </div>

              <div className="mt-3 flex items-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
                  CV
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 text-[11px]">
                    <span className="font-semibold text-zinc-900">ClawbackVault Alerts</span>
                    <span className="text-zinc-500">&lt;alerts@clawbackvault.com&gt;</span>
                    <span className="ml-auto text-zinc-500">9:14 AM</span>
                  </div>
                  <div className="text-[10px] text-zinc-500">to me ▾</div>
                </div>
              </div>

              <div className="mt-3 space-y-2.5 text-[11.5px] leading-relaxed text-zinc-800">
                <p>Hi James,</p>
                <p>
                  We detected a <span className="font-semibold text-[#C5221F]">high-risk signal</span> from{" "}
                  <span className="font-medium">Marta J.</span>, she pinged another broker about a payout figure.
                </p>

                <div className="rounded-md border-l-[3px] border-brand-orange bg-brand-orange-soft/40 px-3 py-2 text-[10.5px] italic text-zinc-700">
                  "Hey, just wondering what my payout figure looks like, chatted with another bank, want to compare."
                </div>

                <div className="grid grid-cols-3 overflow-hidden rounded-md border border-zinc-200 text-[10px]">
                  <div className="border-r border-zinc-200 p-2">
                    <div className="text-[8.5px] uppercase tracking-wider text-zinc-500">Confidence</div>
                    <div className="mt-0.5 text-[13px] font-semibold text-zinc-900">94%</div>
                  </div>
                  <div className="border-r border-zinc-200 p-2">
                    <div className="text-[8.5px] uppercase tracking-wider text-zinc-500">Window left</div>
                    <div className="mt-0.5 text-[13px] font-semibold text-zinc-900">6 of 24 mo</div>
                  </div>
                  <div className="p-2">
                    <div className="text-[8.5px] uppercase tracking-wider text-zinc-500">At risk</div>
                    <div className="mt-0.5 text-[13px] font-semibold text-brand-orange">$4,820</div>
                  </div>
                </div>

                <p className="text-[10.5px] text-zinc-600">
                  Tap <span className="rounded bg-emerald-600 px-1.5 py-[1px] font-semibold text-[9px] text-white">YES</span> to send, or <span className="rounded bg-zinc-200 px-1.5 py-[1px] font-semibold text-[9px] text-zinc-700">Edit</span> first.
                </p>
              </div>

              {/* Action bar, YES / Edit buttons */}
              <div className="mt-auto mb-4 rounded-lg border border-zinc-300 bg-zinc-50 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-1.5 text-[10px] text-zinc-500">
                  <span>Approve & send draft to Marta</span>
                  <span>{sent ? "✓ Sent" : "Awaiting approval"}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <button
                    className={`relative inline-flex h-8 items-center gap-1.5 rounded-md px-4 text-[11px] font-semibold text-white shadow-sm transition-all ${
                      sent ? "bg-emerald-600" : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                    style={{
                      transform: stage === 3 && local > 0.85 ? "scale(0.94)" : "scale(1)",
                      boxShadow:
                        stage === 3 && local > 0.5
                          ? "0 0 0 3px rgba(16,185,129,0.35)"
                          : undefined,
                    }}
                  >
                    {sent ? "✓ Sent" : "YES, send it"}
                  </button>
                  <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-4 text-[11px] font-semibold text-zinc-700 shadow-sm">
                    Edit first
                  </button>
                  {sent && (
                    <span className="ml-auto text-[10px] font-medium text-emerald-700">
                      Sent from your inbox
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>


          {/* TOAST NOTIFICATION (top-right of screen) */}
          <div
            className="absolute right-3 top-3 z-40 w-[240px] rounded-lg border border-white/10 bg-brand-navy p-3 text-white shadow-2xl shadow-brand-navy/40 ring-1 ring-black/20"
            style={{
              opacity: toastOpacity,
              transform: `translateY(${toastY}px) scale(${toastScale})`,
              pointerEvents: "none",
            }}
          >
            <div className="flex items-start gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-orange text-[10px] font-bold text-white">
                CV
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-orange">
                    ClawbackVault
                  </span>
                  <span className="text-[9px] text-white/50">now</span>
                </div>
                <div className="mt-0.5 truncate text-[11px] font-semibold text-white">
                  High-risk signal · Marta J.
                </div>
                <div className="text-[10px] text-white/70">
                  $4,820 commission at risk, open to review.
                </div>
              </div>
            </div>
          </div>

          {/* CURSOR */}
          {cursorVisible && (
            <div
              className="absolute z-50"
              style={{
                left: `${cx}%`,
                top: `${cy}%`,
                transform: "translate(-2px,-2px)",
                pointerEvents: "none",
              }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                <path d="M3 2l7.5 18 2-7.5L20 10z" fill="white" stroke="#0a0a0c" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              {clickPulse > 0 && (
                <span
                  className="absolute -left-2 -top-2 block h-9 w-9 rounded-full border-2 border-brand-orange"
                  style={{ opacity: 1 - clickPulse, transform: `scale(${0.6 + clickPulse * 0.8})` }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
