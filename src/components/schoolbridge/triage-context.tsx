import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { StudentLevel } from "@/lib/schoolbridge";

type TriageState = {
  level: StudentLevel;
  setLevel: (level: StudentLevel) => void;
  needs: string[];
  setNeeds: (needs: string[]) => void;
  request: string;
  setRequest: (request: string) => void;
  location: string;
  setLocation: (location: string) => void;
  constraints: string[];
  setConstraints: (constraints: string[]) => void;
};

const TriageContext = createContext<TriageState | undefined>(undefined);

export function TriageProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState<StudentLevel>("high");
  const [needs, setNeeds] = useState<string[]>(["academic"]);
  const [request, setRequest] = useState("");
  const [location, setLocation] = useState("");
  const [constraints, setConstraints] = useState<string[]>(["Free only", "After school / evening"]);
  const value = useMemo(
    () => ({
      level,
      setLevel,
      needs,
      setNeeds,
      request,
      setRequest,
      location,
      setLocation,
      constraints,
      setConstraints,
    }),
    [level, needs, request, location, constraints],
  );
  return <TriageContext.Provider value={value}>{children}</TriageContext.Provider>;
}

export function useTriage() {
  const value = useContext(TriageContext);
  if (!value) throw new Error("useTriage must be used inside TriageProvider");
  return value;
}
