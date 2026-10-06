import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { Expense } from "@/types/database";
import { useQuery } from "@tanstack/react-query";

export const useExpenses = (tripId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.EXPENSES.BY_TRIP(tripId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select(
          `
          *,
          categories (
            id,
            name,
            color,
            icon
          )
        `,
        )
        .eq("trip_id", tripId)
        .order("spent_at", { ascending: false })
        .overrideTypes<Expense[], { merge: false }>();

      if (error) throw error;
      return data;
    },
    enabled: !!tripId,
  });
};
