import { ColumnType } from "kysely";

export interface Database {
  user: UserTable;
  trip: TripTable;
  trip_packing_list: TripPackingListTable;
  trip_backpack_item: TripBackpackItemTable;
  trip_documents: TripDocumentsTable;
  trip_local_etiquette: TripLocalEtiquetteTable;
  trip_local_food: TripLocalFoodTable;
  trip_points_of_interest: TripPointsOfInterestTable;
  feedback: FeedbackTable;
  backpack: BackpackTable;
  backpack_item: BackpackItemTable;
}

export interface UserTable {
  id: string;
  email: string;
  name: string;
  role: "staff" | "beta" | "regular";
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
  departure_date?: ColumnType<Date | null, string | null | undefined, string | null | undefined>;
  return_date?: ColumnType<Date | null, string | null | undefined, string | null | undefined>;
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

export interface FeedbackTable {
  id: string;
  userId: string;
  message: string;
  createdAt: ColumnType<Date, string | undefined, never>;
}

export interface BackpackTable {
  id: string;
  userId: string;
  name: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface BackpackItemTable {
  id: string;
  backpackId: string;
  item: string;
  order: number;
}

export interface TripBackpackItemTable {
  id: string;
  tripId: string;
  item: string;
  order: number;
  packed: boolean;
}
