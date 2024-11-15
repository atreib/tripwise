"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/components/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-muted-foreground">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/dashboard" className="hover:underline">
            Home
          </Link>
        </li>
        {paths.slice(1).map((path, index) => {
          const href = `/dashboard/${paths.slice(1, index + 2).join("/")}`;
          const isLast = index === paths.length - 2;
          const isDisabled = path === "beta";

          return (
            <li key={path} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-500" />
              {isLast ? (
                <span className="ml-2 font-medium capitalize">{path}</span>
              ) : (
                <Link
                  href={isDisabled ? "#" : href}
                  className="ml-2 capitalize hover:underline"
                >
                  {path}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
