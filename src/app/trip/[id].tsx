import { BudgetProgressBar } from "@/components/account-book/BudgetProgressBar";
import { CreateExpenseModal } from "@/components/expense/CreateExpenseModal";
import { COLORS } from "@/constants/colors";
import { useExpenses } from "@/hooks/expense/useExpenses";
import { useTrips } from "@/hooks/trip/useTrips";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Plus } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: trips } = useTrips();
  const trip = trips?.find((t) => t.id === id);
  const { data: expenses, isLoading } = useExpenses(id);

  if (!trip) return null;

  const totalSpent = expenses?.reduce((acc, cur) => acc + cur.amount, 0) || 0;

  return (
    <View className="flex-1 bg-slate-bg">
      <View className="flex-row items-center justify-between px-4 pt-14 pb-4 bg-white border-b border-slate-border shadow-sm z-10">
        <Pressable
          onPress={() => router.back()}
          className="p-2 -ml-2 active:opacity-70"
        >
          <ChevronLeft size={28} color={COLORS.slate.text} />
        </Pressable>
        <Text className="text-lg font-bold text-slate-text">{trip.name}</Text>
        <View className="w-10" />
      </View>

      <View className="p-4 flex-1">
        <View className="bg-white rounded-2xl p-4 mb-5 border border-slate-border shadow-sm">
          <BudgetProgressBar
            totalBudget={trip.total_budget}
            totalSpent={totalSpent}
            currency={trip.currency}
          />
        </View>

        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-slate-text">지출 내역</Text>
          <Pressable
            onPress={() => setIsModalVisible(true)}
            className="bg-primary flex-row items-center px-3 py-2 rounded-xl active:opacity-80"
          >
            <Plus size={16} color="#FFFFFF" />
            <Text className="text-white font-semibold ml-1 text-xs">
              지출 추가
            </Text>
          </Pressable>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary.DEFAULT}
            className="mt-10"
          />
        ) : expenses?.length === 0 ? (
          <View className="py-10 items-center">
            <Text className="text-slate-inactive">
              아직 등록된 지출이 없습니다.
            </Text>
          </View>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="bg-white p-4 rounded-xl border border-slate-border mb-3 flex-row justify-between items-center">
                <View>
                  <Text className="text-sm font-bold text-slate-text mb-1">
                    {item.category_id}
                  </Text>
                  {item.memo && (
                    <Text className="text-xs text-slate-inactive">
                      {item.memo}
                    </Text>
                  )}
                </View>
                <Text className="text-base font-bold text-slate-text">
                  {item.amount.toLocaleString()} {item.currency}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      <CreateExpenseModal
        tripId={trip.id}
        currency={trip.currency}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
}
