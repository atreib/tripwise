import { z } from "zod";

export const tripSchema = z.object({
  id: z.string(),
  userId: z.string(),
  destination: z.string(),
  season: z.enum(["winter", "summer", "spring", "autumn"]),
  budget: z.enum(["luxury", "moderate", "low budget"]),
  purpose: z.enum([
    "business",
    "leisure",
    "romantic getaway",
    "family",
    "adventure",
  ]),
  duration: z.enum(["days", "weeks", "months"]),
  departure_date: z.coerce.date().nullable().optional(),
  return_date: z.coerce.date().nullable().optional(),
  created_at: z.coerce.date(),
});
export type Trip = z.output<typeof tripSchema>;

export const tripGeneratedSchema = z.object({
  summary: z.string(),
  currency: z.string(),
  dailyCost: z.number(),
});
export type TripGenerated = z.output<typeof tripGeneratedSchema>;

export const tripPackingListSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  item: z.string(),
});
export type TripPackingList = z.output<typeof tripPackingListSchema>;

export const tripDocumentsSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  document: z.string(),
});
export type TripDocuments = z.output<typeof tripDocumentsSchema>;

export const tripLocalEtiquetteSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  title: z.string(),
  description: z.string(),
});
export type TripLocalEtiquette = z.output<typeof tripLocalEtiquetteSchema>;

export const tripLocalFoodSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  title: z.string(),
  description: z.string(),
});
export type TripLocalFood = z.output<typeof tripLocalFoodSchema>;

export const tripPointsOfInterestSchema = z.object({
  id: z.string(),
  tripId: z.string(),
  title: z.string(),
  description: z.string(),
});
export type TripPointsOfInterest = z.output<typeof tripPointsOfInterestSchema>;

export const tripBackpackItemSchema = z.object({
  id: z.string().uuid(),
  tripId: z.string().uuid(),
  item: z.string().min(1),
  order: z.number().int().min(0),
  packed: z.boolean(),
});
export type TripBackpackItem = z.output<typeof tripBackpackItemSchema>;
