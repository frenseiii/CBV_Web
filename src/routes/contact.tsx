import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Section, SectionHeading } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Free Ghost Audit · ClawbackVault" },
      { name: "description", content: "See exactly which clients in your last 90 days of sent emails are showing leaving signals. Free. Results instantly." },
      { property: "og:title", content: "Free Ghost Audit · ClawbackVault" },
      { property: "og:description", content: "Free scan of your last 90 days. Results instantly." },
    ],
  }),
  component: ContactPage,
});

const leadSchema = z.object({
  first_name: z.string().trim().min(1, "Required").max(100),
  last_name: z.string().trim().max(100).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid work email").max(255),
  brokerage: z.string().trim().min(1, "Required").max(150),
  broker_type: z.string().max(50),
  inbox_provider: z.string().max(50),
  watchlist_size: z.string().max(10).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries()) as Record<string, string>;
    const parsed = leadSchema.safeParse(raw);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setSubmitting(true);
    const v = parsed.data;
    const { error: insertError } = await supabase.from("leads").insert({
      first_name: v.first_name,
      last_name: v.last_name || null,
      email: v.email.toLowerCase(),
      brokerage: v.brokerage,
      broker_type: v.broker_type || null,
      inbox_provider: v.inbox_provider || null,
      watchlist_size: v.watchlist_size ? Number(v.watchlist_size) : null,
      notes: v.notes || null,
      status: "audit_requested",
      source: "website",
    });
    setSubmitting(false);
    if (insertError) {
      if (insertError.code === "23505") {
        setSubmitted(true); // Already requested, treat as success
        return;
      }
      setError("Something went wrong. Please try again or email us directly.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Free Ghost Audit"
          title="See what's already in your inbox."
          lead="We scan your last 90 days of sent emails and surface every client showing leaving signals. Free. Results instantly. No commitment."
        />
      </Section>

      <Section>
        {submitted ? (
          <div className="max-w-xl rounded-lg border border-border bg-card p-8 shadow-sm">
            <h2 className="text-xl font-medium text-foreground">You're in.</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Check your inbox. Your Ghost Audit lands instantly, with every signal we found and the dollar amount attached.
            </p>
          </div>
        ) : (
          <form className="grid max-w-2xl gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <Input id="first_name" label="First name" required />
              <Input id="last_name" label="Last name" />
            </div>
            <Input id="brokerage" label="Brokerage" required />
            <Input id="email" label="Work email" type="email" required />
            <div className="grid gap-2">
              <label htmlFor="broker_type" className="text-sm font-medium text-foreground">Broker type</label>
              <select id="broker_type" name="broker_type" className="h-11 rounded-md border border-border bg-background px-3 text-sm">
                <option value="Mortgage">Mortgage</option>
                <option value="Insurance">Insurance</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="inbox_provider" className="text-sm font-medium text-foreground">Inbox provider</label>
              <select id="inbox_provider" name="inbox_provider" className="h-11 rounded-md border border-border bg-background px-3 text-sm">
                <option value="Gmail">Gmail / Google Workspace</option>
                <option value="Outlook">Microsoft 365 / Outlook</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <Input id="watchlist_size" label="Approx. clients in clawback window" type="number" />
            <div className="grid gap-2">
              <label htmlFor="notes" className="text-sm font-medium text-foreground">Anything we should know</label>
              <textarea id="notes" name="notes" rows={4} className="rounded-md border border-border bg-background p-3 text-sm" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 w-fit items-center justify-center rounded-md bg-foreground px-6 text-sm font-medium text-background hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Run my Free Ghost Audit"}
            </button>
            <p className="text-xs text-muted-foreground">By submitting you agree to be contacted about your Ghost Audit. No marketing. Unsubscribe anytime.</p>
          </form>
        )}
      </Section>
    </>
  );
}

function Input({ id, label, type = "text", required }: { id: string; label: string; type?: string; required?: boolean }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}{required && <span className="text-muted-foreground"> *</span>}
      </label>
      <input id={id} name={id} type={type} required={required} className="h-11 rounded-md border border-border bg-background px-3 text-sm" />
    </div>
  );
}
