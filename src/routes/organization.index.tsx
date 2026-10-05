import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrg } from "@/components/schoolbridge/org-context";
import {
  needsSnapshot,
  organizationProfile,
  recentConnections,
  scheduleLine,
  statusMeta,
} from "@/lib/schoolbridge-org";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organization/")({
  head: () => ({
    meta: [
      { title: "Organization Dashboard — SchoolBridge" },
      {
        name: "description",
        content:
          "See how your programs are performing and what students need from your organization.",
      },
      { property: "og:title", content: "Organization Dashboard — SchoolBridge" },
      {
        property: "og:description",
        content: "Track program capacity, student matches, and unmet demand in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { resources } = useOrg();
  const active = resources.filter((r) => !r.paused);
  const matches = resources.reduce((sum, r) => sum + r.matches, 0);
  const connections = resources.reduce((sum, r) => sum + r.connections, 0);
  const openSpots = active.reduce((sum, r) => sum + (r.status === "closed" ? 0 : r.spotsOpen), 0);
  const attention = resources.filter(
    (r) => r.verification !== "verified" || r.status === "full" || r.spotsOpen <= 1,
  );

  const stats = [
    {
      label: "Active programs",
      value: active.length,
      icon: Sparkles,
      to: "/organization/resources" as const,
      hint: "Published and open to students",
    },
    {
      label: "Student matches",
      value: matches,
      icon: Users,
      to: "/organization/analytics" as const,
      hint: "All time across your resources",
    },
    {
      label: "Successful connections",
      value: connections,
      icon: CheckCircle2,
      to: "/organization/analytics" as const,
      hint: "Students who reported getting help",
    },
    {
      label: "Open spots",
      value: openSpots,
      icon: CalendarClock,
      to: "/organization/resources" as const,
      hint: "Seats and items available right now",
    },
    {
      label: "Needs attention",
      value: attention.length,
      icon: AlertTriangle,
      to: "/organization/resources" as const,
      hint: "Review these before students arrive",
    },
  ];

  const maxNeed = Math.max(...needsSnapshot.map((n) => n.count));

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 pb-20 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">{organizationProfile.county}</p>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
            {organizationProfile.name}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            How your resources are performing, and what students are still asking for.
          </p>
        </div>
        <Button asChild>
          <Link to="/organization/resources/new">
            <Plus /> Add resource
          </Link>
        </Button>
      </header>

      <section
        aria-label="Overview statistics"
        className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
      >
        {stats.map(({ label, value, icon: Icon, to, hint }) => (
          <Link
            key={label}
            to={to}
            className="group rounded-lg border border-border bg-background p-5 transition-shadow hover:shadow-md"
          >
            <span className="flex items-center justify-between text-muted-foreground">
              <Icon className="size-5 text-primary" />
              <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
            <span className="mt-3 block font-display text-4xl font-extrabold">{value}</span>
            <span className="mt-1 block text-sm font-bold">{label}</span>
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">{hint}</span>
          </Link>
        ))}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section
          aria-labelledby="programs-heading"
          className="rounded-lg border border-border bg-background p-5 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <h2 id="programs-heading" className="font-display text-xl font-bold">
              Program overview
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/organization/resources">
                Manage resources <ArrowRight />
              </Link>
            </Button>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {resources.slice(0, 5).map((resource) => {
              const meta = statusMeta[resource.status];
              return (
                <li
                  key={resource.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div className="min-w-0">
                    <p className="font-display text-base font-bold">{resource.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      <Clock3 className="mr-1 inline size-4" />
                      {scheduleLine(resource)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", meta.chip)}>
                      <span
                        className={cn(
                          "mr-1.5 inline-block size-2 rounded-full align-middle",
                          meta.dot,
                        )}
                        aria-hidden
                      />
                      {meta.label}
                    </span>
                    <span className="text-sm font-bold">
                      {resource.spotsOpen} / {resource.capacity} spots
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section
          aria-labelledby="needs-heading"
          className="rounded-lg border border-border bg-background p-5 sm:p-6"
        >
          <h2 id="needs-heading" className="font-display text-xl font-bold">
            Needs snapshot
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            What students asked your organization for this month.
          </p>
          <ul className="mt-5 space-y-4">
            {needsSnapshot.map(({ need, count }) => (
              <li key={need}>
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>{need}</span>
                  <span>{count}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(count / maxNeed) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-6 w-full">
            <Link to="/organization/analytics">
              <TrendingUp /> See full analytics
            </Link>
          </Button>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section
          aria-labelledby="activity-heading"
          className="rounded-lg border border-border bg-background p-5 sm:p-6"
        >
          <h2 id="activity-heading" className="font-display text-xl font-bold">
            Recent student connections
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            <ShieldCheck className="mr-1 inline size-4 text-primary" />
            Shown without names or personal details, so student privacy is protected.
          </p>
          <ul className="mt-4 space-y-3">
            {recentConnections.map((item) => (
              <li key={item.id} className="rounded-lg bg-soft p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold">New match · {item.resource}</p>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Matched {item.ago}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Matched with a student looking for:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.needs.map((need) => (
                    <span
                      key={need}
                      className="rounded-full bg-background px-2.5 py-1 text-xs font-semibold"
                    >
                      {need}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="alerts-heading"
          className="rounded-lg border border-border bg-background p-5 sm:p-6"
        >
          <h2 id="alerts-heading" className="font-display text-xl font-bold">
            Needs your attention
          </h2>
          <ul className="mt-4 space-y-3">
            <AlertItem
              tone="yellow"
              title="Resource needs an update"
              body="Homework Center has not been confirmed in 41 days. Students may see stale hours."
              action="Review resource"
            />
            <AlertItem
              tone="coral"
              title="Capacity nearly full"
              body="Mentor Circle has 5 spots left and SAT Preparation is full."
              action="Update availability"
            />
            <AlertItem
              tone="blue"
              title="Unresolved demand"
              body="18 students are looking for a service your organization does not offer yet."
              action="See the gaps"
              to="/organization/analytics"
            />
          </ul>
        </section>
      </div>
    </div>
  );
}

function AlertItem({
  tone,
  title,
  body,
  action,
  to = "/organization/resources",
}: {
  tone: "yellow" | "coral" | "blue";
  title: string;
  body: string;
  action: string;
  to?: "/organization/resources" | "/organization/analytics";
}) {
  const bg =
    tone === "yellow" ? "bg-tint-yellow" : tone === "coral" ? "bg-tint-coral" : "bg-tint-blue";
  return (
    <li className={cn("rounded-lg p-4", bg)}>
      <p className="font-display font-bold">
        <AlertTriangle className="mr-1.5 inline size-4" />
        {title}
      </p>
      <p className="mt-1 text-sm leading-6 text-foreground/80">{body}</p>
      <Button asChild variant="ghost" size="sm" className="mt-2 px-0 hover:bg-transparent">
        <Link to={to}>
          {action} <ArrowRight />
        </Link>
      </Button>
    </li>
  );
}
