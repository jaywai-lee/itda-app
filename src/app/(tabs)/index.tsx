import { BudgetProgressBar } from "@/components/account-book/BudgetProgressBar";
import { CreateTripModal } from "@/components/trip/CreateTripModal";
import { COLORS } from "@/constants/colors";
import { useTrips } from "@/hooks/trip/useTrips";
import { useRouter } from "expo-router";
import { Calendar, Plus } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

export default function AccountBookScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: trips, isLoading } = useTrips();
  const router = useRouter();

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-BG">
        <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-BG p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-slate-text">내 여행 목록</Text>
        <Pressable
          onPress={handleOpenModal}
          className="bg-primary flex-row items-center px-3 py-2 rounded-xl active:opacity-80"
        >
          <Plus size={18} color="#FFFFFF" />
          <Text className="text-white font-semibold ml-1 text-xs">
            여행 추가
          </Text>
        </Pressable>
      </View>

      {!trips || trips.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <View className="bg-white rounded-2xl p-6 border border-slate-border items-center w-full max-w-sm shadow-sm">
            <Text className="text-base font-semibold text-slate-text mb-1">
              등록된 여행이 없습니다.
            </Text>
            <Text className="text-xs text-slate-inactive mb-4">
              새로운 여행을 등록하고 가계부를 시작해 보세요!
            </Text>
            <Pressable
              onPress={handleOpenModal}
              className="bg-primary px-4 py-2 rounded-xl active:opacity-80"
            >
              <Text className="text-white text-xs font-semibold">
                첫 여행 생성하기
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/trip/${item.id}` as any)}
              className="bg-white rounded-2xl p-4 mb-3 border border-slate-border shadow-sm active:opacity-70"
            >
              <Text className="text-lg font-bold text-slate-text mb-1">
                {item.name}
              </Text>
              <View className="flex-row items-center mb-2">
                <Calendar size={14} color={COLORS.slate.inactive} />
                <Text className="text-xs text-slate-inactive ml-1">
                  {item.start_date} ~ {item.end_date}
                </Text>
              </View>

              <BudgetProgressBar
                totalBudget={item.total_budget}
                totalSpent={0}
                currency={item.currency}
              />
            </Pressable>
          )}
        />
      )}

      <CreateTripModal visible={isModalVisible} onClose={handleCloseModal} />
    </View>
  );
}
