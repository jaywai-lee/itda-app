import { COLORS } from "@/constants/colors";
import { useExpenses } from "@/hooks/expense/useExpenses";
import { Trip } from "@/types/database";
import { useRouter } from "expo-router";
import { Calendar } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { BudgetProgressBar } from "../account-book/BudgetProgressBar";

interface PastTripListItemProps {
  item: Trip;
}

export const PastTripListItem = ({ item }: PastTripListItemProps) => {
  const router = useRouter();

  const { data: expenses } = useExpenses(item.id);
  const totalSpent = expenses?.reduce((acc, cur) => acc + cur.amount, 0) || 0;

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/trip/[id]", params: { id: item.id } })
      }
      className="bg-white rounded-2xl p-4 mb-3 border border-slate-border shadow-sm active:opacity-70 opacity-90"
    >
      <Text className="text-lg font-bold text-slate-text mb-1">
        {item.name}
      </Text>

      <View className="flex-row items-center mb-3">
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
