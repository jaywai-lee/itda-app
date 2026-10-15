import { Settings, UpdateSettings } from "@/types/setting";
import { useState } from "react";
import { Alert } from "react-native";

export const useGeneralSettings = (
  settings: Settings,
  updateSettings: UpdateSettings,
) => {
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);

  const handleComingSoon = (feature: string) => {
    Alert.alert("알림", `${feature} 기능은 곧 업데이트될 예정입니다.`);
  };

  const handleToggleKrwConversion = async () => {
    const next = !settings.showKrwConversion;
    const isSuccess = await updateSettings({ show_krw_conversion: next });
    if (!isSuccess) return;

    Alert.alert(
      "설정 완료",
      next ? "원화 환산 표시가 켜졌습니다." : "원화 환산 표시가 꺼졌습니다.",
    );
  };

  const handleSelectDefaultCountry = async (
    country: string,
    currency: string,
  ) => {
    const isSuccess = await updateSettings({
      default_country: country,
      default_currency: currency,
    });
    if (!isSuccess) return;

    setIsCountryModalVisible(false);
    Alert.alert(
      "설정 완료",
      `기본 국가/통화가 ${country} (${currency})로 변경되었습니다.`,
    );
  };

  return {
    isCountryModalVisible,
    setIsCountryModalVisible,
    handleComingSoon,
    handleToggleKrwConversion,
    handleSelectDefaultCountry,
  };
};
