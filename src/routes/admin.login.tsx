import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Section, SectionHeading } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin login · ClawbackVault" }, { name: "robots", content: "noindex" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate({ to: "/admin" });
  }

  return (
    <Section>
      <div className="mx-auto max-w-md">
        <SectionHeading as="h1" eyebrow="Admin" title="Sign in" />
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-md border border-border bg-background px-3 text-sm" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-md border border-border bg-background px-3 text-sm" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button disabled={busy} className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-6 text-sm font-medium text-background disabled:opacity-60">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </Section>
  );
}
