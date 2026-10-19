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
}: SettingItemProps) => {
  const isPressable = !!onPress;
  const showChevron = isPressable && !hideChevron;

  const rowClassName = `flex-row justify-between items-center p-4 ${
    !isLast ? "border-b border-slate-border" : ""
  }`;

  const content = (
    <>
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
        {showChevron && (
          <ChevronRight size={20} color={COLORS.slate.inactive} />
        )}
      </View>
    </>
  );

  if (!isPressable) {
    return <View className={rowClassName}>{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      className={`${rowClassName} ${
        disabled ? "opacity-50" : "active:bg-slate-50"
      }`}
    >
      {content}
    </Pressable>
  );
};
