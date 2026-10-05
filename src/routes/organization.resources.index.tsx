import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Pause, Play, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrg } from "@/components/schoolbridge/org-context";
import { costLabel, scheduleLine, statusMeta, verificationMeta } from "@/lib/schoolbridge-org";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organization/resources/")({
  head: () => ({
    meta: [
      { title: "Manage Resources — SchoolBridge Organization Portal" },
      {
        name: "description",
        content: "Update capacity, availability, and verification for your student resources.",
      },
      { property: "og:title", content: "Manage Resources — SchoolBridge" },
      { property: "og:description", content: "Keep every student resource accurate and current." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const { resources, setSpots, togglePause, confirmInformation } = useOrg();
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 pb-20 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Resources</p>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Your programs</h1>
          <p className="mt-2 text-muted-foreground">
            Update open spots and confirm details so students see accurate information.
          </p>
        </div>
        <Button asChild>
          <Link to="/organization/resources/new">
            <Plus /> Add resource
          </Link>
        </Button>
      </header>
      <ul className="mt-6 grid gap-4 lg:grid-cols-2">
        {resources.map((r) => {
          const s = statusMeta[r.status];
          const v = verificationMeta[r.verification];
          return (
            <li
              key={r.id}
              className={cn(
                "rounded-lg border border-border bg-card p-5",
                r.paused && "opacity-70",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {r.category}
                  </p>
                  <h2 className="font-display text-lg font-bold">{r.name}</h2>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
                      s.chip,
                    )}
                  >
                    <span className={cn("size-2 rounded-full", s.dot)} aria-hidden />
                    {s.label}
                  </span>
                  <span className={cn("rounded-full px-2.5 py-1", v.chip)}>{v.label}</span>
                  {r.paused && <span className="rounded-full bg-muted px-2.5 py-1">Paused</span>}
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.shortDescription}</p>
              <p className="mt-2 text-sm">
                {scheduleLine(r)} · {costLabel(r)} · {r.grades || "All students"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Updated {r.lastUpdatedDays === 0 ? "today" : `${r.lastUpdatedDays} days ago`}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <div
                  className="flex items-center gap-2"
                  role="group"
                  aria-label={`Open spots for ${r.name}`}
                >
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label="One fewer spot"
                    onClick={() => setSpots(r.id, r.spotsOpen - 1)}
                  >
                    <Minus />
                  </Button>
                  <span className="min-w-20 text-center text-sm font-semibold" aria-live="polite">
                    {r.spotsOpen} / {r.capacity} open
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label="One more spot"
                    onClick={() => setSpots(r.id, r.spotsOpen + 1)}
                  >
                    <Plus />
                  </Button>
                </div>
                <Button size="sm" variant="outline" onClick={() => togglePause(r.id)}>
                  {r.paused ? (
                    <>
                      <Play /> Resume
                    </>
                  ) : (
                    <>
                      <Pause /> Pause
                    </>
                  )}
                </Button>
                {r.verification !== "verified" && (
                  <Button size="sm" onClick={() => confirmInformation(r.id)}>
                    <ShieldCheck /> Confirm details
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
