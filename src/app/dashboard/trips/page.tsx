import { getAuthService } from "@/lib/auth-service";

export default async function TripsPage() {
  await getAuthService().requireAuthSession();

  return <div>Your trips</div>;
}
