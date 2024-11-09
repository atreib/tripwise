import { getAuthService } from "@/lib/auth-service";

export default async function DashboardPage() {
  await getAuthService().requireAuthSession();

  return <div className="flex gap-4">Hey</div>;
}
