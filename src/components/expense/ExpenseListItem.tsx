import { Expense } from "@/types/database";
import { Pressable, Text, View } from "react-native";

interface ExpenseListItemProps {
  item: Expense;
  onPress: (expense: Expense) => void;
}

export const ExpenseListItem = ({ item, onPress }: ExpenseListItemProps) => {
  return (
    <Pressable
      onPress={() => onPress(item)}
      className="bg-white p-4 rounded-xl border border-slate-border mb-3 flex-row justify-between items-center active:opacity-75"
    >
      <View>
        <Text className="text-sm font-bold text-slate-text mb-1">
          {item.categories?.name || "기타"}
        </Text>
        {item.memo && (
          <Text className="text-xs text-slate-inactive">{item.memo}</Text>
        )}
      </View>

      <View className="items-end">
        <Text className="text-base font-bold text-slate-text">
          {item.amount.toLocaleString()} {item.currency}
        </Text>
        {item.currency !== "KRW" && item.amount_krw != null && (
          <Text className="text-xs text-slate-inactive mt-0.5">
            ≈ {item.amount_krw.toLocaleString()} KRW
          </Text>
        )}
      </View>
    </Pressable>
  );
};
