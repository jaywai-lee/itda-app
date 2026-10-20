import { cn } from "@/utils/cn";
import { Text, TextProps } from "react-native";

interface TypographyProps extends TextProps {
  variant?:
    | "large-title"
    | "title"
    | "headline"
    | "body"
    | "subhead"
    | "caption"
    | "button";
  color?: "default" | "sub" | "mute" | "white" | "primary" | "danger";
}

export const Typography = ({
  variant = "body",
  color = "default",
  className,
  style,
  ...props
}: TypographyProps) => {
  const variantClasses = {
    "large-title": "text-[34px] leading-[41px] font-bold tracking-tight",
    title: "text-[22px] leading-[28px] font-bold",
    headline: "text-[18px] leading-[24px] font-bold",
    body: "text-[15px] leading-[22px] font-medium",
    subhead: "text-[13px] leading-[18px] font-medium",
    caption: "text-[11px] leading-[14px] font-bold",
    button: "text-[16px] leading-[20px] font-bold",
  };

  const colorClasses = {
    default: "text-ink",
    sub: "text-ink-sub",
    mute: "text-ink-mute",
    white: "text-white",
    primary: "text-primary",
    danger: "text-budget-danger",
  };

  return (
    <Text
      className={cn(variantClasses[variant], colorClasses[color], className)}
      style={[{ fontFamily: "Pretendard" }, style]}
      {...props}
    />
  );
};
