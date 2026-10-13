import { COLORS } from "@/constants/colors";
import { ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

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
    className={`flex-row justify-between items-center p-4 ${
      disabled ? "opacity-50" : "active:bg-slate-50"
    } ${!isLast ? "border-b border-slate-border" : ""}`}
  >
    <View className="flex-row items-center">
      {icon}
      <Text
        className={`text-base font-medium ml-3 ${
          isDanger ? "text-budget-danger" : "text-slate-text"
        }`}
      >
        {label}
      </Text>
    </View>
    <View className="flex-row items-center">
      {value && (
        <Text className="text-sm text-slate-inactive mr-2">{value}</Text>
      )}
      {!hideChevron && <ChevronRight size={20} color={COLORS.slate.inactive} />}
    </View>
  </Pressable>
);
