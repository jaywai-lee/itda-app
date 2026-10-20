import { SHADOWS } from "@/constants/shadows";
import { cn } from "@/utils/cn";
import { Pressable, PressableProps, View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  onPress?: PressableProps["onPress"];
  pressEffect?: "scale" | "opacity" | "none";
}

const BASE_CLASSES = "bg-surface rounded-card p-5 border border-line";

const PRESS_CLASSES = {
  scale: "active:scale-[0.98]",
  opacity: "active:opacity-70",
  none: "",
} as const;

export const Card = ({
  onPress,
  pressEffect = "scale",
  className,
  style,
  children,
  ...props
}: CardProps) => {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        className={cn(BASE_CLASSES, PRESS_CLASSES[pressEffect], className)}
        style={[SHADOWS.card, style]}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      className={cn(BASE_CLASSES, className)}
      style={[SHADOWS.card, style]}
      {...props}
    >
      {children}
    </View>
  );
};
