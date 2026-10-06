import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { TablesUpdate } from "@/types/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updateData
    }: TablesUpdate<"trips"> & { id: string }) => {
      const { data, error } = await supabase
        .from("trips")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRIPS.LIST() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRIPS.DETAIL(data.id),
      });
    },
  });
};
