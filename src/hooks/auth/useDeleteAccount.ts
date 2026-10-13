import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/services/supabase";
import { useState } from "react";

export const useDeleteAccount = () => {
  const [isPending, setIsPending] = useState(false);
  const { signOut } = useAuth();

  const deleteAccount = async () => {
    try {
      setIsPending(true);

      const { error } = await supabase.rpc("delete_user");
      if (error) throw error;

      await signOut();
    } catch (error) {
      console.error("회원 탈퇴 처리 중 오류 발생:", error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { deleteAccount, isPending };
};
