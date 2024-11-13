import { getAuthService } from "@/lib/auth-service";
import { AppSidebar as AppSidebarClient } from "./sidebar.client";
import { getUserService } from "@/lib/user-service";

export async function AppSidebar() {
  const userId = await getAuthService().requireAuthSession();
  const user = await getUserService().getUserByIdOrThrow(userId);

  return <AppSidebarClient role={user.role} />;
}
