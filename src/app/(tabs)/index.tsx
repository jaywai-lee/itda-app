import { Button } from "@/components/common/Button";
import { Typography } from "@/components/common/Typography";
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
      <View className="flex-1 justify-center items-center bg-canvas">
        <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-canvas px-5 pt-4 pb-0">
      <View className="flex-row justify-end items-center mb-6">
        <Button
          variant="solid"
          onPress={handleOpenCreateModal}
          className="py-2.5 px-4 shadow-sm"
        >
          <View className="flex-row gap-2">
            <Plus size={18} color="#FFFFFF" strokeWidth={3} />
            <Typography variant="subhead" color="white">
              새 여행
            </Typography>
          </View>
        </Button>
      </View>

      {!trips || trips.length === 0 ? (
        <View className="flex-1 justify-center items-center pb-20">
          <View className="bg-surface rounded-card p-8 border border-line items-center w-full max-w-sm shadow-sm">
            <View className="w-16 h-16 bg-fill-strong rounded-full items-center justify-center mb-5">
              <Plane size={32} color={COLORS.ink.mute} strokeWidth={1.5} />
            </View>
            <Typography variant="headline" className="mb-2">
              기록된 여행이 없어요
            </Typography>
            <Typography variant="body" color="sub" className="mb-6 text-center">
              새로운 여행을 추가하고{"\n"}예산과 지출을 꼼꼼히 관리해 보세요.
            </Typography>
            <Button
              variant="solid"
              onPress={handleOpenCreateModal}
              className="w-full"
            >
              첫 여행 시작하기
            </Button>
          </View>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
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
