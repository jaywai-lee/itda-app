import { CreateTripModal } from "@/components/trip/CreateTripModal";
import { TripListItem } from "@/components/trip/TripListItem";
import { COLORS } from "@/constants/colors";
import { useDeleteTrip } from "@/hooks/trip/useDeleteTrip";
import { useTrips } from "@/hooks/trip/useTrips";
import { Trip } from "@/types/database";
import { Plane, Plus } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  GestureResponderEvent,
  Pressable,
  Text,
  View,
} from "react-native";

export default function AccountBookScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const { data: trips, isLoading } = useTrips();
  const { mutate: deleteTrip } = useDeleteTrip();

  const handleOpenCreateModal = () => {
    setSelectedTrip(null);
    setIsModalVisible(true);
  };

  const handleOpenEditModal = (trip: Trip, e: GestureResponderEvent) => {
    e.stopPropagation();
    setSelectedTrip(trip);
    setIsModalVisible(true);
  };

  const handleDeleteTrip = (tripId: string, e: GestureResponderEvent) => {
    e.stopPropagation();
    Alert.alert(
      "여행 삭제",
      "이 여행과 관련된 모든 데이터가 삭제됩니다. 정말 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => {
            deleteTrip(tripId, {
              onSuccess: () => Alert.alert("성공", "여행이 삭제되었습니다."),
              onError: (e) => Alert.alert("오류", e.message),
            });
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-bg">
        <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-bg px-5 pt-2 pb-4">
      <View className="flex-row justify-between items-center mb-6">
        <Pressable
          onPress={handleOpenCreateModal}
          className="bg-primary flex-row items-center px-4 py-2.5 rounded-full active:opacity-80 shadow-sm"
        >
          <Plus size={18} color="#FFFFFF" strokeWidth={3} />
          <Text className="text-white font-bold ml-1 text-sm">새 여행</Text>
        </Pressable>
      </View>

      {!trips || trips.length === 0 ? (
        <View className="flex-1 justify-center items-center pb-20">
          <View className="bg-white rounded-3xl p-8 border border-slate-border/60 items-center w-full max-w-sm shadow-sm">
            <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-4 border border-slate-100">
              <Plane
                size={32}
                color={COLORS.slate.inactive}
                strokeWidth={1.5}
              />
            </View>
            <Text className="text-lg font-bold text-slate-text mb-2">
              기록된 여행이 없어요
            </Text>
            <Text className="text-sm text-slate-inactive mb-6 text-center leading-relaxed">
              새로운 여행을 추가하고{"\n"}예산과 지출을 꼼꼼히 관리해 보세요.
            </Text>
            <Pressable
              onPress={handleOpenCreateModal}
              className="bg-primary px-6 py-3.5 rounded-full active:opacity-80 shadow-sm"
            >
              <Text className="text-white text-sm font-bold">
                첫 여행 시작하기
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TripListItem
              item={item}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTrip}
            />
          )}
        />
      )}

      <CreateTripModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedTrip(null);
        }}
        editTarget={selectedTrip}
      />
    </View>
  );
}
