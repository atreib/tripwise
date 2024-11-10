import "server-only";

import { db } from "@/lib/db";
import { Trip, tripSchema } from "./types";
import { v4 } from "uuid";
import { generateTripSummary } from "./prompts/generate-trip-summary";
import { generateTripCurrency } from "./prompts/generate-trip-currency";
import { generateTripDailyCost } from "./prompts/generate-trip-daily-cost";
import { generateTripPackingList } from "./prompts/generate-trip-packing-list";
import { generateTripPointsOfInterest } from "./prompts/generate-trip-points-of-interest";
import { generateTripDocuments } from "./prompts/generate-trip-documents";
import { generateTripLocalEtiquettes } from "./prompts/generate-trip-local-etiquettes";
import { generateTripFoodRecommendations } from "./prompts/generate-trip-food-recommendations";

async function updateTripSummary(props: { trip: Trip }) {
  const summary = await generateTripSummary({ trip: props.trip });
  await db
    .updateTable("trip")
    .set({ summary })
    .where("id", "=", props.trip.id)
    .execute();
}

async function updateTripCurrency(props: { trip: Trip }) {
  const currency = await generateTripCurrency({ trip: props.trip });
  await db
    .updateTable("trip")
    .set({ currency })
    .where("id", "=", props.trip.id)
    .execute();
}

async function updateTripDailyCost(props: { trip: Trip }) {
  const dailyCost = await generateTripDailyCost({ trip: props.trip });
  await db
    .updateTable("trip")
    .set({ dailyCost })
    .where("id", "=", props.trip.id)
    .execute();
}

async function updateTripPackingList(props: { trip: Trip }) {
  const packingList = await generateTripPackingList({ trip: props.trip });
  await Promise.all(
    packingList.map((item) => {
      return db
        .insertInto("trip_packing_list")
        .values({ id: v4(), tripId: props.trip.id, item })
        .execute();
    })
  );
}

async function updateTripPointsOfInterest(props: { trip: Trip }) {
  const pointsOfInterest = await generateTripPointsOfInterest({
    trip: props.trip,
  });
  await Promise.all(
    pointsOfInterest.map((attributes) => {
      return db
        .insertInto("trip_points_of_interest")
        .values({ id: v4(), tripId: props.trip.id, ...attributes })
        .execute();
    })
  );
}

async function updateTripDocuments(props: { trip: Trip }) {
  const documents = await generateTripDocuments({ trip: props.trip });
  await Promise.all(
    documents.map((attributes) => {
      return db
        .insertInto("trip_documents")
        .values({ id: v4(), tripId: props.trip.id, ...attributes })
        .execute();
    })
  );
}

async function updateTripLocalEtiquettes(props: { trip: Trip }) {
  const localEtiquettes = await generateTripLocalEtiquettes({
    trip: props.trip,
  });
  await Promise.all(
    localEtiquettes.map((attributes) => {
      return db
        .insertInto("trip_local_etiquette")
        .values({ id: v4(), tripId: props.trip.id, ...attributes })
        .execute();
    })
  );
}

async function updateTripFoodRecommendations(props: { trip: Trip }) {
  const foodRecommendations = await generateTripFoodRecommendations({
    trip: props.trip,
  });
  await Promise.all(
    foodRecommendations.map((attributes) => {
      return db
        .insertInto("trip_local_food")
        .values({ id: v4(), tripId: props.trip.id, ...attributes })
        .execute();
    })
  );
}

async function createTrip(props: { trip: Omit<Trip, "id" | "created_at"> }) {
  const newTrip = await db
    .insertInto("trip")
    .values({
      ...props.trip,
      id: v4(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  await Promise.all([
    updateTripSummary({ trip: newTrip }),
    updateTripCurrency({ trip: newTrip }),
    updateTripDailyCost({ trip: newTrip }),
    updateTripPackingList({ trip: newTrip }),
    updateTripPointsOfInterest({ trip: newTrip }),
    updateTripDocuments({ trip: newTrip }),
    updateTripLocalEtiquettes({ trip: newTrip }),
    updateTripFoodRecommendations({ trip: newTrip }),
  ]);

  return tripSchema.parse(newTrip);
}

async function getTripById(props: { tripId: string }) {
  const trip = await db
    .selectFrom("trip")
    .selectAll()
    .where("id", "=", props.tripId)
    .executeTakeFirst();
  if (!trip) return undefined;
  return tripSchema.parse(trip);
}

export function getTripsService() {
  return {
    createTrip,
    getTripById,
  };
}
