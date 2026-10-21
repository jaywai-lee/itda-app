import { COLORS } from "@/constants/colors";
import { useExpenses } from "@/hooks/expense/useExpenses";
import { Trip } from "@/types/database";
import { useRouter } from "expo-router";
import { Calendar } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { BudgetProgressBar } from "../account-book/BudgetProgressBar";
import { Typography } from "../common/Typography";

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
      className="bg-surface rounded-2xl p-4 mb-3 border border-line shadow-sm active:bg-fill transition-all opacity-90"
    >
      <Typography className="text-lg font-bold text-ink mb-1">
        {item.name}
      </Typography>

      <View className="flex-row items-center mb-3">
        <Calendar size={14} color={COLORS.ink.mute} />
        <Typography className="text-xs text-ink-mute ml-1">
          {item.start_date} ~ {item.end_date}
        </Typography>
      </View>

      <BudgetProgressBar
        totalBudget={item.total_budget}
        totalSpent={totalSpent}
        currency={item.currency}
      />
    </Pressable>
  );
};
