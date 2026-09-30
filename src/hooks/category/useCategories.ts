import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { Category } from "@/types/database";
import { useQuery } from "@tanstack/react-query";

export const useCategories = (tripId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.BY_TRIP(tripId),
    queryFn: async (): Promise<Category[]> => {
      let query = supabase.from("categories").select("*");
      if (tripId) {
        query = query.or(`trip_id.eq.${tripId},trip_id.is.null`);
      } else {
        query = query.is("trip_id", null);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Category[];
    },
  });
};
