import { SidebarTrigger } from "@/components/ui/sidebar";
import { appConstants } from "../constants";
import { UserButton } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { RoleBadge } from "./role-badge.server";

export async function Navbar() {
  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <SidebarTrigger className="mr-4 h-8 w-8" />
            <div>
              <span className="sr-only">{appConstants.APP_NAME}</span>
              <img
                src="/icons/logo-no-background.svg"
                alt="Tripwise"
                className="hidden lg:inline-block h-8 w-auto"
              />
              <img
                src="/icons/logo-only.png"
                alt="Tripwise"
                className="inline-block lg:hidden h-8 w-auto"
              />
            </div>
          </div>
          <div className="ml-6 flex items-center gap-2">
            <Suspense fallback={null}>
              <RoleBadge />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full" />}>
              <UserButton />
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
}
