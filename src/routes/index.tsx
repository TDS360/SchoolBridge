import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LevelPicker } from "@/components/schoolbridge/level-picker";
import { useTriage } from "@/components/schoolbridge/triage-context";
import { categoriesByLevel, levelLabels, prompts } from "@/lib/schoolbridge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SchoolBridge — Find student support that fits" },
      {
        name: "description",
        content:
          "Tell SchoolBridge what is going on and find student resources that fit your needs, schedule, and location.",
      },
      { property: "og:title", content: "SchoolBridge — Help you can actually use" },
      {
        property: "og:description",
        content:
          "Personalized, practical support for middle school, high school, and community college students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const toneClass = {
  green: "bg-tint-green text-primary",
  coral: "bg-tint-coral text-coral",
  yellow: "bg-tint-yellow text-gold",
  blue: "bg-tint-blue text-blue",
};

function HomePage() {
  const navigate = useNavigate();
  const { level, setLevel, needs, setNeeds, request, setRequest } = useTriage();
  const [message, setMessage] = useState("");
  const categories = categoriesByLevel[level];
  const submitQuick = () => {
    if (!request.trim() && needs.length === 0) {
      setMessage("Choose one type of help or tell us what is going on.");
      return;
    }
    setMessage("");
    navigate({ to: "/get-started" });
  };
  return (
    <div className="overflow-hidden pb-18 md:pb-0">
      <section className="relative border-b border-border bg-hero">
        <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-20">
          <div className="relative z-10 max-w-2xl animate-rise">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1.5 text-sm font-bold text-primary">
              <Sparkles className="size-4" />
              Support that starts with you
            </div>
            <h1 className="font-display text-5xl font-extrabold leading-[1.04] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
              Find the help you can <span className="text-primary">actually use.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Tell SchoolBridge what's going on, and we'll help you find resources that fit your
              needs, location, schedule, and situation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/get-started">
                  Find my resources <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/matches">Explore resources</Link>
              </Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Check className="size-4 text-primary" />
              Free to use · No exact address needed
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-lg" aria-hidden="true">
            <div className="absolute -left-10 top-16 hidden size-24 rotate-[-10deg] rounded-md bg-accent sm:grid place-items-center">
              <BookDoodle />
            </div>
            <div className="relative ml-auto aspect-[4/4.2] w-[88%] rounded-[2rem] bg-primary p-6 shadow-hero">
              <div className="absolute inset-0 pattern-dots opacity-20" />
              <div className="relative flex h-full flex-col justify-between rounded-xl bg-background p-5 shadow-xl">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-muted-foreground">
                    <span className="size-2 rounded-full bg-primary" />
                    Finding your best fits
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-4/5 rounded-full bg-primary" />
                  </div>
                </div>
                <div className="space-y-3">
                  <MiniMatch
                    score="96%"
                    title="Free Chemistry Tutoring"
                    note="After 5 PM · Bus accessible"
                  />
                  <MiniMatch
                    score="91%"
                    title="College & Career Lab"
                    note="Free · 2.7 miles away"
                  />
                  <MiniMatch score="88%" title="STEM Study Room" note="Online · Open tonight" />
                </div>
                <div className="rounded-lg bg-tint-yellow p-4 text-sm font-semibold text-foreground">
                  Every match explains why it works for you.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative z-20 mx-auto -mt-9 max-w-6xl px-5"
        aria-labelledby="triage-title"
      >
        <div className="rounded-xl border border-border bg-background p-5 shadow-xl sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-primary">Start here</p>
              <h2 id="triage-title" className="font-display text-2xl font-extrabold">
                What do you need help with?
              </h2>
            </div>
            <LevelPicker
              compact
              value={level}
              onChange={(next) => {
                setLevel(next);
                setNeeds([]);
              }}
            />
          </div>
          <div
            className="mt-5 flex gap-2 overflow-x-auto pb-2"
            aria-label={`Support for ${levelLabels[level]}`}
          >
            {categories.slice(0, 6).map(({ id, shortLabel, icon: Icon }) => (
              <Button
                key={id}
                variant={needs.includes(id) ? "default" : "outline"}
                className="min-h-11 shrink-0"
                onClick={() =>
                  setNeeds(needs.includes(id) ? needs.filter((x) => x !== id) : [...needs, id])
                }
                aria-pressed={needs.includes(id)}
              >
                <Icon />
                {shortLabel}
              </Button>
            ))}
          </div>
          <label htmlFor="quick-help" className="sr-only">
            Tell us what is going on
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="quick-help"
                maxLength={300}
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitQuick();
                }}
                className="h-13 pl-12 text-base"
                placeholder={prompts[level]}
                aria-describedby={message ? "quick-error" : undefined}
                aria-invalid={!!message}
              />
            </div>
            <Button size="lg" className="h-13" onClick={submitQuick}>
              Find my matches <ArrowRight />
            </Button>
          </div>
          {message && (
            <p
              id="quick-error"
              role="alert"
              className="mt-2 text-sm font-semibold text-destructive"
            >
              {message}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8" id="about">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">Help for real life</p>
          <h2 className="section-title">Start with what you need today.</h2>
          <p className="section-copy">
            The choices adapt to your school experience—not the other way around.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ id, label, description, icon: Icon, tone }) => (
            <Link
              key={id}
              to="/get-started"
              onClick={() => setNeeds([id])}
              className="group rounded-lg border border-border bg-background p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className={cn("grid size-11 place-items-center rounded-md", toneClass[tone])}>
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-extrabold">{label}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
                Find support{" "}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-foreground py-24 text-background">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-accent">Less searching. More doing.</p>
              <h2 className="font-display text-4xl font-extrabold sm:text-5xl">
                One clear path—not ten open tabs.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <PathCard
                bad
                title="The old way"
                steps={[
                  "Search everywhere",
                  "Decode eligibility",
                  "Discover it won't work",
                  "Start over",
                ]}
              />
              <PathCard
                title="With SchoolBridge"
                steps={[
                  "Tell us what's happening",
                  "See your best fits",
                  "Understand why",
                  "Follow your plan",
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="text-center">
          <p className="eyebrow">How it works</p>
          <h2 className="section-title">From “I need help” to a next step.</h2>
        </div>
        <ol className="mt-14 grid gap-8 md:grid-cols-4">
          {[
            "Tell us what's happening",
            "We identify your needs",
            "See resources that fit",
            "Follow your personal plan",
          ].map((step, i) => (
            <li key={step} className="relative">
              <span className="font-display text-6xl font-extrabold text-primary/15">0{i + 1}</span>
              <h3 className="mt-[-14px] font-display text-lg font-bold">{step}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {
                  [
                    "Use quick choices or your own words.",
                    "Review what matters before we search.",
                    "Compare access, timing, cost, and eligibility.",
                    "Know what to do, bring, and expect.",
                  ][i]
                }
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function MiniMatch({ score, title, note }: { score: string; title: string; note: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display font-bold">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{note}</p>
        </div>
        <span className="rounded-full bg-tint-green px-2 py-1 text-xs font-extrabold text-primary">
          {score}
        </span>
      </div>
    </div>
  );
}
function PathCard({
  title,
  steps,
  bad = false,
}: {
  title: string;
  steps: string[];
  bad?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5",
        bad
          ? "border-background/15 bg-background/5"
          : "border-primary bg-primary text-primary-foreground",
      )}
    >
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <ul className="mt-5 space-y-4">
        {steps.map((step) => (
          <li key={step} className="flex gap-3 text-sm font-semibold">
            {bad ? (
              <X className="size-5 shrink-0 text-coral" />
            ) : (
              <Check className="size-5 shrink-0" />
            )}
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
function BookDoodle() {
  return (
    <div className="text-center">
      <MapPin className="mx-auto size-8 text-foreground" />
      <span className="text-xs font-black text-foreground">NEARBY</span>
    </div>
  );
}
