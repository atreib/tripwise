import { ColumnType } from "kysely";

export interface Database {
  user: UserTable;
  trip: TripTable;
  tripPackingList: TripPackingListTable;
  tripDocuments: TripDocumentsTable;
  tripLocalEtiquette: TripLocalEtiquetteTable;
  tripLocalFood: TripLocalFoodTable;
  tripPointsOfInterest: TripPointsOfInterestTable;
}

export interface UserTable {
  id: string;
  email: string;
  name: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface TripTable {
  id: string;
  userId: string;
  destination: string;
  season: "winter" | "summer" | "spring" | "autumn";
  budget: "luxury" | "moderate" | "low budget";
  purpose: "business" | "leisure" | "romantic getaway" | "family" | "adventure";
  duration: "days" | "weeks" | "months";
  summary?: string;
  currency?: string;
  dailyCost?: number;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface TripPackingListTable {
  id: string;
  tripId: string;
  item: string;
}

export interface TripDocumentsTable {
  id: string;
  tripId: string;
  document: string;
}

export interface TripLocalEtiquetteTable {
  id: string;
  tripId: string;
  title: string;
  description: string;
}

export interface TripLocalFoodTable {
  id: string;
  tripId: string;
  title: string;
  description: string;
}

export interface TripPointsOfInterestTable {
  id: string;
  tripId: string;
  title: string;
  description: string;
}
