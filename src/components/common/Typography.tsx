import { cn } from "@/utils/cn";
import { Text, TextProps } from "react-native";

interface TypegraphyProps extends TextProps {
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
}: TypegraphyProps) => {
  const variantClasses = {
    "large-title": "text-large-title",
    title: "text-title",
    headline: "text-headline",
    body: "text-body",
    subhead: "text-subhead",
    caption: "text-caption",
    button: "text-button",
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
