import "server-only";

import { db } from "@/lib/db";
import {
  Trip,
  tripDocumentsSchema,
  TripGenerated,
  tripGeneratedSchema,
  tripLocalEtiquetteSchema,
  tripLocalFoodSchema,
  tripPackingListSchema,
  tripPointsOfInterestSchema,
  tripSchema,
  tripBackpackItemSchema,
} from "./types";
import { v4 } from "uuid";
import { generateTripSummary } from "./prompts/generate-trip-summary";
import { generateTripCurrency } from "./prompts/generate-trip-currency";
import { generateTripDailyCost } from "./prompts/generate-trip-daily-cost";
import { generateTripPackingList } from "./prompts/generate-trip-packing-list";
import { generateTripPointsOfInterest } from "./prompts/generate-trip-points-of-interest";
import { generateTripDocuments } from "./prompts/generate-trip-documents";
import { generateTripLocalEtiquettes } from "./prompts/generate-trip-local-etiquettes";
import { generateTripFoodRecommendations } from "./prompts/generate-trip-food-recommendations";
import { generateTranslation } from "./prompts/translation";
import { getCurrentExchangeRate } from "./utils/currency-exchange";

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
  const { departure_date, return_date, ...tripData } = props.trip;
  const newTrip = await db
    .insertInto("trip")
    .values({
      ...tripData,
      id: v4(),
      departure_date: departure_date ? departure_date.toISOString() : null,
      return_date: return_date ? return_date.toISOString() : null,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  // TODO: Add queueing to decrease Vercel compute time on project creation
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

// TODO: Add caching + revalidation to decrease Vercel compute time
async function getTripById(props: { tripId: string }) {
  const trip = await db
    .selectFrom("trip")
    .selectAll()
    .where("id", "=", props.tripId)
    .executeTakeFirst();
  if (!trip) return undefined;
  return tripSchema.merge(tripGeneratedSchema.partial()).parse(trip);
}

// TODO: Add caching + revalidation to decrease Vercel compute time
async function getTripPackingList(props: { tripId: string }) {
  const packingList = await db
    .selectFrom("trip_packing_list")
    .selectAll()
    .where("tripId", "=", props.tripId)
    .execute();
  return tripPackingListSchema.array().parse(packingList);
}

// TODO: Add caching + revalidation to decrease Vercel compute time
async function getTripRequiredDocuments(props: { tripId: string }) {
  const requiredDocuments = await db
    .selectFrom("trip_documents")
    .selectAll()
    .where("tripId", "=", props.tripId)
    .execute();
  return tripDocumentsSchema.array().parse(requiredDocuments);
}

// TODO: Add caching + revalidation to decrease Vercel compute time
async function getTripLocalEtiquettes(props: { tripId: string }) {
  const localEtiquettes = await db
    .selectFrom("trip_local_etiquette")
    .selectAll()
    .where("tripId", "=", props.tripId)
    .execute();
  return tripLocalEtiquetteSchema.array().parse(localEtiquettes);
}

// TODO: Add caching + revalidation to decrease Vercel compute time
async function getTripLocalFood(props: { tripId: string }) {
  const localFood = await db
    .selectFrom("trip_local_food")
    .selectAll()
    .where("tripId", "=", props.tripId)
    .execute();
  return tripLocalFoodSchema.array().parse(localFood);
}

// TODO: Add caching + revalidation to decrease Vercel compute time
async function getTripPointsOfInterest(props: { tripId: string }) {
  const pointsOfInterest = await db
    .selectFrom("trip_points_of_interest")
    .selectAll()
    .where("tripId", "=", props.tripId)
    .execute();
  return tripPointsOfInterestSchema.array().parse(pointsOfInterest);
}

// TODO: Add caching + revalidation to decrease Vercel compute time
async function getTripsByUserId(props: { userId: string }) {
  const trips = await db
    .selectFrom("trip")
    .selectAll()
    .where("userId", "=", props.userId)
    .execute();
  return tripSchema.array().parse(trips);
}

async function deleteTrip(props: { tripId: string }) {
  await db.deleteFrom("trip").where("id", "=", props.tripId).execute();
}

async function updateTripDates(props: {
  tripId: string;
  departureDate: Date | null;
  returnDate: Date | null;
}) {
  await db
    .updateTable("trip")
    .set({
      departure_date: props.departureDate ? props.departureDate.toISOString() : null,
      return_date: props.returnDate ? props.returnDate.toISOString() : null,
    })
    .where("id", "=", props.tripId)
    .execute();
}

// TODO: Add caching + revalidation to decrease Vercel compute time
async function getLatestFewTripByUserId(props: { userId: string }) {
  const trips = await db
    .selectFrom("trip")
    .selectAll()
    .where("userId", "=", props.userId)
    .orderBy("created_at", "desc")
    .limit(3)
    .execute();
  return tripSchema.array().parse(trips);
}

async function getAllTrips() {
  const trips = await db.selectFrom("trip").selectAll().execute();
  return tripSchema.array().parse(trips);
}

async function translateText(props: {
  destination: Trip["destination"];
  text: string;
}) {
  return generateTranslation(props);
}

async function getDestinationCurrentExchangeRate(props: {
  userLocalCurrencyCode: string;
  destinationLocalCurrencyCode: TripGenerated["currency"];
}) {
  return getCurrentExchangeRate({
    currencyCodeFrom: props.userLocalCurrencyCode,
    currencyCodeTo: props.destinationLocalCurrencyCode,
  });
}

// Trip Backpack Methods
async function hasTripBackpack(props: { tripId: string }): Promise<boolean> {
  const item = await db
    .selectFrom("trip_backpack_item")
    .select("id")
    .where("tripId", "=", props.tripId)
    .limit(1)
    .executeTakeFirst();
  return !!item;
}

async function createTripBackpackFromBackpack(props: {
  tripId: string;
  backpackId: string;
}) {
  // Delete AI-generated packing list
  await db
    .deleteFrom("trip_packing_list")
    .where("tripId", "=", props.tripId)
    .execute();

  // Get backpack items
  const backpackItems = await db
    .selectFrom("backpack_item")
    .selectAll()
    .where("backpackId", "=", props.backpackId)
    .orderBy("order", "asc")
    .execute();

  // Clone items to trip backpack
  await Promise.all(
    backpackItems.map((item) =>
      db
        .insertInto("trip_backpack_item")
        .values({
          id: v4(),
          tripId: props.tripId,
          item: item.item,
          order: item.order,
          packed: false,
        })
        .execute()
    )
  );
}

async function createEmptyTripBackpack(props: { tripId: string }) {
  // Delete AI-generated packing list
  await db
    .deleteFrom("trip_packing_list")
    .where("tripId", "=", props.tripId)
    .execute();

  // Delete existing trip backpack items if any
  await db
    .deleteFrom("trip_backpack_item")
    .where("tripId", "=", props.tripId)
    .execute();
}

async function getTripBackpackItems(props: { tripId: string }) {
  const items = await db
    .selectFrom("trip_backpack_item")
    .selectAll()
    .where("tripId", "=", props.tripId)
    .orderBy("order", "asc")
    .execute();
  return tripBackpackItemSchema.array().parse(items);
}

async function addTripBackpackItem(props: { tripId: string; item: string }) {
  // Get the current max order for this trip backpack
  const result = await db
    .selectFrom("trip_backpack_item")
    .select(({ fn }) => fn.max("order").as("maxOrder"))
    .where("tripId", "=", props.tripId)
    .executeTakeFirst();

  const nextOrder = result?.maxOrder != null ? result.maxOrder + 1 : 0;

  const newItem = await db
    .insertInto("trip_backpack_item")
    .values({
      id: v4(),
      tripId: props.tripId,
      item: props.item,
      order: nextOrder,
      packed: false,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return tripBackpackItemSchema.parse(newItem);
}

async function updateTripBackpackItem(props: { itemId: string; item: string }) {
  const updatedItem = await db
    .updateTable("trip_backpack_item")
    .set({ item: props.item })
    .where("id", "=", props.itemId)
    .returningAll()
    .executeTakeFirstOrThrow();

  return tripBackpackItemSchema.parse(updatedItem);
}

async function deleteTripBackpackItem(props: { itemId: string }) {
  await db
    .deleteFrom("trip_backpack_item")
    .where("id", "=", props.itemId)
    .execute();
}

async function reorderTripBackpackItems(props: {
  items: Array<{ id: string; order: number }>;
}) {
  await Promise.all(
    props.items.map((item) =>
      db
        .updateTable("trip_backpack_item")
        .set({ order: item.order })
        .where("id", "=", item.id)
        .execute()
    )
  );
}

async function toggleTripBackpackItemPacked(props: {
  itemId: string;
  packed: boolean;
}) {
  const updatedItem = await db
    .updateTable("trip_backpack_item")
    .set({ packed: props.packed })
    .where("id", "=", props.itemId)
    .returningAll()
    .executeTakeFirstOrThrow();

  return tripBackpackItemSchema.parse(updatedItem);
}

export function getTripsService() {
  return {
    createTrip,
    getTripById,
    getTripPackingList,
    getTripRequiredDocuments,
    getTripLocalEtiquettes,
    getTripLocalFood,
    getTripPointsOfInterest,
    getTripsByUserId,
    deleteTrip,
    updateTripDates,
    getLatestFewTripByUserId,
    getAllTrips,
    translateText,
    getDestinationCurrentExchangeRate,
    // Trip Backpack
    hasTripBackpack,
    createTripBackpackFromBackpack,
    createEmptyTripBackpack,
    getTripBackpackItems,
    addTripBackpackItem,
    updateTripBackpackItem,
    deleteTripBackpackItem,
    reorderTripBackpackItems,
    toggleTripBackpackItemPacked,
  };
}
