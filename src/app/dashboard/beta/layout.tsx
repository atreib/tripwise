import { getAuthService } from "@/lib/auth-service";
import { getUserService } from "@/lib/user-service";

export default async function BetaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getAuthService().requireAuthSession();
  await getUserService().requireBetaAccess(userId);

  return <>{children}</>;
}
