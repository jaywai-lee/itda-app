import { Settings, UpdateSettings } from "@/types/setting";
import {
  cancelDailyReminder,
  requestNotificationPermission,
  scheduleDailyReminder,
} from "@/utils/notifications";
import { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Alert, Platform } from "react-native";

export const useReminderSettings = (
  settings: Settings,
  updateSettings: UpdateSettings,
) => {
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [draftTime, setDraftTime] = useState<Date | null>(null);

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
    isTimePickerVisible,
    draftTime,
    handleToggleReminder,
    handleOpenTimePicker,
    handleDismissTimePicker,
    handleChangeReminderTime,
    handleConfirmTimePicker,
  };
};
