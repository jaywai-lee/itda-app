import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { Itinerary } from "@/types/database";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateItinerary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updateData
    }: Partial<Itinerary> & { id: string }) => {
      const { data, error } = await supabase
        .from("itineraries")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Itinerary;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ITINERARIES.BY_TRIP(data.trip_id),
      });
    },
  });
};
