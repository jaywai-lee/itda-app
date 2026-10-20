import { COLORS } from "@/constants/colors";
import { Itinerary } from "@/types/database";
import { cn } from "@/utils/cn";
import {
  GripVertical,
  MapPin,
  Pencil,
  Trash2,
  Wallet,
} from "lucide-react-native";
import { Pressable, View } from "react-native";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { Card } from "../common/Card";
import { Typography } from "../common/Typography";

interface ItineraryListItemProps {
  item: Itinerary;
  index: number;
  isLast: boolean;
  isActive: boolean;
  drag: () => void;
  onEdit: (item: Itinerary) => void;
  onDelete: (id: string) => void;
  onAddExpense: (itineraryId: string) => void;
  linkedExpensesSum: number;
  currency?: string;
}

export const ItineraryListItem = ({
  item,
  index,
  isLast,
  isActive,
  drag,
  onEdit,
  onDelete,
  onAddExpense,
  linkedExpensesSum,
  currency,
}: ItineraryListItemProps) => {
  return (
    <ScaleDecorator>
      <View className="flex-row pb-5 pr-1">
        <View className="items-center w-5 mr-3 relative">
          <View className="w-2.5 h-2.5 rounded-full bg-ink mt-[26px] z-10" />
          {!isLast && (
            <View className="absolute top-[34px] bottom-0 w-[2px] bg-line z-0" />
          )}
        </View>

        <Card
          className={cn(
            "flex-1 flex-row items-center p-4 mb-0",
            isActive && "border-ink shadow-md opacity-90",
          )}
          pressEffect="none"
        >
          <Pressable
            onLongPress={drag}
            delayLongPress={150}
            className="mr-2.5 p-1.5 active:opacity-60"
          >
            <GripVertical size={16} color={COLORS.ink.mute} />
          </Pressable>

          <View className="flex-1 pr-3">
            <View className="flex-row items-center mb-1">
              <MapPin size={12} color={COLORS.ink.DEFAULT} />
              <Typography
                variant="body"
                className="font-bold flex-1 ml-2"
                numberOfLines={1}
              >
                {item.place_name}
              </Typography>
            </View>
            {item.memo && (
              <Typography
                variant="subhead"
                color="sub"
                numberOfLines={2}
                className="ml-5"
              >
                {item.memo}
              </Typography>
            )}

            {linkedExpensesSum > 0 && (
              <View className="flex-row items-center mt-2.5 ml-4 bg-fill-strong self-start px-2 py-1 rounded-chip">
                <Wallet size={12} color={COLORS.ink.sub} />
                <Typography variant="caption" color="sub" className="ml-1.5">
                  {linkedExpensesSum.toLocaleString()} {currency}
                </Typography>
              </View>
            )}
          </View>

          <View className="flex-row gap-1.5">
            <Pressable
              onPress={() => onAddExpense(item.id)}
              className="p-2 rounded-full bg-primary/10 active:opacity-60"
            >
              <Wallet size={14} color={COLORS.primary.DEFAULT} />
            </Pressable>
            <Pressable
              onPress={() => onEdit(item)}
              className="p-2 rounded-full bg-fill active:bg-fill-strong"
            >
              <Pencil size={14} color={COLORS.ink.sub} />
            </Pressable>
            <Pressable
              onPress={() => onDelete(item.id)}
              className="p-2 rounded-full bg-danger-soft active:opacity-70"
            >
              <Trash2 size={14} color={COLORS.budget.danger} />
            </Pressable>
          </View>
        </Card>
      </View>
    </ScaleDecorator>
  );
};
