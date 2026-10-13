import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { Alert } from "react-native";
import { useDeleteAccount } from "./useDeleteAccount";

export const useAuthActions = () => {
  const { signOut } = useAuth();
  const { deleteAccount, isPending: isDeleting } = useDeleteAccount();

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/login");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "회원 탈퇴",
      "탈퇴 시 등록된 모든 여행 및 가계부 데이터가 영구적으로 삭제됩니다.\n정말 탈퇴하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴하기",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              router.replace("/login");
            } catch (error) {
              Alert.alert(
                "오류",
                "회원 탈퇴 처리 중 문제가 발생했습니다. 다시 시도해 주세요.",
              );
            }
          },
        },
      ],
    );
  };

  return { handleLogout, handleDeleteAccount, isDeleting };
};
