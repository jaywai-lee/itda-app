import { Expense, Trip } from "@/types/database";
import { View } from "react-native";
import { BudgetProgressBar } from "../account-book/BudgetProgressBar";
import { CategoryProgressBar } from "../account-book/CategoryProgressBar";

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
    <View className="bg-white rounded-2xl p-4 mb-5 border border-slate-border shadow-sm">
      <BudgetProgressBar
        totalBudget={trip.total_budget}
        totalSpent={totalSpent}
        currency={trip.currency}
      />

      {expenses && expenses.length > 0 && (
        <View className="py-3">
          <CategoryProgressBar expenses={expenses} currency={trip.currency} />
        </View>
      )}
    </View>
  );
};
