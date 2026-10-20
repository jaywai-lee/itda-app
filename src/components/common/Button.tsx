import { cn } from "@/utils/cn";
import { ActivityIndicator, Pressable, PressableProps } from "react-native";
import { Typography } from "./Typography";

interface ButtonProps extends PressableProps {
  variant?: "solid" | "soft" | "danger" | "ghost";
  isLoading?: boolean;
  children: string | React.ReactNode;
}

export const Button = ({
  variant = "solid",
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "flex-row items-center justify-center rounded-full px-5 py-3.5 active:opacity-75";

  const variantClasses = {
    solid: "bg-primary shadow-sm",
    soft: "bg-fill-strong",
    danger: "bg-danger-soft",
    ghost: "bg-transparent active:bg-fill",
  };

  const textColors = {
    solid: "white",
    soft: "default",
    danger: "danger",
    ghost: "default",
  } as const;

  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      disabled={isDisabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        isDisabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "solid" ? "#FFFFFF" : "#0F172A"}
        />
      ) : typeof children === "string" ? (
        <Typography variant="button" color={textColors[variant]}>
          {children}
        </Typography>
      ) : (
        children
      )}
    </Pressable>
  );
};
