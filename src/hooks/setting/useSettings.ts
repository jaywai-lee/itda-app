import { useAuth } from "@/context/AuthContext";
import {
  cancelDailyReminder,
  requestNotificationPermission,
  scheduleDailyReminder,
} from "@/utils/notifications";
import { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker";
import { Href, router } from "expo-router";
import { useState } from "react";
import { Alert, Platform } from "react-native";
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
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [draftTime, setDraftTime] = useState<Date | null>(null);

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

  const saveReminderTime = async (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    const isSuccess = await updateSettings({ reminder_time: formattedTime });
    if (!isSuccess) return;

    try {
      await scheduleDailyReminder(hours, minutes);
    } catch {
      Alert.alert(
        "알림 예약 실패",
        "시간은 저장됐지만 알림을 예약하지 못했어요. 리마인더를 껐다 켜서 다시 시도해 주세요.",
      );
      return;
    }

    Alert.alert(
      "설정 완료",
      `리마인더 시간이 ${formattedTime}으로 변경되었습니다.`,
    );
  };

  const handleOpenTimePicker = () => {
    setDraftTime(null);
    setIsTimePickerVisible(true);
  };

  const handleDismissTimePicker = () => {
    setIsTimePickerVisible(false);
    setDraftTime(null);
  };

  const handleChangeReminderTime = (
    event: DateTimePickerChangeEvent,
    date: Date,
  ) => {
    if (Platform.OS === "android") {
      setIsTimePickerVisible(false);
      void saveReminderTime(date);
    } else {
      setDraftTime(date);
    }
  };

  const handleConfirmTimePicker = () => {
    const picked = draftTime;
    setIsTimePickerVisible(false);
    setDraftTime(null);
    if (picked) void saveReminderTime(picked);
  };

  return {
    state: {
      userEmail,
      settings,
      isUpdating,
      isDeleting,
      isCountryModalVisible,
      isTimePickerVisible,
      reminderDraftTime: draftTime,
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
      onToggleTimePicker: (visible: boolean) =>
        visible ? handleOpenTimePicker() : handleDismissTimePicker(),
      onChangeReminderTime: handleChangeReminderTime,
      onConfirmTimePicker: handleConfirmTimePicker,
      onDismissTimePicker: handleDismissTimePicker,
      onLogout: handleLogout,
      onDeleteAccount: handleDeleteAccount,
      pwModalHandlers: pwModal.handlers,
    },
  };
};
