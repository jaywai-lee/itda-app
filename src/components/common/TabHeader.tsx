import { COLORS } from "@/constants/colors";
import { SHADOWS } from "@/constants/shadows";
import { Settings } from "lucide-react-native";
import { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "./Typography";

interface TabHeaderProps {
  title: string;
  icon?: ReactNode;
  onPressSettings: () => void;
}

const SETTINGS_HIT_SLOP = { top: 2, bottom: 2, left: 2, right: 2 };

export const TabHeader = ({ title, icon, onPressSettings }: TabHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-surface rounded-b-sheet px-5 pb-4 flex-row items-center justify-between"
      style={[{ paddingTop: insets.top + 12, zIndex: 1 }, SHADOWS.card]}
    >
      <View className="flex-1 flex-row items-center mr-3">
        {icon ? (
          <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
            {icon}
          </View>
        ) : null}
        <Typography variant="title" numberOfLines={1} className="flex-1">
          {title}
        </Typography>
      </View>

      <Pressable
        onPress={onPressSettings}
        hitSlop={SETTINGS_HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel="설정"
        className="w-10 h-10 rounded-full bg-fill items-center justify-center active:scale-95"
      >
        <Settings size={20} color={COLORS.ink.DEFAULT} />
      </Pressable>
    </View>
  );
};
