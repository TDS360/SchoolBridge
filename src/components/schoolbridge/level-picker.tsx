import { levelLabels, type StudentLevel } from "@/lib/schoolbridge";
import { cn } from "@/lib/utils";

export function LevelPicker({ value, onChange, compact = false }: { value: StudentLevel; onChange: (level: StudentLevel) => void; compact?: boolean }) {
  return <div className={cn("grid grid-cols-3 gap-1 rounded-lg bg-muted p-1", compact ? "w-full sm:w-auto" : "w-full")} role="radiogroup" aria-label="Student level">
    {(Object.keys(levelLabels) as StudentLevel[]).map((level) => <button key={level} type="button" role="radio" aria-checked={value === level} onClick={() => onChange(level)} className={cn("rounded-md px-3 py-2 text-xs font-bold transition-all sm:text-sm", value === level ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>{levelLabels[level]}</button>)}
  </div>;
}