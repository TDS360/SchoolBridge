import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  seedResources,
  statusFromSpots,
  type OrgResource,
  type ResourceStatus,
} from "@/lib/schoolbridge-org";

type OrgState = {
  resources: OrgResource[];
  addResource: (resource: OrgResource) => void;
  updateResource: (id: string, patch: Partial<OrgResource>) => void;
  setSpots: (id: string, spotsOpen: number) => void;
  setStatus: (id: string, status: ResourceStatus) => void;
  togglePause: (id: string) => void;
  confirmInformation: (id: string) => void;
  prefillNeed: string | null;
  setPrefillNeed: (need: string | null) => void;
};

const STORAGE_KEY = "schoolbridge-org-resources-v1";

const OrgContext = createContext<OrgState | undefined>(undefined);

export function OrgProvider({ children }: { children: ReactNode }) {
  const [resources, setResources] = useState<OrgResource[]>(() => seedResources);
  const [prefillNeed, setPrefillNeed] = useState<string | null>(null);
  const loaded = useRef(false);

  // Load saved programs after hydration, then save every change on this device.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as OrgResource[];
        if (Array.isArray(parsed)) setResources(parsed);
      }
    } catch {
      /* ignore corrupt storage */
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
    } catch {
      /* storage full or blocked */
    }
  }, [resources]);

  const updateResource = useCallback((id: string, patch: Partial<OrgResource>) => {
    setResources((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const value = useMemo<OrgState>(
    () => ({
      resources,
      prefillNeed,
      setPrefillNeed,
      addResource: (resource) => setResources((list) => [resource, ...list]),
      updateResource,
      setSpots: (id, spotsOpen) =>
        setResources((list) =>
          list.map((item) => {
            if (item.id !== id) return item;
            const clamped = Math.max(0, Math.min(item.capacity, spotsOpen));
            const status =
              item.status === "closed" ? "closed" : statusFromSpots(clamped, item.capacity);
            return { ...item, spotsOpen: clamped, status, lastUpdatedDays: 0 };
          }),
        ),
      setStatus: (id, status) =>
        setResources((list) =>
          list.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status,
                  spotsOpen: status === "full" ? 0 : item.spotsOpen,
                  lastUpdatedDays: 0,
                }
              : item,
          ),
        ),
      togglePause: (id) =>
        setResources((list) =>
          list.map((item) => (item.id === id ? { ...item, paused: !item.paused } : item)),
        ),
      confirmInformation: (id) =>
        setResources((list) =>
          list.map((item) =>
            item.id === id ? { ...item, verification: "verified", lastUpdatedDays: 0 } : item,
          ),
        ),
    }),
    [resources, prefillNeed, updateResource],
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg() {
  const value = useContext(OrgContext);
  if (!value) throw new Error("useOrg must be used inside OrgProvider");
  return value;
}
