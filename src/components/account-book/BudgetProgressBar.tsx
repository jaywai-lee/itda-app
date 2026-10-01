import { cn } from "@/utils/cn";
import { Text, View } from "react-native";

interface BudgetProgressBarProps {
  totalBudget: number;
  totalSpent: number;
  currency: string;
}

export const BudgetProgressBar = ({
  totalBudget,
  totalSpent,
  currency,
}: BudgetProgressBarProps) => {
  const balance = totalBudget - totalSpent;
  const spentPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const safePercentage = Math.min(spentPercentage, 100);

  let statusColorClass = "bg-budget-safe";
  if (spentPercentage >= 100) {
    statusColorClass = "bg-budget-danger";
  } else if (spentPercentage >= 80) {
    statusColorClass = "bg-budget-warning";
  }

  return (
    <View className="w-full mt-3 border-t border-slate-border pt-3">
      <View className="flex-row justify-between mb-2">
        <View>
          <Text className="text-xs text-slate-inactive mb-0.5">사용 금액</Text>
          <Text className="text-sm font-bold text-slate-text">
            {totalSpent.toLocaleString()} {currency}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-xs text-slate-inactive mb-0.5">
            남은 예산 (총 {totalBudget.toLocaleString()})
          </Text>
          <Text
            className={cn(
              "text-sm font-bold",
              balance < 0 ? "text-budget-danger" : "text-primary",
            )}
          >
            {balance.toLocaleString()} {currency}
          </Text>
        </View>
      </View>

      <View className="w-full h-2.5 bg-slate-border rounded-full overflow-hidden">
        <View
          className={cn(
            "h-full rounded-full bg-budget-safe",
            spentPercentage >= 80 && "bg-budget-warning",
            spentPercentage >= 100 && "bg-budget-danger",
          )}
          style={{ width: `${safePercentage}%` }}
        />
      </View>

      {spentPercentage > 100 && (
        <Text className="text-xs text-budget-danger mt-1.5 font-semibold text-right">
          예산을 초과했습니다!
        </Text>
      )}
    </View>
  );
};
