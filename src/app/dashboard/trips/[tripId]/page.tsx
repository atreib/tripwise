import { getAuthService } from "@/lib/auth-service";
import { getTripsService } from "@/lib/trips-service";
import { Trip } from "@/lib/trips-service/types";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ tripId: Trip["id"] }>;
};

export default async function TripPage({ params }: Props) {
  const { tripId } = await params;
  await getAuthService().requireAuthSession();
  const trip = await getTripsService().getTripById({ tripId });
  if (!trip) return notFound();
  return <pre className="text-sm text-wrap">{JSON.stringify(trip)}</pre>;
}
