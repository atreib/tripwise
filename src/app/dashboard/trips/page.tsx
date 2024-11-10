import { getAuthService } from "@/lib/auth-service";
import { NewTripBtn } from "./components.client";

export default async function TripsPage() {
  await getAuthService().requireAuthSession();

  return (
    <div>
      <NewTripBtn />
    </div>
  );
}
