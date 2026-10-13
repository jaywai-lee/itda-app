import { supabase } from "@/services/supabase";
import { AuthError } from "@supabase/supabase-js";
import { useState } from "react";
import { Alert } from "react-native";

export const useChangePasswordModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const openModal = () => {
    setNewPassword("");
    setConfirmPassword("");
    setIsVisible(true);
  };

  const closeModal = () => setIsVisible(false);

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("알림", "비밀번호를 모두 입력해주세요.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("알림", "비밀번호는 6자리 이상이어야 합니다.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setIsPending(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      Alert.alert("성공", "비밀번호가 성공적으로 변경되었습니다.");
      closeModal();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AuthError
          ? error.message
          : "비밀번호 변경에 실패했습니다.";
      Alert.alert("오류", errorMessage);
    } finally {
      setIsPending(false);
    }
  };

  return {
    state: { isVisible, newPassword, confirmPassword, isPending },
    handlers: {
      openModal,
      closeModal,
      setNewPassword,
      setConfirmPassword,
      handleSubmit,
    },
  };
};
