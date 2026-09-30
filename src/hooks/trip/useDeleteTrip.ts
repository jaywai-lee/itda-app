import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("trips").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRIPS.LIST() });
    },
  });
};
