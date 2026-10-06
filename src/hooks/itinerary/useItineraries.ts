import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { Itinerary } from "@/types/database";
import { useQuery } from "@tanstack/react-query";

export const useItineraries = (tripId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.ITINERARIES.BY_TRIP(tripId),
    queryFn: async (): Promise<Itinerary[]> => {
      if (!tripId) return [];

      const { data, error } = await supabase
        .from("itineraries")
        .select("*")
        .eq("trip_id", tripId)
        .order("visit_date", { ascending: true })
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!tripId,
  });
};
