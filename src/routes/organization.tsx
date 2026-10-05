import { createFileRoute, Outlet } from "@tanstack/react-router";
import { OrgNav } from "@/components/schoolbridge/org-nav";
import { OrgProvider } from "@/components/schoolbridge/org-context";

export const Route = createFileRoute("/organization")({
  head: () => ({
    meta: [
      { title: "Organization Portal — SchoolBridge" },
      {
        name: "description",
        content: "Create, maintain, and measure the student resources your organization provides.",
      },
      { property: "og:title", content: "Organization Portal — SchoolBridge" },
      {
        property: "og:description",
        content: "Keep student resources accurate, current, and usable.",
      },
    ],
  }),
  component: OrgLayout,
});

function OrgLayout() {
  return (
    <OrgProvider>
      <div className="min-h-dvh bg-soft">
        <OrgNav />
        <Outlet />
      </div>
    </OrgProvider>
  );
}
