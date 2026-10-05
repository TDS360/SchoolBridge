import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  FolderKanban,
  LayoutDashboard,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { organizationProfile } from "@/lib/schoolbridge-org";

const links = [
  { to: "/organization" as const, label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/organization/resources" as const, label: "Resources", icon: FolderKanban, exact: true },
  { to: "/organization/resources/new" as const, label: "Add Resource", icon: Plus, exact: true },
  { to: "/organization/analytics" as const, label: "Analytics", icon: BarChart3, exact: true },
];

export function OrgNav() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex items-center gap-6">
            <Link
              to="/organization"
              className="inline-flex items-center gap-2.5 font-display text-lg font-bold"
            >
              <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
                <Sparkles className="size-5" />
              </span>
              <span className="flex flex-col leading-tight">
                SchoolBridge
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Organization portal
                </span>
              </span>
            </Link>
            <nav aria-label="Organization navigation" className="hidden items-center gap-1 lg:flex">
              {links.map(({ to, label, icon: Icon, exact }) => (
                <Link
                  key={to}
                  to={to}
                  activeOptions={{ exact }}
                  activeProps={{ className: "bg-tint-green text-primary" }}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative min-h-11 min-w-11"
              aria-label="Notifications: 3 items need attention"
            >
              <Bell />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-coral" aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="min-h-11 min-w-11"
              aria-label="Organization settings"
            >
              <Settings />
            </Button>
            <div className="flex items-center gap-3 rounded-md border border-border px-3 py-1.5">
              <span className="grid size-8 place-items-center rounded-full bg-tint-green font-display text-xs font-extrabold text-primary">
                {organizationProfile.initials}
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block max-w-44 truncate text-sm font-bold">
                  {organizationProfile.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {organizationProfile.type}
                </span>
              </span>
            </div>
          </div>
        </div>
      </header>
      <nav
        aria-label="Organization sections"
        className="sticky top-18 z-30 flex gap-1 overflow-x-auto border-b border-border bg-soft px-4 py-2 lg:hidden"
      >
        {links.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact }}
            activeProps={{ className: "bg-background text-primary border-primary/40" }}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-muted-foreground"
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
