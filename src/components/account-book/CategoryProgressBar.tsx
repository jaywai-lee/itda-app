import { COLORS } from "@/constants/colors";
import { Expense } from "@/types/database";
import { useMemo } from "react";
import { Text, View } from "react-native";

interface CategoryProgressBarProps {
  expenses: Expense[];
  currency: string;
}

export const CategoryProgressBar = ({
  expenses,
  currency,
}: CategoryProgressBarProps) => {
  const { totalSpent, sortedCategories } = useMemo(() => {
    let total = 0;
    const categoryMap: Record<string, { amount: number; color: string }> = {};

    expenses.forEach((exp) => {
      total += exp.amount;
      const catName = exp.categories?.name || "기타";
      const catColor = exp.categories?.color || COLORS.slate.inactive;

      if (!categoryMap[catName]) {
        categoryMap[catName] = { amount: 0, color: catColor };
      }
      categoryMap[catName].amount += exp.amount;
    });

    const sorted = Object.entries(categoryMap)
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        color: data.color,
        percentage: total > 0 ? (data.amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return { totalSpent: total, sortedCategories: sorted };
  }, [expenses]);

  if (totalSpent === 0) return null;

  return (
    <View className="mt-4">
      <Text className="text-sm font-bold text-slate-text mb-2">
        카테고리별 지출 비중
      </Text>

      <View className="h-3 flex-row rounded-full overflow-hidden bg-slate-bg mb-3">
        {sortedCategories.map((cat, index) => (
          <View
            key={cat.name}
            style={{
              width: `${cat.percentage}%`,
              backgroundColor: cat.color,
              borderTopLeftRadius: index === 0 ? 9999 : 0,
              borderBottomLeftRadius: index === 0 ? 9999 : 0,
              borderTopRightRadius:
                index === sortedCategories.length - 1 ? 9999 : 0,
              borderBottomRightRadius:
                index === sortedCategories.length - 1 ? 9999 : 0,
            }}
          />
        ))}
      </View>

      <View className="flex-row flex-wrap gap-x-4 gap-y-2">
        {sortedCategories.map((cat) => (
          <View key={cat.name} className="flex-row items-center">
            <View
              className="w-2.5 h-2.5 rounded-full mr-1.5"
              style={{ backgroundColor: cat.color }}
            />
            <Text className="text-xs text-slate-text font-semibold mr-1">
              {cat.name}
            </Text>
            <Text className="text-xs text-slate-inactive">
              {Math.round(cat.percentage)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
