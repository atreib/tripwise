import { getAuthService } from "@/lib/auth-service";

export default async function TripsPage() {
  await getAuthService().requireAuthSession();

  return <div className="text-muted-foreground text-sm">Coming soon</div>;
}
