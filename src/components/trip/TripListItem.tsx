import { COLORS } from "@/constants/colors";
import { useExpenses } from "@/hooks/expense/useExpenses";
import { Trip } from "@/types/database";
import { useRouter } from "expo-router";
import { Calendar, Pencil, Trash2 } from "lucide-react-native";
import { GestureResponderEvent, Pressable, Text, View } from "react-native";
import { BudgetProgressBar } from "../account-book/BudgetProgressBar";

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
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/trip/[id]",
          params: { id: item.id },
        })
      }
      className="bg-white rounded-2xl p-4 mb-3 border border-slate-border shadow-sm active:opacity-70"
    >
      <View className="flex-row justify-between items-start mb-1">
        <Text className="text-lg font-bold text-slate-text flex-1">
          {item.name}
        </Text>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={(e) => onEdit(item, e)}
            className="p-1 active:opacity-70"
          >
            <Pencil size={18} color={COLORS.slate.inactive} />
          </Pressable>
          <Pressable
            onPress={(e) => onDelete(item.id, e)}
            className="p-1 active:opacity-70"
          >
            <Trash2 size={18} color={COLORS.budget.danger} />
          </Pressable>
        </View>
      </View>

      <View className="flex-row items-center mb-2">
        <Calendar size={14} color={COLORS.slate.inactive} />
        <Text className="text-xs text-slate-inactive ml-1">
          {item.start_date} ~ {item.end_date}
        </Text>
      </View>

      <BudgetProgressBar
        totalBudget={item.total_budget}
        totalSpent={totalSpent}
        currency={item.currency}
      />
    </Pressable>
  );
};
