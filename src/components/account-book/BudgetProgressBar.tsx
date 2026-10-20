import { cn } from "@/utils/cn";
import { View } from "react-native";
import { Typography } from "../common/Typography";

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

  return (
    <View className="w-full">
      <View className="flex-row justify-between mb-3">
        <View>
          <Typography variant="caption" color="sub" className="mb-1">
            사용 금액
          </Typography>
          <Typography variant="headline">
            {totalSpent.toLocaleString()} {currency}
          </Typography>
        </View>

        <View className="items-end">
          <Typography variant="caption" color="sub" className="mb-1">
            남은 예산 (총 {totalBudget.toLocaleString()})
          </Typography>
          <Typography
            variant="headline"
            color={balance < 0 ? "danger" : "primary"}
          >
            {balance.toLocaleString()} {currency}
          </Typography>
        </View>
      </View>

      <View className="w-full h-3 bg-fill rounded-full overflow-hidden">
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
        <Typography
          variant="caption"
          color="danger"
          className="mt-2 font-semibold text-right"
        >
          예산을 초과했습니다!
        </Typography>
      )}
    </View>
  );
};
