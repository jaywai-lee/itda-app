import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/services/supabase";
import { useState } from "react";
import { Alert } from "react-native";

export const useUserSettings = () => {
  const { session } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const metadata = session?.user?.user_metadata || {};
  const defaultCountry = metadata.default_country || "대한민국";
  const defaultCurrency = metadata.default_currency || "KRW";
  const showKrwConversion = metadata.show_krw_conversion ?? true;
  const isReminderEnabled = metadata.is_reminder_enabled ?? false;
  const reminderTime = metadata.reminder_time || "20:00";

  const updateSettings = async (newSettings: {
    default_country?: string;
    default_currency?: string;
    show_krw_conversion?: boolean;
    is_reminder_enabled?: boolean;
    reminder_time?: string;
  }): Promise<boolean> => {
    try {
      setIsUpdating(true);
      const { error } = await supabase.auth.updateUser({
        data: { ...metadata, ...newSettings },
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("[useUserSettings] update failed:", error);
      Alert.alert("오류", "설정 업데이트에 실패했습니다. 다시 시도해 주세요.");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    settings: {
      defaultCountry,
      defaultCurrency,
      showKrwConversion,
      isReminderEnabled,
      reminderTime,
    },
    updateSettings,
    isUpdating,
  };
};
