import { getAuthService } from "@/lib/auth-service";
import { IdentifyUser as IdentifyUserClient } from "./identify.client";

export async function IdentifyUser() {
  const userId = await getAuthService().getAuthSession();
  return <IdentifyUserClient userId={userId} />;
}
