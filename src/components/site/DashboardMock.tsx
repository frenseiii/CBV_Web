/**
 * Static dashboard mockup: heatmap of watchlist clients + commissions protected counter.
 */
const ROWS = [
  { name: "Marta J.", loan: "$640k", days: 18, risk: "high", signal: "Payout request" },
  { name: "Peter Q.", loan: "$420k", days: 4, risk: "high", signal: "Mentioned other bank" },
  { name: "Sasha L.", loan: "$880k", days: 11, risk: "amber", signal: "Quiet 6 weeks" },
  { name: "David R.", loan: "$310k", days: 22, risk: "amber", signal: "Fixed expiring 90d" },
  { name: "Aisha K.", loan: "$510k", days: 30, risk: "low", signal: "Engaged · stable" },
  { name: "Tom B.", loan: "$295k", days: 45, risk: "low", signal: "Construction · 30d check" },
];

const dot = {
  high: "bg-risk-high",
  amber: "bg-risk-medium",
  low: "bg-risk-low",
} as const;

export function DashboardMock() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-foreground/5">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex-1 truncate text-center text-[11px] text-muted-foreground">
          ClawbackVault, Retention dashboard
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Commissions protected
          </div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-foreground">$48,290</div>
          <div className="mt-1 text-xs text-risk-low">+ $4,820 this week</div>
        </div>
        <div className="rounded-lg border border-border p-4">
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Active watchlist
          </div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-foreground">214</div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-risk-high" />6 red</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-risk-medium" />18 amber</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-risk-low" />190 green</span>
          </div>
        </div>
        <div className="rounded-lg border border-border p-4">
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Exposure · 90 days
          </div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-foreground">$112k</div>
          <div className="mt-1 text-xs text-muted-foreground">Across 24 settling clients</div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="grid grid-cols-12 gap-3 px-6 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          <div className="col-span-1">Risk</div>
          <div className="col-span-3">Client</div>
          <div className="col-span-2">Loan</div>
          <div className="col-span-2">Days left</div>
          <div className="col-span-4">Signal</div>
        </div>
        <div className="divide-y divide-border">
          {ROWS.map((r) => (
            <div key={r.name} className="grid grid-cols-12 items-center gap-3 px-6 py-3 text-sm">
              <div className="col-span-1">
                <span className={`inline-block h-2 w-2 rounded-full ${dot[r.risk as keyof typeof dot]}`} />
              </div>
              <div className="col-span-3 font-medium text-foreground">{r.name}</div>
              <div className="col-span-2 text-muted-foreground">{r.loan}</div>
              <div className="col-span-2 text-muted-foreground">{r.days}</div>
              <div className="col-span-4 text-muted-foreground">{r.signal}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
