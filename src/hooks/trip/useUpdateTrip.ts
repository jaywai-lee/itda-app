import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { Trip } from "@/types/database";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updateData
    }: Partial<Trip> & { id: string }) => {
      const { data, error } = await supabase
        .from("trips")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Trip;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRIPS.LIST() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRIPS.DETAIL(data.id),
      });
    },
  });
};
