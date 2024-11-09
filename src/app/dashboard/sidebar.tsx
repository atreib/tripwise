"use client";

import { HomeIcon, Loader2Icon, LogOutIcon } from "lucide-react";
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
import Link from "next/link";

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
    title: "Test",
    url: "/dashboard/test",
    icon: HomeIcon,
  },
];

const accountItems: SidebarItem[] = [
  {
    title: "Log out",
    url: appConstants.LOGOUT_PATH,
    icon: LogOutIcon,
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
      <Link href={item.url}>
        <item.icon />
        <span>{item.title}</span>
      </Link>
    </ButtonWithLoading>
  );
}

export function AppSidebar() {
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
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <SidebarButton item={item} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
