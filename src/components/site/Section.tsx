import type { ReactNode } from "react";

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative ${className}`}>
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">{children}</div>
    </section>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <SectionLabel>{eyebrow}</SectionLabel>}
      <Tag className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {title}
      </Tag>
      {lead && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{lead}</p>}
    </div>
  );
}
