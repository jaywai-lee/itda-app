import {
  Bed,
  Bus,
  Camera,
  Car,
  Coffee,
  Ellipsis,
  Gift,
  LucideIcon,
  Map as MapIcon,
  Music,
  Plane,
  ShoppingBag,
  Ticket,
  Utensils,
} from "lucide-react-native";

export const CATEGORY_COLORS = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#64748B", // Slate
  "#14B8A6", // Teal
];

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  utensils: Utensils,
  coffee: Coffee,
  "shopping-bag": ShoppingBag,
  bus: Bus,
  plane: Plane,
  bed: Bed,
  camera: Camera,
  ticket: Ticket,
  gift: Gift,
  car: Car,
  map: MapIcon,
  music: Music,
  "more-horizontal": Ellipsis,
};

export const CATEGORY_ICON_KEYS = Object.keys(CATEGORY_ICONS);
export const DEFAULT_CATEGORY_ICON = CATEGORY_ICON_KEYS[0];
export const DEFAULT_CATEGORY_COLOR = CATEGORY_COLORS[0];
