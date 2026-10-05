import { COLORS } from "@/constants/colors";
import { Itinerary } from "@/types/database";
import { cn } from "@/utils/cn";
import { GripVertical, MapPin, Pencil, Trash2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { ScaleDecorator } from "react-native-draggable-flatlist";

interface ItineraryListItemProps {
  item: Itinerary;
  index: number;
  isLast: boolean;
  isActive: boolean;
  drag: () => void;
  onEdit: (item: Itinerary) => void;
  onDelete: (id: string) => void;
}

export const ItineraryListItem = ({
  item,
  index,
  isLast,
  isActive,
  drag,
  onEdit,
  onDelete,
}: ItineraryListItemProps) => {
  return (
    <ScaleDecorator>
      <View className="flex-row mb-3 pl-2">
        <View className="items-center mr-3 mt-1.5">
          <View className="w-3 h-3 rounded-full bg-primary" />
          {!isLast && <View className="w-0.5 flex-1 bg-slate-border mt-1" />}
        </View>

        <View
          className={cn(
            "flex-1 bg-white p-3.5 rounded-xl border flex-row justify-between items-center",
            isActive
              ? "border-primary shadow-md"
              : "border-slate-border shadow-sm",
          )}
        >
          <Pressable
            onLongPress={drag}
            delayLongPress={150}
            className="mr-2 p-1 py-2 active:opacity-60"
          >
            <GripVertical size={16} color={COLORS.slate.inactive} />
          </Pressable>

          <View className="flex-1 pr-3">
            <View className="flex-row items-center mb-1">
              <MapPin
                size={12}
                color={COLORS.primary.DEFAULT}
                className="mr-1"
              />
              <Text className="font-bold ml-1 text-slate-text">
                {item.place_name}
              </Text>
            </View>
            {item.memo && (
              <Text
                className="text-xs text-slate-inactive mt-1 ml-5"
                numberOfLines={2}
              >
                {item.memo}
              </Text>
            )}
          </View>

          <View className="flex-row gap-3">
            <Pressable
              onPress={() => onEdit(item)}
              className="p-1 active:opacity-60"
            >
              <Pencil size={18} color={COLORS.slate.inactive} />
            </Pressable>
            <Pressable
              onPress={() => onDelete(item.id)}
              className="p-1 active:opacity-60"
            >
              <Trash2 size={18} color={COLORS.budget.danger} />
            </Pressable>
          </View>
        </View>
      </View>
    </ScaleDecorator>
  );
};
