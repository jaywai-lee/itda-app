import { QUERY_KEYS } from "@/constants/queryKeys";
import { supabase } from "@/services/supabase";
import { TablesInsert, TablesUpdate } from "@/types/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CategoryInput = Pick<
  TablesInsert<"categories">,
  "name" | "color" | "icon"
>;
type CategoryUpdate = Pick<
  TablesUpdate<"categories">,
  "name" | "color" | "icon"
>;

export const countExpensesByCategory = async (categoryId: string) => {
  const { count, error } = await supabase
    .from("expenses")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId);

  if (error) throw error;
  return count ?? 0;
};

export const useCategoryCrud = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPENSES.ALL });
  };

  const createCategory = useMutation({
    mutationFn: async (input: CategoryInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다.");

      const { data, error } = await supabase
        .from("categories")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("이미 같은 이름의 카테고리가 있어요.");
        }
        throw error;
      }
      return data;
    },
    onSuccess: invalidate,
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...input }: CategoryUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("categories")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          throw new Error("수정할 수 없는 카테고리입니다.");
        }
        if (error.code === "23505") {
          throw new Error("이미 같은 이름의 카테고리가 있어요.");
        }
        throw error;
      }
      return data;
    },
    onSuccess: invalidate,
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id)
        .select("id");

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("삭제할 수 없는 카테고리입니다.");
      }
      return id;
    },
    onSuccess: invalidate,
  });

  return {
    createCategory: createCategory.mutate,
    updateCategory: updateCategory.mutate,
    deleteCategory: deleteCategory.mutate,
    isPending:
      createCategory.isPending ||
      updateCategory.isPending ||
      deleteCategory.isPending,
  };
};
