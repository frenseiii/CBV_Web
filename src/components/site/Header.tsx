import { Link } from "@tanstack/react-router";

const navItems = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/features", label: "Features" },
  { to: "/security", label: "Security" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-brand-navy">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white md:text-2xl">
          <span className="inline-block h-3 w-3 rounded-sm bg-brand-orange shadow-[0_0_18px_oklch(0.7_0.2_47/0.6)]" aria-hidden />
          ClawbackVault
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-white/65 transition-colors hover:text-white"
              activeProps={{ className: "text-white" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <a
          href="https://app.clawbackvault.com/ghost-audit"
          className="inline-flex h-9 items-center justify-center rounded-md bg-brand-orange px-4 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
        >
          Free Ghost Audit
        </a>
      </div>
    </header>
  );
}
