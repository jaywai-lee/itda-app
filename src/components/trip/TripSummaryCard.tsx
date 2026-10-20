import { Expense, Trip } from "@/types/database";
import { View } from "react-native";
import { BudgetProgressBar } from "../account-book/BudgetProgressBar";
import { CategoryProgressBar } from "../account-book/CategoryProgressBar";
import { Card } from "../common/Card";

interface TripSummaryCardProps {
  trip: Trip;
  expenses: Expense[] | undefined;
  totalSpent: number;
}

export const TripSummaryCard = ({
  trip,
  expenses,
  totalSpent,
}: TripSummaryCardProps) => {
  return (
    <Card className="p-5 mb-6 shadow-sm" pressEffect="none">
      <BudgetProgressBar
        totalBudget={trip.total_budget}
        totalSpent={totalSpent}
        currency={trip.currency}
      />

      {expenses && expenses.length > 0 && (
        <View className="pt-5 mt-5 border-t border-line">
          <CategoryProgressBar expenses={expenses} />
        </View>
      )}
    </Card>
  );
};
