import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { TablesUpdate } from "@/types/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateItinerary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updateData
    }: TablesUpdate<"itineraries"> & { id: string }) => {
      const { data, error } = await supabase
        .from("itineraries")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ITINERARIES.BY_TRIP(data.trip_id),
      });
    },
  });
};
