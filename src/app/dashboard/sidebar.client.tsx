"use client";

import {
  HomeIcon,
  Loader2Icon,
  MapPinIcon,
  MessageCircleIcon,
} from "lucide-react";
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
import { ButtonWithLoading } from "@/components/button-with-loading";
import { usePathname } from "next/navigation";
import { UserRole } from "@/lib/user-service/types";

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
    <ButtonWithLoading
      variant="ghost"
      asChild
      className="text-left flex items-center gap-2 justify-start cursor-pointer"
      disableLoading={item.url === pathname}
      fallback={
        <div className="flex items-center gap-2">
          <Loader2Icon className="animate-spin" />
          <span>{item.title}</span>
        </div>
      }
    >
      <a href={item.url}>
        <item.icon />
        <span>{item.title}</span>
      </a>
    </ButtonWithLoading>
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
