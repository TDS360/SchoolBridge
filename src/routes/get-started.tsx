import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Info, LockKeyhole, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LevelPicker } from "@/components/schoolbridge/level-picker";
import { useTriage } from "@/components/schoolbridge/triage-context";
import { categoriesByLevel, constraintsFor, levelLabels, prompts } from "@/lib/schoolbridge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/get-started")({ head: () => ({ meta: [
  { title: "Find Help — SchoolBridge" }, { name: "description", content: "Tell us what support you need and what must fit your life." },
  { property: "og:title", content: "Find Help — SchoolBridge" }, { property: "og:description", content: "A simple, private way to find student support that fits." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: GetStartedPage });

function GetStartedPage() {
  const navigate = useNavigate();
  const triage = useTriage();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const categories = categoriesByLevel[triage.level];
  const availableConstraints = useMemo(() => constraintsFor(triage.needs), [triage.needs]);
  const next = () => {
    const invalid = (step === 2 && !/^\d{5}$/.test(triage.location.trim())) || (step === 3 && triage.needs.length === 0) || (step === 5 && triage.request.trim().length < 10);
    if (invalid) { setError(step === 2 ? "Enter a 5-digit ZIP code. We never need your exact address." : step === 3 ? "Choose at least one type of support." : "Tell us a little more so we can find a useful match."); return; }
    setError(""); if (step === 5) navigate({ to: "/matches" }); else setStep(step + 1);
  };
  const titles = ["Which student experience fits you?", "What area should we search?", "What could help right now?", "What needs to fit your life?", "Tell us what's going on."];
  return <div className="min-h-[calc(100dvh-4.5rem)] bg-soft pb-24">
    <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-14">
      <div className="mb-8 flex items-center justify-between"><Button variant="ghost" onClick={() => step > 1 ? setStep(step - 1) : navigate({ to: "/" })}><ArrowLeft />Back</Button><p className="text-sm font-bold text-muted-foreground">Step {step} of 5</p></div>
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <section className="rounded-xl border border-border bg-background p-6 shadow-sm sm:p-9" aria-labelledby="step-title">
          <div className="mb-8"><div className="mb-4 h-2 overflow-hidden rounded-full bg-muted" aria-label={`${step} of 5 steps complete`} role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={5}><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${step * 20}%` }} /></div><p className="eyebrow">A better match starts here</p><h1 id="step-title" className="font-display text-3xl font-extrabold sm:text-4xl">{titles[step - 1]}</h1></div>
          {step === 1 && <div><LevelPicker value={triage.level} onChange={(level) => { triage.setLevel(level); triage.setNeeds([]); }} /><p className="mt-5 text-sm leading-6 text-muted-foreground">We'll adjust support, wording, eligibility, and safety guidance for {levelLabels[triage.level].toLowerCase()} students.</p></div>}
          {step === 2 && <div><label htmlFor="zip" className="mb-2 block text-sm font-bold">ZIP code</label><Input id="zip" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={triage.location} onChange={(e) => triage.setLocation(e.target.value.replace(/\D/g, ""))} aria-describedby="zip-note validation-message" aria-invalid={!!error} className="h-12 max-w-sm text-base" placeholder="e.g. 22101" /><p id="zip-note" className="mt-3 flex gap-2 text-sm text-muted-foreground"><LockKeyhole className="mt-0.5 size-4 shrink-0" />A general area is enough. Do not enter your street address.</p></div>}
          {step === 3 && <div className="grid gap-3 sm:grid-cols-2">{categories.map(({ id, label, description, icon: Icon }) => { const selected = triage.needs.includes(id); return <Button key={id} variant="outline" aria-pressed={selected} onClick={() => triage.setNeeds(selected ? triage.needs.filter((x) => x !== id) : [...triage.needs, id])} className={cn("h-auto min-h-24 justify-start whitespace-normal p-4 text-left", selected && "border-primary bg-tint-green ring-2 ring-primary/20")}><span className="grid size-10 shrink-0 place-items-center rounded-md bg-muted"><Icon /></span><span><span className="block font-display text-base font-bold">{label}</span><span className="mt-1 block text-xs font-normal leading-5 text-muted-foreground">{description}</span></span>{selected && <Check className="ml-auto text-primary" />}</Button>})}</div>}
          {step === 4 && <fieldset><legend className="sr-only">Choose anything your matches need to include</legend><div className="grid gap-3 sm:grid-cols-2">{availableConstraints.map((item) => { const selected = triage.constraints.includes(item); return <Button key={item} variant="outline" aria-pressed={selected} onClick={() => triage.setConstraints(selected ? triage.constraints.filter((x) => x !== item) : [...triage.constraints, item])} className={cn("h-14 justify-between", selected && "border-primary bg-tint-green")}><span>{item}</span>{selected && <Check className="text-primary" />}</Button>})}</div></fieldset>}
          {step === 5 && <div><label htmlFor="situation" className="mb-2 block text-sm font-bold">What's going on?</label><Textarea id="situation" maxLength={500} value={triage.request} onChange={(e) => triage.setRequest(e.target.value)} className="min-h-40 resize-none text-base" placeholder={prompts[triage.level]} aria-describedby="situation-note validation-message" aria-invalid={!!error} /><div className="mt-2 flex justify-between gap-4 text-xs text-muted-foreground"><p id="situation-note">Share only what feels relevant. Don't include names or an exact address.</p><span>{triage.request.length}/500</span></div></div>}
          <div id="validation-message" aria-live="polite">{error && <p role="alert" className="mt-5 rounded-md bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</p>}</div>
          <div className="mt-8 flex justify-end"><Button size="lg" onClick={next}>{step === 5 ? "Find my resources" : "Continue"}<ArrowRight /></Button></div>
        </section>
        <aside className="space-y-4"><div className="rounded-lg bg-foreground p-6 text-background"><ShieldCheck className="size-7 text-accent" /><h2 className="mt-4 font-display text-xl font-bold">Your privacy matters</h2><p className="mt-2 text-sm leading-6 text-background/75">We use these answers only to tailor this search. This demo does not save or share them.</p></div>{triage.level === "middle" && <div className="rounded-lg border border-coral/30 bg-tint-coral p-5"><h2 className="font-display font-bold">A note for younger students</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Ask a parent, guardian, counselor, or trusted adult before contacting a new organization or traveling somewhere unfamiliar.</p></div>}<div className="rounded-lg border border-border bg-background p-5"><div className="flex gap-3"><Info className="size-5 shrink-0 text-primary" /><p className="text-sm leading-6 text-muted-foreground">You will review what we understood before taking any next step.</p></div></div></aside>
      </div>
    </div>
  </div>;
}