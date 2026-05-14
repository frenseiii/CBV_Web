import type { ReactNode } from "react";

/**
 * Consistent page hero used across How it works / Security / Pricing / Features.
 * Navy-on-white with orange eyebrow + soft ambient blob, matches landing aesthetic.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-brand-navy/5 bg-gradient-to-b from-white via-brand-orange-soft/15 to-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-brand-orange/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--brand-navy) 1px, transparent 1px), linear-gradient(to bottom, var(--brand-navy) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-4xl px-6 pt-16 pb-14 text-center md:pt-24 md:pb-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-navy/10 bg-white/80 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange shadow-sm backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
          {eyebrow}
        </div>
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.02em] text-brand-navy md:text-5xl md:leading-[1.05]">
          {title}
        </h1>
        {lead && (
          <p className="mx-auto mt-5 max-w-2xl text-base text-brand-navy/70 md:text-lg">{lead}</p>
        )}
        {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}
