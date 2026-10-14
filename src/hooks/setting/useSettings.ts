import { useAuth } from "@/context/AuthContext";
import {
  cancelDailyReminder,
  requestNotificationPermission,
  scheduleDailyReminder,
} from "@/utils/notifications";
import { Href, router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { useAuthActions } from "../auth/useAuthActions";
import { useChangePasswordModal } from "../auth/useChangePasswordModal";
import { useUserSettings } from "../auth/useUserSettings";

export const useSettings = () => {
  const { session } = useAuth();
  const userEmail = session?.user?.email || "이메일 정보 없음";

  const { handleLogout, handleDeleteAccount, isDeleting } = useAuthActions();
  const pwModal = useChangePasswordModal();

  const { settings, updateSettings, isUpdating } = useUserSettings();
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

  const handleToggleReminder = async () => {
    const nextState = !settings.isReminderEnabled;

    if (nextState) {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        Alert.alert("권한 필요", "기기 설정에서 알림 권한을 허용해주세요.");
        return;
      }
    }

    const isSuccess = await updateSettings({ is_reminder_enabled: nextState });
    if (!isSuccess) return;

    if (nextState) {
      const [hour, minute] = settings.reminderTime.split(":").map(Number);
      await scheduleDailyReminder(hour, minute);
    } else {
      await cancelDailyReminder();
    }

    Alert.alert(
      "설정 완료",
      nextState ? "지출 기록 리마인더가 켜졌습니다." : "리마인더가 꺼졌습니다.",
    );
  };

  return {
    state: {
      userEmail,
      settings,
      isUpdating,
      isDeleting,
      isCountryModalVisible,
      pwModalState: pwModal.state,
    },
    handlers: {
      onGoBack: () => router.back(),
      onNavigate: (path: Href) => router.push(path),
      onComingSoon: handleComingSoon,
      onToggleKrwConversion: handleToggleKrwConversion,
      onSelectDefaultCountry: handleSelectDefaultCountry,
      onToggleReminder: handleToggleReminder,
      onToggleCountryModal: (visible: boolean) =>
        setIsCountryModalVisible(visible),
      onLogout: handleLogout,
      onDeleteAccount: handleDeleteAccount,
      pwModalHandlers: pwModal.handlers,
    },
  };
};
