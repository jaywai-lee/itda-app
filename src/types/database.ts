import { Database } from "./supabase";

export type Trip = Database["public"]["Tables"]["trips"]["Row"];
export type Itinerary = Database["public"]["Tables"]["itineraries"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];

export type Expense = Database["public"]["Tables"]["expenses"]["Row"] & {
  categories?: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  } | null;
};
