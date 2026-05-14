import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

// Cadence schedule: hours after created_at for each step.
// Sent only if lead.status is in ('audit_requested','audit_delivered') and not paused/unsubscribed/activated.
const SCHEDULE: { step: string; hoursAfter: number }[] = [
  { step: "audit-confirmation", hoursAfter: 0 },
  { step: "sequence-day-2", hoursAfter: 48 },
  { step: "sequence-day-5", hoursAfter: 5 * 24 },
  { step: "sequence-day-9", hoursAfter: 9 * 24 },
  { step: "sequence-day-14", hoursAfter: 14 * 24 },
];

export const Route = createFileRoute("/api/public/hooks/dispatch-emails")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !serviceKey) {
          return Response.json({ error: "config" }, { status: 500 });
        }

        // Authorize: caller must present the service role key as a Bearer token
        // (sent by pg_cron / trusted scheduler). Prevents public abuse.
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const token = authHeader.slice("Bearer ".length).trim();
        if (token !== serviceKey) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
        const admin = createClient(supabaseUrl, serviceKey);

        // Eligible leads: not paused / unsubscribed / activated
        const { data: leads, error } = await (admin as any)
          .from("leads")
          .select("id, first_name, email, created_at, status")
          .in("status", ["audit_requested", "audit_delivered"])
          .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .limit(500);

        if (error) return Response.json({ error: error.message }, { status: 500 });

        const now = Date.now();
        let queued = 0;
        const errors: string[] = [];

        for (const lead of leads ?? []) {
          const ageHours = (now - new Date(lead.created_at).getTime()) / 3_600_000;

          // Get steps already sent for this lead
          const { data: sends } = await (admin as any)
            .from("lead_email_sends")
            .select("step")
            .eq("lead_id", lead.id);
          const sentSteps = new Set((sends ?? []).map((s: any) => s.step));

          for (const slot of SCHEDULE) {
            if (sentSteps.has(slot.step)) continue;
            if (ageHours < slot.hoursAfter) continue;

            // Insert send record FIRST (unique constraint prevents duplicates if cron overlaps)
            const { error: insErr } = await (admin as any)
              .from("lead_email_sends")
              .insert({ lead_id: lead.id, step: slot.step });
            if (insErr) {
              if (insErr.code !== "23505") errors.push(`${lead.id}/${slot.step}: ${insErr.message}`);
              continue; // already sent (race) or other error, skip
            }

            try {
              await callSend(admin, {
                templateName: slot.step,
                recipientEmail: lead.email,
                idempotencyKey: `${slot.step}-${lead.id}`,
                templateData: { firstName: lead.first_name },
              });
              queued++;
            } catch (e: any) {
              errors.push(`${lead.id}/${slot.step}: ${e?.message ?? e}`);
            }
            break; // one email per lead per tick
          }
        }

        return Response.json({ queued, errors: errors.slice(0, 20) });
      },
    },
  },
});

// Enqueue directly via the email queue RPC (faster + auth-free than fetching our own server route).
async function callSend(
  admin: any,
  args: { templateName: string; recipientEmail: string; idempotencyKey: string; templateData: Record<string, any> },
) {
  const messageId = crypto.randomUUID();
  const payload = {
    message_id: messageId,
    template_name: args.templateName,
    recipient_email: args.recipientEmail.toLowerCase(),
    template_data: args.templateData,
    idempotency_key: args.idempotencyKey,
    label: args.templateName,
    to: args.recipientEmail.toLowerCase(),
    queued_at: new Date().toISOString(),
  };
  const { error } = await admin.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload,
  });
  if (error) throw error;
  // Log pending entry
  await admin.from("email_send_log").insert({
    message_id: messageId,
    template_name: args.templateName,
    recipient_email: args.recipientEmail.toLowerCase(),
    status: "pending",
  });
}
