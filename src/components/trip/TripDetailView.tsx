import { COLORS } from "@/constants/colors";
import { Expense, Trip } from "@/types/database";
import { ChevronLeft, Plus } from "lucide-react-native";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { Button } from "../common/Button";
import { Typography } from "../common/Typography";
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
  showKrwConversion: boolean;
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
    <View className="flex-1 bg-canvas">
      <View className="flex-row items-center justify-between px-5 pt-14 pb-3 bg-surface border-b border-line shadow-sm z-10">
        <Pressable
          onPress={handlers.onGoBack}
          className="p-2 -ml-2 active:opacity-70"
        >
          <ChevronLeft size={28} color={COLORS.ink.DEFAULT} />
        </Pressable>
        <Typography variant="headline" className="font-bold">
          {state.trip.name}
        </Typography>
        <View className="w-10" />
      </View>

      <View className="p-5 flex-1">
        <TripSummaryCard
          trip={state.trip}
          expenses={state.expenses}
          totalSpent={state.totalSpent}
        />

        <View className="flex-row justify-between items-center mb-4">
          <Typography variant="title">지출 내역</Typography>
          <Button
            variant="solid"
            onPress={handlers.onOpenCreateModal}
            className="py-2.5 px-4 shadow-sm"
          >
            <View className="flex-row items-center justify-center">
              <Plus
                size={16}
                color="#FFFFFF"
                strokeWidth={3}
                className="mr-1"
              />
              <Typography variant="subhead" color="white">
                지출 추가
              </Typography>
            </View>
          </Button>
        </View>

        {state.isLoading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary.DEFAULT}
            className="mt-10"
          />
        ) : state.expenses?.length === 0 ? (
          <View className="flex-1 justify-center items-center pb-20">
            <View className="bg-surface rounded-card p-8 border border-line items-center w-full shadow-sm">
              <Typography variant="headline" className="mb-2">
                지출 내역이 없어요
              </Typography>
              <Typography variant="body" color="sub" className="text-center">
                우측 상단의 추가 버튼을 눌러{"\n"}첫 지출을 기록해 보세요.
              </Typography>
            </View>
          </View>
        ) : (
          <FlatList
            data={state.expenses}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <ExpenseListItem
                item={item}
                tripStartDate={state.trip.start_date}
                onPress={handlers.onOpenEditModal}
                showKrwConversion={state.showKrwConversion}
              />
            )}
          />
        )}
      </View>

      <CreateExpenseModal
        tripId={state.trip.id}
        currency={state.trip.currency}
        customExchangeRate={state.trip.custom_exchange_rate}
        totalBudget={state.trip.total_budget}
        currentTotalSpent={state.totalSpent}
        visible={state.isModalVisible}
        onClose={handlers.onCloseModal}
        editTarget={state.selectedExpense}
      />
    </View>
  );
};
