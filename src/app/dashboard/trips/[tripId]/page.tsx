import { Suspense } from "react";
import { getAuthService } from "@/lib/auth-service";
import { getTripsService } from "@/lib/trips-service";
import { Trip } from "@/lib/trips-service/types";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpenIcon,
  DollarSignIcon,
  LanguagesIcon,
  Loader2Icon,
  MapPinIcon,
  TicketCheckIcon,
} from "lucide-react";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackingCard } from "./packing-card.server";
import { PackingCardSkeleton } from "./packing-card-skeleton.server";
import { LocalEtiquettesCardSkeleton } from "./local-etiquettes-card-skeleton.server";
import { LocalEtiquettesCard } from "./local-etiquettes-card.server";
import { LocalFoodSkeleton } from "./local-food-skeleton.server";
import { LocalFoodCard } from "./local-food.server";
import { Attractions } from "./attractions.server";
import { AttractionsSkeleton } from "./attractions-skeleton.server";
import { TabsOnUrl } from "./tabs-on-url.client";
import { Button } from "@/components/ui/button";
import { TranslationDialog } from "./translation-dialog.client";
import { CurrencyCalculatorDialog } from "./currency-calculator.server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DocsCard } from "./docs-card.server";
import { DocsCardSkeleton } from "./docs-card-skeleton.server";
import { SmokeTestDialog } from "@/components/smoke-test";
import { Metadata } from "next";

// TODO: Revalidate ISR when we allow people to edit trips

export const revalidate = 86400; // 24 hours
export const dynamicParams = true;

export async function generateStaticParams() {
  const trips = await getTripsService().getAllTrips();
  return trips.map((trip) => ({
    tripId: trip.id,
  }));
}

type Props = {
  params: Promise<{ tripId: Trip["id"] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tripId } = await params;
  await getAuthService().requireAuthSession();
  const trip = await getTripsService().getTripById({ tripId });
  return {
    title: trip?.destination,
  };
}

export default async function TripPage({ params }: Props) {
  const { tripId } = await params;
  await getAuthService().requireAuthSession();
  const trip = await getTripsService().getTripById({ tripId });
  if (!trip) return notFound();
  return (
    <div className="flex flex-col gap-8 w-full overflow-auto">
      <nav className="flex flex-wrap gap-4">
        <TranslationDialog tripDestination={trip.destination}>
          <Button variant="secondary">
            <LanguagesIcon className="mr-2" />
            Quick translate
          </Button>
        </TranslationDialog>
        {trip.currency ? (
          <Suspense
            fallback={
              <Button
                variant="secondary"
                className="animate-pulse"
                disabled={true}
              >
                <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
                Exchange rate calculator
              </Button>
            }
          >
            <CurrencyCalculatorDialog
              userLocalCurrencyCode={"USD"}
              destinationLocalCurrencyCode={trip.currency}
            >
              <Button variant="secondary">
                <DollarSignIcon className="w-4 h-4 mr-2" />
                Exchange rate calculator
              </Button>
            </CurrencyCalculatorDialog>
          </Suspense>
        ) : null}
        <SmokeTestDialog>
          <Button variant="secondary">
            <TicketCheckIcon className="w-4 h-4 mr-2" />
            Auto booking your tickets
          </Button>
        </SmokeTestDialog>
        <SmokeTestDialog>
          <Button variant="secondary">
            <BookOpenIcon className="w-4 h-4 mr-2" />
            Generate itinerary with AI
          </Button>
        </SmokeTestDialog>
      </nav>
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
            <Accordion type="single" collapsible>
              <AccordionItem value="summary">
                <AccordionTrigger className="hover:no-underline text-muted-foreground text-lg">
                  What to expect from {trip.destination}?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {trip.summary}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
      </Card>

      <TabsOnUrl defaultValue="etiquettes">
        <div className="w-full overflow-auto whitespace-nowrap">
          <TabsList>
            <TabsTrigger value="etiquettes">Local Etiquettes</TabsTrigger>
            <TabsTrigger value="attractions">Attractions</TabsTrigger>
            <TabsTrigger value="food">Local Food</TabsTrigger>
            <TabsTrigger value="packing">Packing</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="packing">
          <Suspense fallback={<PackingCardSkeleton />}>
            <PackingCard trip={trip} />
          </Suspense>
        </TabsContent>

        <TabsContent value="documents">
          <Suspense fallback={<DocsCardSkeleton />}>
            <DocsCard trip={trip} />
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
