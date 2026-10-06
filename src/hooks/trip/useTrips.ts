import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

export const useTrips = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TRIPS.LIST(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
