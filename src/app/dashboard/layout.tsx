import { Navbar } from "./components.server";
import { Breadcrumb } from "./components.client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen w-full">
        <Navbar />
        <div className="max-w-7xl mx-auto flex flex-col gap-4 p-8">
          <Breadcrumb />
          <div className="flex">{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
