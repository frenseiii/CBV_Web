import type { ReactNode } from "react";

/**
 * Highly realistic MacBook Pro frame, brushed aluminium with specular
 * highlights, dark bezel with notch, hinge cutout, and contact shadow.
 */
export function MacbookFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1100px] [perspective:2400px]">
      {/* LID */}
      <div
        className="relative rounded-[26px] p-[14px] shadow-[0_50px_90px_-30px_rgba(15,23,42,0.55),0_25px_45px_-20px_rgba(15,23,42,0.4)]"
        style={{
          background:
            "linear-gradient(165deg, #e8eaed 0%, #c8ccd1 18%, #b0b4b9 38%, #9ea2a7 55%, #babec3 72%, #8c9095 100%)",
        }}
      >
        {/* Top specular highlight band */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3 rounded-t-[26px] opacity-80"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)",
          }}
        />
        {/* Diagonal sheen */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[26px] opacity-40"
          style={{
            background:
              "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.5) 50%, transparent 65%)",
          }}
        />
        {/* Brushed metal micro-texture */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[26px] opacity-[0.18] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0px, rgba(0,0,0,0.4) 1px, rgba(255,255,255,0.3) 2px)",
          }}
        />
        {/* Aluminium edge highlights */}
        <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-white/60" />
        <div className="pointer-events-none absolute inset-[1px] rounded-[25px] ring-1 ring-black/15" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-[26px] bg-white/30" />

        {/* Bezel */}
        <div className="relative rounded-[16px] bg-[#08080a] p-[10px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_2px_8px_rgba(0,0,0,0.6)]">
          {/* Notch */}
          <div className="pointer-events-none absolute left-1/2 top-0 z-20 flex h-[20px] w-[160px] -translate-x-1/2 items-center justify-center rounded-b-[14px] bg-[#050507]">
            <span className="h-[5px] w-[5px] rounded-full bg-[#1c1c20] ring-[1px] ring-[#2c2c30]" />
          </div>

          {/* Screen */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-white ring-1 ring-black/40">
            {/* Glass reflection */}
            <div
              className="pointer-events-none absolute inset-0 z-30 opacity-[0.09] mix-blend-screen"
              style={{
                background:
                  "linear-gradient(115deg, transparent 25%, white 48%, transparent 72%)",
              }}
            />
            {/* Subtle inner glow at top */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-30 h-1/4 opacity-[0.08]"
              style={{
                background:
                  "linear-gradient(180deg, white 0%, transparent 100%)",
              }}
            />
            {children}
          </div>
        </div>
      </div>

      {/* HINGE */}
      <div className="relative mx-auto h-[16px] w-[103%] -translate-x-[1.5%]">
        <div
          className="absolute inset-x-0 top-0 h-[12px] rounded-b-[8px]"
          style={{
            background:
              "linear-gradient(180deg, #d4d7dc 0%, #a8acb1 30%, #82868b 70%, #6a6e73 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.7), 0 3px 6px rgba(0,0,0,0.25)",
          }}
        />
        {/* Brushed sheen on base */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[12px] rounded-b-[8px] opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0px, rgba(0,0,0,0.3) 1px, rgba(255,255,255,0.2) 2px)",
          }}
        />
        {/* Hinge notch under lid */}
        <div
          className="absolute left-1/2 top-0 h-[9px] w-[200px] -translate-x-1/2 rounded-b-[16px]"
          style={{
            background:
              "linear-gradient(180deg, #4a4e53 0%, #2a2e33 100%)",
            boxShadow: "inset 0 2px 5px rgba(0,0,0,0.6)",
          }}
        />
      </div>

      {/* BASE shadow / surface contact */}
      <div className="mx-auto mt-1.5 h-4 w-[88%] rounded-[50%] bg-brand-navy/30 blur-xl" />
    </div>
  );
}
