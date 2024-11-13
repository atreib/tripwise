import { Sidebar } from "@/components/ui/sidebar";

export function AppSidebarSkeleton() {
  return (
    <Sidebar className="p-8">
      <span className="text-muted-foreground text-xs">Loading...</span>
    </Sidebar>
  );
}
