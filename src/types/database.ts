export interface Trip {
  id: string;
  user_id: string;
  name: string;
  start_date: string;
  end_date: string;
  currency: string;
  total_budget: number;
  created_at: string;
}

export interface Itinerary {
  id: string;
  trip_id: string;
  title: string;
  place_name?: string | null;
  lat?: number | null;
  lng?: number | null;
  visit_date: string;
  visit_time?: string | null;
  memo?: string | null;
  order_index: number;
  created_at: string;
}

export interface Category {
  id: string;
  trip_id?: string | null;
  name: string;
  icon?: string | null;
  color?: string | null;
}

export interface Expense {
  id: string;
  trip_id: string;
  itinerary_id?: string | null;
  category_id?: string | null;
  amount: number;
  currency: string;
  memo?: string | null;
  photo_url?: string | null;
  spent_at: string;
  created_at: string;
}
