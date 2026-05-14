import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">ClawbackVault</span>, Intent detection for brokers.
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/how-it-works" className="hover:text-foreground">How it works</Link>
          <Link to="/features" className="hover:text-foreground">Features</Link>
          <Link to="/security" className="hover:text-foreground">Security</Link>
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </nav>
        <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} ClawbackVault</div>
      </div>
    </footer>
  );
}
