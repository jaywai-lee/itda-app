import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.LIST(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("user_id", { ascending: true, nullsFirst: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};
