import { useExpenses } from "@/hooks/expense/useExpenses";
import { Trip } from "@/types/database";
import { useRouter } from "expo-router";
import { Pencil, Trash2 } from "lucide-react-native";
import { GestureResponderEvent, Pressable, View } from "react-native";
import { BudgetProgressBar } from "../account-book/BudgetProgressBar";
import { Card } from "../common/Card";
import { Chip } from "../common/Chip";
import { Typography } from "../common/Typography";

interface TripListItemProps {
  item: Trip;
  onEdit: (trip: Trip, e: GestureResponderEvent) => void;
  onDelete: (tripId: string, e: GestureResponderEvent) => void;
}

export const TripListItem = ({ item, onDelete, onEdit }: TripListItemProps) => {
  const router = useRouter();

  const { data: expenses } = useExpenses(item.id);
  const totalSpent = expenses?.reduce((acc, cur) => acc + cur.amount, 0) || 0;

  return (
    <Card
      onPress={() =>
        router.push({
          pathname: "/trip/[id]",
          params: { id: item.id },
        })
      }
      className="mb-4"
    >
      <View className="flex-row justify-between items-center mb-3">
        <Typography
          variant="headline"
          numberOfLines={1}
          ellipsizeMode="tail"
          className="flex-1 mr-3"
        >
          {item.name}
        </Typography>

        <View className="flex-row items-center gap-1.5">
          <Pressable
            onPress={(e) => onEdit(item, e)}
            className="p-2.5 rounded-full bg-fill border border-line active:opacity-60"
            hitSlop={8}
          >
            <Pencil size={14} color="#64748B" />
          </Pressable>
          <Pressable
            onPress={(e) => onDelete(item.id, e)}
            className="p-2.5 rounded-full bg-danger-soft border border-transparent active:opacity-60"
            hitSlop={8}
          >
            <Trash2 size={14} color="#EF4444" />
          </Pressable>
        </View>
      </View>

      <View className="flex-row items-center mb-4">
        <Chip
          label={`${item.start_date} ~ ${item.end_date}`}
          variant="default"
        />
      </View>

      <BudgetProgressBar
        totalBudget={item.total_budget}
        totalSpent={totalSpent}
        currency={item.currency}
      />
    </Card>
  );
};
