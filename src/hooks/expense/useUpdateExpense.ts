import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { Expense } from "@/types/database";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updateData
    }: Partial<Expense> & { id: string }) => {
      const { data, error } = await supabase
        .from("expenses")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Expense;
    },
    onSuccess: (_, variables) => {
      if (variables.trip_id) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.EXPENSES.BY_TRIP(variables.trip_id),
        });
      }
    },
  });
};
