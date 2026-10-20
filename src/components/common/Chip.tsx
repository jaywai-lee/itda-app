import { cn } from "@/utils/cn";
import { Pressable, View, ViewProps } from "react-native";
import { Typography } from "./Typography";

interface ChipProps extends ViewProps {
  label: string;
  variant?: "default" | "primary" | "danger";
  isActive?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
}

export const Chip = ({
  label,
  variant = "default",
  isActive = false,
  onPress,
  icon,
  className,
  ...props
}: ChipProps) => {
  const baseClasses =
    "flex-row items-center justify-center rounded-chip px-3 py-1.5 border";

  const variantClasses = {
    default: isActive ? "bg-ink border-ink" : "bg-fill border-line",
    primary: "bg-primary/10 border-transparent",
    danger: "bg-danger-soft border-transparent",
  };

  const textColor = isActive
    ? "white"
    : variant === "primary"
      ? "primary"
      : variant === "danger"
        ? "danger"
        : "default";

  const Content = (
    <>
      {icon && <View className="mr-1">{icon}</View>}
      <Typography variant="caption" color={textColor as any}>
        {label}
      </Typography>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {Content}
      </Pressable>
    );
  }

  return (
    <View
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {Content}
    </View>
  );
};
