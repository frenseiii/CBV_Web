import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Section, SectionHeading } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { requireAdmin } from "@/lib/admin-auth.functions";

type LeadStatus = "audit_requested" | "audit_delivered" | "activated" | "paused" | "unsubscribed";

type Lead = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  brokerage: string | null;
  broker_type: string | null;
  inbox_provider: string | null;
  watchlist_size: number | null;
  notes: string | null;
  status: LeadStatus;
  created_at: string;
  audit_delivered_at: string | null;
  activated_at: string | null;
};

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin, Leads" }, { name: "robots", content: "noindex" }] }),
  beforeLoad: async () => {
    // Server-verified admin gate. Hydrate the Supabase session first so the
    // bearer token is attached when the server fn is invoked.
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      throw redirect({ to: "/admin/login" });
    }
    try {
      await requireAdmin();
    } catch {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminLeads,
});

function AdminLeads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/admin/login" });
        return;
      }
      setAuthChecked(true);
      await load();
    })();
  }, []);

  async function load() {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
      return;
    }
    setLeads(data as Lead[]);
  }

  async function setStatus(lead: Lead, status: LeadStatus) {
    const patch = {
      status: status,
      ...(status === "audit_delivered" && !lead.audit_delivered_at ? { audit_delivered_at: new Date().toISOString() } : {}),
      ...(status === "activated" && !lead.activated_at ? { activated_at: new Date().toISOString() } : {}),
    };
    const { error } = await supabase.from("leads").update(patch).eq("id", lead.id);
    if (error) {
      setError(error.message);
      return;
    }
    await load();
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  if (!authChecked) return null;

  return (
    <Section>
      <div className="flex items-center justify-between">
        <SectionHeading as="h1" eyebrow="Admin" title="Leads" />
        <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground">Sign out</button>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Brokerage</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Inbox</th>
              <th className="px-4 py-3">Book</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads?.map((l) => (
              <tr key={l.id} className="border-t border-border align-top">
                <td className="px-4 py-3 text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-medium">{l.first_name} {l.last_name ?? ""}</td>
                <td className="px-4 py-3"><a className="text-primary hover:underline" href={`mailto:${l.email}`}>{l.email}</a></td>
                <td className="px-4 py-3">{l.brokerage}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.broker_type}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.inbox_provider}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.watchlist_size ?? "—"}</td>
                <td className="px-4 py-3"><StatusPill status={l.status} /></td>
                <td className="px-4 py-3">
                  <select
                    value={l.status}
                    onChange={(e) => setStatus(l, e.target.value as LeadStatus)}
                    className="h-8 rounded border border-border bg-background px-2 text-xs"
                  >
                    <option value="audit_requested">audit_requested</option>
                    <option value="audit_delivered">audit_delivered</option>
                    <option value="activated">activated</option>
                    <option value="paused">paused</option>
                    <option value="unsubscribed">unsubscribed</option>
                  </select>
                </td>
              </tr>
            ))}
            {leads && leads.length === 0 && (
              <tr><td className="px-4 py-8 text-center text-muted-foreground" colSpan={9}>No leads yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone: Record<string, string> = {
    audit_requested: "bg-orange-100 text-orange-800",
    audit_delivered: "bg-blue-100 text-blue-800",
    activated: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    unsubscribed: "bg-gray-200 text-gray-700",
  };
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${tone[status] ?? "bg-muted text-muted-foreground"}`}>{status}</span>;
}
