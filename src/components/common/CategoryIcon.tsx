import { CATEGORY_ICONS } from "@/constants/categoryPresets";
import { COLORS } from "@/constants/colors";

interface CategoryIconProps {
  name?: string | null;
  color?: string | null;
  size?: number;
}

export const CategoryIcon = ({ name, color, size = 20 }: CategoryIconProps) => {
  const Icon =
    (name && CATEGORY_ICONS[name]) || CATEGORY_ICONS["more-horizontal"];
  return <Icon size={size} color={color ?? COLORS.slate.inactive} />;
};
