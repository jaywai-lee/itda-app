import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { Expense } from "@/types/database";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newExpense: Omit<Expense, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("expenses")
        .insert([newExpense])
        .select()
        .single();

      if (error) throw error;
      return data as Expense;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.EXPENSES.BY_TRIP(variables.trip_id),
      });
    },
  });
};
