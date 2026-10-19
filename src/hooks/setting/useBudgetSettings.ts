import { UpdateSettings } from "@/types/setting";
import { useState } from "react";
import { Alert } from "react-native";

export const useBudgetSettings = (updateSettings: UpdateSettings) => {
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);

  const handleSelectBudgetThreshold = async (threshold: number) => {
    const isSuccess = await updateSettings({
      budget_warning_threshold: threshold,
    });
    if (isSuccess) {
      setIsBudgetModalVisible(false);
      Alert.alert(
        "설정 완료",
        threshold === 0
          ? "예산 경고 알림이 꺼졌습니다."
          : `예산의 ${threshold}% 사용 시 경고 문구가 출력됩니다.`,
      );
    }
  };

  return {
    isBudgetModalVisible,
    setIsBudgetModalVisible,
    handleSelectBudgetThreshold,
  };
};
