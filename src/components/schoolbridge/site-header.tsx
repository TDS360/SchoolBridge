import { Link } from "@tanstack/react-router";
import { Bookmark, Compass, Home, Menu, Route as RouteIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Brand() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2.5 font-display text-xl font-bold text-foreground"
    >
      <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
        <Sparkles className="size-5" />
      </span>
      SchoolBridge
    </Link>
  );
}

export function SiteHeader() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Brand />
          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            <Link
              to="/"
              hash="how-it-works"
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              to="/matches"
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Resources
            </Link>
            <Link
              to="/"
              hash="about"
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost">Sign in</Button>
            <Button asChild>
              <Link to="/get-started">Get started</Link>
            </Button>
          </div>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11 md:hidden"
            aria-label="Find help"
          >
            <Link to="/get-started">
              <Menu />
            </Link>
          </Button>
        </div>
      </header>
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-border bg-background px-2 pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {[
          { to: "/" as const, label: "Home", icon: Home },
          { to: "/get-started" as const, label: "Find help", icon: Compass },
          { to: "/matches" as const, label: "Matches", icon: Sparkles },
        ].map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted-foreground"
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact: to === "/" }}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
        <Button
          variant="ghost"
          className="flex h-auto min-h-16 flex-col items-center justify-center gap-1 rounded-none px-1 text-[11px] font-semibold text-muted-foreground"
        >
          <Bookmark className="size-5" />
          Saved
        </Button>
      </nav>
    </>
  );
}
