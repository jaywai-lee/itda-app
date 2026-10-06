import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPENSES.ALL });
    },
  });
};
