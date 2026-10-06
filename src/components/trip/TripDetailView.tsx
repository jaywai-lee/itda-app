import { COLORS } from "@/constants/colors";
import { Expense, Trip } from "@/types/database";
import { ChevronLeft, Plus } from "lucide-react-native";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { CreateExpenseModal } from "../expense/CreateExpenseModal";
import { ExpenseListItem } from "../expense/ExpenseListItem";
import { TripSummaryCard } from "./TripSummaryCard";

export interface TripDetailViewState {
  trip: Trip;
  expenses: Expense[] | undefined;
  isLoading: boolean;
  totalSpent: number;
  isModalVisible: boolean;
  selectedExpense: Expense | null;
}

export interface TripDetailViewHanlders {
  onGoBack: () => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (expense: Expense) => void;
  onCloseModal: () => void;
}

interface TripDetailViewProps {
  state: TripDetailViewState;
  handlers: TripDetailViewHanlders;
}

export const TripDetailView = ({ state, handlers }: TripDetailViewProps) => {
  return (
    <View className="flex-1 pt-5 bg-slate-bg">
      <View className="flex-row items-center justify-between px-4 pt-14 pb-2 bg-white border-b border-slate-border shadow-sm z-10">
        <Pressable
          onPress={handlers.onGoBack}
          className="p-2 -ml-2 active:opacity-70"
        >
          <ChevronLeft size={28} color={COLORS.slate.text} />
        </Pressable>
        <Text className="text-lg font-bold text-slate-text">
          {state.trip.name}
        </Text>
        <View className="w-10" />
      </View>

      <View className="p-4 flex-1">
        <TripSummaryCard
          trip={state.trip}
          expenses={state.expenses}
          totalSpent={state.totalSpent}
        />

        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-slate-text">지출 내역</Text>
          <Pressable
            onPress={handlers.onOpenCreateModal}
            className="bg-primary flex-row items-center px-3 py-2 rounded-xl active:opacity-80"
          >
            <Plus size={16} color="#FFFFFF" />
            <Text className="text-white font-semibold ml-1 text-xs">
              지출 추가
            </Text>
          </Pressable>
        </View>

        {state.isLoading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary.DEFAULT}
            className="mt-10"
          />
        ) : state.expenses?.length === 0 ? (
          <View className="py-10 items-center">
            <Text className="text-slate-inactive">
              아직 등록된 지출이 없습니다.
            </Text>
          </View>
        ) : (
          <FlatList
            data={state.expenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExpenseListItem item={item} onPress={handlers.onOpenEditModal} />
            )}
          />
        )}
      </View>

      <CreateExpenseModal
        tripId={state.trip.id}
        currency={state.trip.currency}
        totalBudget={state.trip.total_budget}
        currentTotalSpent={state.totalSpent}
        visible={state.isModalVisible}
        onClose={handlers.onCloseModal}
        editTarget={state.selectedExpense}
      />
    </View>
  );
};
