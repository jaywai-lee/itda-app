import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { Itinerary } from "@/types/database";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateItinerary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItinerary: Omit<Itinerary, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("itineraries")
        .insert([newItinerary])
        .select()
        .single();

      if (error) throw error;
      return data as Itinerary;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ITINERARIES.BY_TRIP(variables.trip_id),
      });
    },
  });
};
