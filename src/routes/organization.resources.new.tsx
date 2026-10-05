import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOrg } from "@/components/schoolbridge/org-context";
import {
  blankResource,
  needTagOptions,
  resourceCategories,
  weekdays,
  type OrgResource,
} from "@/lib/schoolbridge-org";
import {
  suggestResourceDetails,
  writeStudentDescription,
  type ResourceSuggestion,
} from "@/lib/resource-suggest.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organization/resources/new")({
  head: () => ({
    meta: [
      { title: "Add a Resource — SchoolBridge Organization Portal" },
      {
        name: "description",
        content: "List a new student program with AI-suggested categories, eligibility, and tags.",
      },
      { property: "og:title", content: "Add a Resource — SchoolBridge" },
      {
        property: "og:description",
        content: "Describe your program and get suggested listing details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewResourcePage,
});

function NewResourcePage() {
  const { addResource } = useOrg();
  const navigate = useNavigate();
  const suggest = useServerFn(suggestResourceDetails);
  const describe = useServerFn(writeStudentDescription);
  const [writing, setWriting] = useState(false);
  const [writeError, setWriteError] = useState<string | null>(null);
  const [form, setForm] = useState<OrgResource>(blankResource);
  const [studentTags, setStudentTags] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<ResourceSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<"name" | "shortDescription" | "days", string>>
  >({});

  const set = <K extends keyof OrgResource>(key: K, value: OrgResource[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const toggle = (key: "needTags" | "days", value: string) =>
    set(
      key,
      form[key].includes(value) ? form[key].filter((v) => v !== value) : [...form[key], value],
    );

  const runSuggest = async () => {
    if (form.fullDescription.trim().length < 20) {
      setAiError("Write at least a couple of sentences about the program first.");
      return;
    }
    setLoading(true);
    setAiError(null);
    try {
      const res = await suggest({ data: { description: form.fullDescription } });
      if (res.ok) setSuggestion(res.suggestion);
      else setAiError(res.error);
    } catch {
      setAiError("We couldn't reach the suggestion service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const runDescribe = async () => {
    if (form.fullDescription.trim().length < 20) {
      setWriteError('Add a couple of sentences in "Describe the program" first.');
      return;
    }
    setWriting(true);
    setWriteError(null);
    try {
      const res = await describe({
        data: {
          name: form.name,
          category: form.category,
          grades: form.grades,
          details: form.fullDescription,
          schedule: [
            form.days.join(", "),
            form.startTime && form.endTime ? `${form.startTime}–${form.endTime}` : "",
          ]
            .filter(Boolean)
            .join(", "),
          cost: [form.costType, form.costDetail].filter(Boolean).join(" — "),
          mode: form.mode,
        },
      });
      if (res.ok) set("studentDescription", res.description);
      else setWriteError(res.error);
    } catch {
      setWriteError("We couldn't reach the writing service. Please try again.");
    } finally {
      setWriting(false);
    }
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    setForm((f) => ({
      ...f,
      category: suggestion.category,
      grades: suggestion.grades,
      studentStatus: suggestion.studentStatus,
      incomeRequirement: suggestion.incomeRequirement,
      needTags: Array.from(new Set([...f.needTags, ...suggestion.needTags])),
      shortDescription: f.shortDescription || suggestion.shortDescription,
    }));
    setStudentTags(suggestion.studentTags);
    setSuggestion(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<"name" | "shortDescription" | "days", string>> = {};
    if (!form.name.trim()) next.name = "Add a program name.";
    if (!form.shortDescription.trim())
      next.shortDescription = "Add a one-sentence summary for students.";
    if (!form.days.length) next.days = "Choose at least one day.";
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(Object.keys(next)[0] ?? "")?.focus();
      return;
    }
    addResource({
      ...form,
      id: `res-${Date.now()}`,
      needTags: Array.from(new Set([...form.needTags, ...studentTags])),
    });
    navigate({ to: "/organization/resources" });
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 pb-20 lg:px-8">
      <p className="eyebrow">New resource</p>
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Add a program</h1>
      <p className="mt-2 text-muted-foreground">
        Describe what you offer, and we'll suggest how students should find it. You review
        everything before saving.
      </p>

      <form onSubmit={submit} noValidate className="mt-8 space-y-6">
        <Field id="name" label="Program name" error={errors.name}>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </Field>

        <section className="rounded-lg border border-border bg-card p-5">
          <Field
            id="fullDescription"
            label="Describe the program"
            hint="Who it's for, what students get, when and where."
          >
            <Textarea
              id="fullDescription"
              rows={5}
              value={form.fullDescription}
              onChange={(e) => set("fullDescription", e.target.value)}
              aria-describedby="fullDescription-hint"
            />
          </Field>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button type="button" variant="secondary" onClick={runSuggest} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}{" "}
              {loading ? "Thinking…" : "Suggest details with AI"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Don't include student names or personal information.
            </p>
          </div>
          <div aria-live="polite">
            {aiError && (
              <p role="alert" className="mt-3 text-sm font-semibold text-destructive">
                {aiError}
              </p>
            )}
            {suggestion && (
              <div className="mt-4 rounded-md border border-primary/30 bg-tint-green p-4 text-sm">
                <p className="flex items-center gap-2 font-bold">
                  <Sparkles className="size-4 text-primary" /> Suggested details
                </p>
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  <Item k="Category" v={suggestion.category} />
                  <Item k="Grades" v={suggestion.grades} />
                  <Item k="Student status" v={suggestion.studentStatus} />
                  <Item k="Income requirement" v={suggestion.incomeRequirement} />
                  <Item k="Need tags" v={suggestion.needTags.join(", ") || "—"} />
                  <Item k="Student-facing tags" v={suggestion.studentTags.join(", ")} />
                </dl>
                <p className="mt-2">
                  <span className="font-semibold">Summary:</span> {suggestion.shortDescription}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button type="button" size="sm" onClick={applySuggestion}>
                    Apply suggestions
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setSuggestion(null)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        <Field
          id="shortDescription"
          label="One-sentence summary for students"
          error={errors.shortDescription}
        >
          <Input
            id="shortDescription"
            value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
            aria-invalid={!!errors.shortDescription}
          />
        </Field>

        <section className="rounded-lg border border-border bg-card p-5">
          <Field
            id="studentDescription"
            label="Description students will see"
            hint="Written to the student at their reading level. Edit it before publishing."
          >
            <Textarea
              id="studentDescription"
              rows={5}
              value={form.studentDescription ?? ""}
              onChange={(e) => set("studentDescription", e.target.value)}
              aria-describedby="studentDescription-hint"
            />
          </Field>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button type="button" variant="secondary" onClick={runDescribe} disabled={writing}>
              {writing ? <Loader2 className="animate-spin" /> : <Wand2 />}{" "}
              {writing
                ? "Writing…"
                : form.studentDescription
                  ? "Rewrite with AI"
                  : "Write for students with AI"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Uses the program details and grade level above.
            </p>
          </div>
          <div aria-live="polite">
            {writeError && (
              <p role="alert" className="mt-3 text-sm font-semibold text-destructive">
                {writeError}
              </p>
            )}
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="category" label="Category">
            <select
              id="category"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {resourceCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field id="grades" label="Grades or student level">
            <Input
              id="grades"
              value={form.grades}
              onChange={(e) => set("grades", e.target.value)}
            />
          </Field>
          <Field id="studentStatus" label="Enrollment requirement">
            <Input
              id="studentStatus"
              value={form.studentStatus}
              onChange={(e) => set("studentStatus", e.target.value)}
            />
          </Field>
          <Field id="incomeRequirement" label="Income requirement">
            <Input
              id="incomeRequirement"
              value={form.incomeRequirement}
              onChange={(e) => set("incomeRequirement", e.target.value)}
            />
          </Field>
          <Field id="capacity" label="Total spots">
            <Input
              id="capacity"
              type="number"
              min={0}
              value={form.capacity}
              onChange={(e) => {
                const n = Number(e.target.value) || 0;
                setForm((f) => ({ ...f, capacity: n, spotsOpen: n }));
              }}
            />
          </Field>
          <Field id="zip" label="ZIP code">
            <Input
              id="zip"
              inputMode="numeric"
              maxLength={5}
              value={form.zip}
              onChange={(e) => set("zip", e.target.value)}
            />
          </Field>
        </div>

        <fieldset aria-describedby={errors.days ? "days-error" : undefined}>
          <legend className="text-sm font-semibold">Days offered</legend>
          <div id="days" tabIndex={-1} className="mt-2 flex flex-wrap gap-2">
            {weekdays.map((d) => (
              <Chip key={d} on={form.days.includes(d)} onClick={() => toggle("days", d)}>
                {d}
              </Chip>
            ))}
          </div>
          {errors.days && (
            <p id="days-error" className="mt-1 text-sm text-destructive">
              {errors.days}
            </p>
          )}
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold">Needs this program covers</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {needTagOptions.map((t) => (
              <Chip key={t} on={form.needTags.includes(t)} onClick={() => toggle("needTags", t)}>
                {t}
              </Chip>
            ))}
          </div>
        </fieldset>

        {studentTags.length > 0 && (
          <div>
            <p className="text-sm font-semibold">Student-facing tags</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {studentTags.map((t) => (
                <Chip
                  key={t}
                  on
                  onClick={() => setStudentTags((s) => s.filter((x) => x !== t))}
                  label={`Remove tag ${t}`}
                >
                  {t} ×
                </Chip>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-border pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate({ to: "/organization/resources" })}
          >
            Cancel
          </Button>
          <Button type="submit">Publish resource</Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
  label,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "min-h-9 rounded-full border px-3 text-sm font-semibold transition-colors",
        on
          ? "border-primary bg-tint-green text-primary"
          : "border-border bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  );
}
