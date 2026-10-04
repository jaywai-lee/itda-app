import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateItineraryOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tripId,
      updates,
    }: {
      tripId: string;
      updates: { id: string; order_index: number }[];
    }) => {
      const promises = updates.map((update) =>
        supabase
          .from("itineraries")
          .update({ order_index: update.order_index })
          .eq("id", update.id),
      );
      await Promise.all(promises);
      return tripId;
    },
    onSuccess: (tripId) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ITINERARIES.BY_TRIP(tripId),
      });
    },
  });
};
