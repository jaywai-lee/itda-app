import { Typography } from "@/components/common/Typography";
import { COLORS } from "@/constants/colors";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";

export interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  hideChevron?: boolean;
  isDanger?: boolean;
  onPress?: () => void;
  isLast?: boolean;
  disabled?: boolean;
}

export const SettingItem = ({
  icon,
  label,
  value,
  hideChevron = false,
  isDanger = false,
  onPress,
  isLast = false,
  disabled = false,
}: SettingItemProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    className={`flex-row justify-between items-center p-4 transition-all ${
      disabled ? "opacity-50" : "active:bg-fill"
    } ${!isLast ? "border-b border-line" : ""}`}
  >
    <View className="flex-row items-center">
      {icon}
      <Typography
        className={`text-base font-medium ml-3 ${
          isDanger ? "text-budget-danger" : "text-ink"
        }`}
      >
        {label}
      </Typography>
    </View>
    <View className="flex-row items-center">
      {value && (
        <Typography className="text-sm text-ink-mute mr-2">{value}</Typography>
      )}
      {!hideChevron && <ChevronRight size={20} color={COLORS.ink.mute} />}
    </View>
  </Pressable>
);
