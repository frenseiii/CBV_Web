import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/unsubscribe")({
  head: () => ({ meta: [{ title: "Unsubscribe · ClawbackVault" }, { name: "robots", content: "noindex" }] }),
  component: UnsubscribePage,
  validateSearch: (s: Record<string, unknown>) => ({ token: typeof s.token === "string" ? s.token : "" }),
});

type State = "loading" | "ready" | "already" | "invalid" | "done" | "error";

function UnsubscribePage() {
  const { token } = Route.useSearch();
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    (async () => {
      try {
        const res = await fetch(`/email/unsubscribe?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (!res.ok) { setState("invalid"); return; }
        if (data.valid) setState("ready");
        else if (data.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      } catch { setState("error"); }
    })();
  }, [token]);

  async function confirm() {
    setBusy(true);
    try {
      const res = await fetch(`/email/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) setState("done");
      else if (data.reason === "already_unsubscribed") setState("already");
      else setState("error");
    } catch { setState("error"); }
    setBusy(false);
  }

  return (
    <Section>
      <div className="mx-auto max-w-xl rounded-lg border border-border bg-card p-8 shadow-sm">
        {state === "loading" && <p className="text-sm text-muted-foreground">Loading…</p>}
        {state === "invalid" && (
          <>
            <h1 className="text-xl font-semibold">Invalid link</h1>
            <p className="mt-3 text-sm text-muted-foreground">This unsubscribe link is invalid or has expired.</p>
          </>
        )}
        {state === "already" && (
          <>
            <h1 className="text-xl font-semibold">Already unsubscribed</h1>
            <p className="mt-3 text-sm text-muted-foreground">You're no longer on our list. Nothing more to do.</p>
          </>
        )}
        {state === "ready" && (
          <>
            <h1 className="text-xl font-semibold">Unsubscribe from ClawbackVault</h1>
            <p className="mt-3 text-sm text-muted-foreground">Confirm to stop receiving emails from us. You can request your Ghost Audit again anytime.</p>
            <button onClick={confirm} disabled={busy} className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-foreground px-6 text-sm font-medium text-background disabled:opacity-60">
              {busy ? "Unsubscribing…" : "Confirm unsubscribe"}
            </button>
          </>
        )}
        {state === "done" && (
          <>
            <h1 className="text-xl font-semibold">You're unsubscribed.</h1>
            <p className="mt-3 text-sm text-muted-foreground">We won't email you again. Thanks for trying ClawbackVault.</p>
          </>
        )}
        {state === "error" && (
          <>
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="mt-3 text-sm text-muted-foreground">Please try again later.</p>
          </>
        )}
      </div>
    </Section>
  );
}
