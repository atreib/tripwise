import { Suspense } from "react";
import { getAuthService } from "@/lib/auth-service";
import { getTripsService } from "@/lib/trips-service";
import { Trip } from "@/lib/trips-service/types";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { MapPinIcon } from "lucide-react";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackAndDocsCard } from "./pack-and-docs-card.server";
import { PackAndDocsCardSkeleton } from "./pack-and-docs-card-skeleton.server";
import { LocalEtiquettesCardSkeleton } from "./local-etiquettes-card-skeleton.server";
import { LocalEtiquettesCard } from "./local-etiquettes-card.server";
import { LocalFoodSkeleton } from "./local-food-skeleton.server";
import { LocalFoodCard } from "./local-food.server";
import { Attractions } from "./attractions.server";
import { AttractionsSkeleton } from "./attractions-skeleton.server";
import { TabsOnUrl } from "./tabs-on-url.client";

type Props = {
  params: Promise<{ tripId: Trip["id"] }>;
  searchParams: Promise<{
    tab?: "packing" | "etiquettes" | "food" | "attractions";
  }>;
};

export default async function TripPage({ params, searchParams }: Props) {
  const { tripId } = await params;
  const { tab } = await searchParams;
  await getAuthService().requireAuthSession();
  const trip = await getTripsService().getTripById({ tripId });
  if (!trip) return notFound();
  return (
    <div className="flex flex-col gap-8 w-full overflow-auto">
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold flex items-center">
              <MapPinIcon className="mr-2" /> {trip.destination}
            </h1>
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4 text-lg text-muted-foreground">
              <p>{trip.season}</p>
              <p>a few {trip.duration}</p>
              <p>{trip.budget}</p>
              <p>{trip.purpose}</p>
            </div>
            <p className="text-muted-foreground">{trip.summary}</p>
          </div>
        </CardContent>
      </Card>

      <TabsOnUrl defaultValue={tab ?? "packing"}>
        <div className="w-full overflow-auto whitespace-nowrap">
          <TabsList>
            <TabsTrigger value="packing">Packing & Documents</TabsTrigger>
            <TabsTrigger value="etiquettes">Local Etiquettes</TabsTrigger>
            <TabsTrigger value="food">Local Food</TabsTrigger>
            <TabsTrigger value="attractions">Attractions</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="packing"
          className="flex flex-col lg:flex-row gap-6"
        >
          <Suspense fallback={<PackAndDocsCardSkeleton />}>
            <PackAndDocsCard trip={trip} />
          </Suspense>
        </TabsContent>

        <TabsContent value="etiquettes">
          <Suspense fallback={<LocalEtiquettesCardSkeleton />}>
            <LocalEtiquettesCard trip={trip} />
          </Suspense>
        </TabsContent>

        <TabsContent value="food">
          <Suspense fallback={<LocalFoodSkeleton />}>
            <LocalFoodCard trip={trip} />
          </Suspense>
        </TabsContent>

        <TabsContent value="attractions">
          <Suspense fallback={<AttractionsSkeleton />}>
            <Attractions trip={trip} />
          </Suspense>
        </TabsContent>
      </TabsOnUrl>
    </div>
  );
}
