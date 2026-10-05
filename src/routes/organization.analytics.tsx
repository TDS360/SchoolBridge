import { createFileRoute } from "@tanstack/react-router";
import { Download, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrg } from "@/components/schoolbridge/org-context";
import { downloadCsv, toCsv } from "@/lib/csv";
import {
  gapOpportunities,
  geographicDemand,
  impact,
  monthlyTrends,
  topStudentNeeds,
} from "@/lib/schoolbridge-org";

export const Route = createFileRoute("/organization/analytics")({
  head: () => ({
    meta: [
      { title: "Demand Analytics — SchoolBridge Organization Portal" },
      {
        name: "description",
        content: "Aggregated, privacy-safe insight into what students need and where gaps remain.",
      },
      { property: "og:title", content: "Demand Analytics — SchoolBridge" },
      {
        property: "og:description",
        content: "Review student demand trends and export privacy-safe CSV reports.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
});

// Groups smaller than this are suppressed in exports so no individual can be inferred.
const MIN_GROUP = 5;
const safe = (n: number) => (n < MIN_GROUP ? `<${MIN_GROUP}` : n);
const stamp = () => new Date().toISOString().slice(0, 10);

function AnalyticsPage() {
  const { resources } = useOrg();
  const maxNeed = Math.max(...topStudentNeeds.map((n) => n.count));
  const maxTrend = Math.max(...monthlyTrends.map((m) => m.requests));

  const exports = [
    {
      label: "Monthly trends",
      file: "monthly-trends",
      build: () =>
        toCsv(
          ["Month", "Requests", "Matches", "Connections"],
          monthlyTrends.map((m) => [
            m.month,
            safe(m.requests),
            safe(m.matches),
            safe(m.connections),
          ]),
        ),
    },
    {
      label: "Top student needs",
      file: "student-needs",
      build: () =>
        toCsv(
          ["Need", "Requests"],
          topStudentNeeds.map((n) => [n.need, safe(n.count)]),
        ),
    },
    {
      label: "Unmet demand",
      file: "unmet-demand",
      build: () =>
        toCsv(
          ["Need", "Requests", "Pattern"],
          gapOpportunities.map((g) => [g.need, safe(g.requests), g.note]),
        ),
    },
    {
      label: "Demand by area",
      file: "demand-by-area",
      build: () =>
        toCsv(
          ["Area", "Share of requests (%)"],
          geographicDemand.map((g) => [g.area, g.share]),
        ),
    },
    {
      label: "Program performance",
      file: "program-performance",
      build: () =>
        toCsv(
          ["Program", "Category", "Views", "Matches", "Connections", "Unresolved"],
          resources.map((r) => [
            r.name,
            r.category,
            safe(r.views),
            safe(r.matches),
            safe(r.connections),
            safe(r.unresolved),
          ]),
        ),
    },
  ];

  const exportAll = () => {
    const parts = exports.map((e) => `# ${e.label}\n${e.build()}`);
    downloadCsv(`schoolbridge-analytics-${stamp()}.csv`, parts.join("\n\n"));
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 pb-20 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Student demand</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Aggregated trends across students searching in your area.
          </p>
        </div>
        <Button onClick={exportAll}>
          <Download /> Export all as CSV
        </Button>
      </header>

      <section
        aria-labelledby="privacy"
        className="mt-6 flex gap-3 rounded-lg border border-border bg-tint-green p-4 text-sm"
      >
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <p id="privacy">
          <strong>Privacy-safe by design.</strong> Exports contain only totals — no names, contact
          details, exact addresses, or individual searches. Counts under {MIN_GROUP} are shown as
          “&lt;{MIN_GROUP}” and areas are reported at ZIP level only.
        </p>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ["Students reached", impact.reached],
          ["Successful connections", impact.connections],
          ["Still unresolved", impact.unresolved],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 font-display text-3xl font-extrabold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          title="Monthly trends"
          onExport={() => downloadCsv(`monthly-trends-${stamp()}.csv`, exports[0]!.build())}
        >
          <ul className="space-y-3">
            {monthlyTrends.map((m) => (
              <li key={m.month}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{m.month}</span>
                  <span className="text-muted-foreground">
                    {m.requests} requests · {m.connections} connected
                  </span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted" aria-hidden>
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(m.requests / maxTrend) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel
          title="Top student needs"
          onExport={() => downloadCsv(`student-needs-${stamp()}.csv`, exports[1]!.build())}
        >
          <ul className="space-y-3">
            {topStudentNeeds.map((n) => (
              <li key={n.need}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{n.need}</span>
                  <span className="text-muted-foreground">{n.count}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted" aria-hidden>
                  <div
                    className="h-2 rounded-full bg-gold"
                    style={{ width: `${(n.count / maxNeed) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel
          title="Unmet demand"
          onExport={() => downloadCsv(`unmet-demand-${stamp()}.csv`, exports[2]!.build())}
        >
          <ul className="divide-y divide-border">
            {gapOpportunities.map((g) => (
              <li key={g.need} className="py-3">
                <p className="font-semibold">
                  {g.need}{" "}
                  <span className="font-normal text-muted-foreground">— {g.requests} requests</span>
                </p>
                <p className="text-sm text-muted-foreground">{g.note}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel
          title="Demand by area"
          onExport={() => downloadCsv(`demand-by-area-${stamp()}.csv`, exports[3]!.build())}
        >
          <ul className="space-y-3">
            {geographicDemand.map((g) => (
              <li key={g.area} className="flex justify-between text-sm">
                <span>{g.area}</span>
                <span className="font-semibold">{g.share}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          variant="outline"
          onClick={() => downloadCsv(`program-performance-${stamp()}.csv`, exports[4]!.build())}
        >
          <Download /> Export program performance
        </Button>
      </div>
    </div>
  );
}

function Panel({
  title,
  onExport,
  children,
}: {
  title: string;
  onExport: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5" aria-label={title}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold">{title}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          aria-label={`Download ${title} as CSV`}
        >
          <Download /> CSV
        </Button>
      </div>
      {children}
    </section>
  );
}
