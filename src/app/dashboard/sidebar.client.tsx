"use client";

import { HomeIcon, MapPinIcon, MessageCircleIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { appConstants } from "../constants";
import { UserRole } from "@/lib/user-service/types";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { LinkWithSpinner } from "@/components/link-with-spinner";

export type SidebarItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

const items: SidebarItem[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Trips",
    url: "/dashboard/trips",
    icon: MapPinIcon,
  },
];

const betaItems: SidebarItem[] = [
  {
    title: "Feedback",
    url: "/dashboard/beta/feedback",
    icon: MessageCircleIcon,
  },
];

function SidebarButton({ item }: { item: SidebarItem }) {
  const pathname = usePathname();

  return (
    <Button
      variant="ghost"
      className="w-full flex justify-start"
      disabled={item.url === pathname}
      asChild
    >
      <LinkWithSpinner
        href={item.url}
        className="flex items-center gap-2 justify-start"
        icon={<item.icon />}
      >
        <span>{item.title}</span>
      </LinkWithSpinner>
    </Button>
  );
}

type Props = {
  role: UserRole;
};

export function AppSidebar({ role }: Props) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Welcome to {appConstants.APP_NAME}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <SidebarButton item={item} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {["beta", "staff"].includes(role) ? (
          <SidebarGroup>
            <SidebarGroupLabel>Beta</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {betaItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <SidebarButton item={item} />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>
    </Sidebar>
  );
}
