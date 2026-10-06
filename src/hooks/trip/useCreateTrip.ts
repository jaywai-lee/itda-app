import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { TablesInsert } from "@/types/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTrip: Omit<TablesInsert<"trips">, "user_id">) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다.");

      const { data, error } = await supabase
        .from("trips")
        .insert([{ ...newTrip, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRIPS.ALL });
    },
  });
};
