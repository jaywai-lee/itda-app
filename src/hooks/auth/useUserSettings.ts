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

  const updateSettings = async (newSettings: {
    default_country?: string;
    default_currency?: string;
    show_krw_conversion?: boolean;
  }) => {
    try {
      setIsUpdating(true);
      const { error } = await supabase.auth.updateUser({
        data: { ...metadata, ...newSettings },
      });

      if (error) throw error;
    } catch (error) {
      Alert.alert("오류", "설정 업데이트에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    settings: { defaultCountry, defaultCurrency, showKrwConversion },
    updateSettings,
    isUpdating,
  };
};
