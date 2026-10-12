import { PastTripListItem } from "@/components/trip/PastTripListItem";
import { COLORS } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useTrips } from "@/hooks/trip/useTrips";
import { supabase } from "@/services/supabase";
import { Edit2, User } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function MyPageScreen() {
  const { user } = useAuth();
  const { data: trips, isLoading } = useTrips();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(
    user?.user_metadata?.nickname || "",
  );
  const [updating, setUpdating] = useState(false);

  const displayName =
    user?.user_metadata?.nickname || user?.email?.split("@")[0] || "여행자";
  const currentYear = new Date().getFullYear().toString();

  const yearlyTrips =
    trips?.filter((trip) => trip.start_date.startsWith(currentYear)) || [];
  const todayString = new Date().toISOString().split("T")[0];
  const pastTrips = trips?.filter((trip) => trip.end_date < todayString) || [];

  const handleUpdateNickname = async () => {
    if (!nicknameInput.trim()) {
      Alert.alert("알림", "닉네임을 입력해주세요.");
      return;
    }
    setUpdating(true);
    const { error } = await supabase.auth.updateUser({
      data: { nickname: nicknameInput.trim() },
    });
    setUpdating(false);

    if (error) {
      Alert.alert("오류", "닉네임 업데이트에 실패했습니다.");
    } else {
      setIsEditingName(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-bg">
        <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-bg">
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-6 rounded-3xl border border-slate-border shadow-sm mb-6 flex-row items-center">
          <View className="w-16 h-16 bg-primary/10 rounded-full justify-center items-center mr-4">
            <User size={32} color={COLORS.primary.DEFAULT} />
          </View>
          <View className="flex-1">
            {isEditingName ? (
              <View className="flex-row items-center">
                <TextInput
                  value={nicknameInput}
                  onChangeText={setNicknameInput}
                  className="flex-1 border-b border-primary p-1 text-base text-slate-text mr-2 font-bold"
                  placeholder="새 닉네임"
                  autoFocus
                />
                <Pressable
                  onPress={handleUpdateNickname}
                  disabled={updating}
                  className="bg-primary px-3 py-1.5 rounded-lg active:opacity-80"
                >
                  <Text className="text-white text-xs font-bold">
                    {updating ? "..." : "저장"}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Text className="text-xl font-bold text-slate-text mr-2">
                  {displayName}
                </Text>
                <Pressable
                  onPress={() => {
                    setNicknameInput(displayName);
                    setIsEditingName(true);
                  }}
                  className="p-1"
                >
                  <Edit2 size={16} color={COLORS.slate.inactive} />
                </Pressable>
              </View>
            )}
            <Text className="text-sm text-slate-inactive mt-1">
              {user?.email}
            </Text>
          </View>
        </View>

        <View className="bg-slate-800 p-6 rounded-3xl mb-8 shadow-md">
          <Text className="text-white/80 text-sm font-medium mb-1">
            {currentYear}년의 기록
          </Text>
          <Text className="text-white text-2xl font-bold mb-4">
            올해{" "}
            <Text className="text-primary-light">{yearlyTrips.length}</Text>번의
            여행을 다녀왔어요!
          </Text>
          <Text className="text-white/60 text-xs">
            여행별 상세 지출액은 아래 히스토리 카드에서 확인하세요.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-bold text-slate-text mb-4 ml-1">
            지난 여행 히스토리
          </Text>
          {pastTrips.length === 0 ? (
            <View className="bg-white p-8 rounded-2xl border border-slate-border items-center mt-2 shadow-sm">
              <Text className="text-slate-inactive text-sm font-medium">
                아직 종료된 여행 기록이 없습니다.
              </Text>
            </View>
          ) : (
            pastTrips.map((trip) => (
              <PastTripListItem key={trip.id} item={trip} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
