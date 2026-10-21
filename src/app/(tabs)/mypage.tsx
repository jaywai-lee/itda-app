import { Typography } from "@/components/common/Typography";
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
    <View className="flex-1 bg-fill">
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="bg-surface p-6 rounded-3xl border border-line shadow-sm mb-6 flex-row items-center">
          <View className="w-16 h-16 bg-primary/10 rounded-full justify-center items-center mr-4">
            <User size={32} color={COLORS.primary.DEFAULT} />
          </View>
          <View className="flex-1">
            {isEditingName ? (
              <View className="flex-row items-center">
                <TextInput
                  value={nicknameInput}
                  onChangeText={setNicknameInput}
                  placeholderTextColor={COLORS.ink.mute}
                  className="flex-1 border-b border-primary p-1 text-base text-ink mr-2 font-bold"
                  placeholder="새 닉네임"
                  autoFocus
                />
                <Pressable
                  onPress={handleUpdateNickname}
                  disabled={updating}
                  className="bg-primary px-3 py-1.5 rounded-lg active:opacity-80 transition-all"
                >
                  <Typography className="text-white text-xs font-bold">
                    {updating ? "..." : "저장"}
                  </Typography>
                </Pressable>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Typography className="text-xl font-bold text-ink mr-2">
                  {displayName}
                </Typography>
                <Pressable
                  onPress={() => {
                    setNicknameInput(displayName);
                    setIsEditingName(true);
                  }}
                  className="p-1 active:bg-fill rounded-md transition-all"
                >
                  <Edit2 size={16} color={COLORS.ink.mute} />
                </Pressable>
              </View>
            )}
            <Typography className="text-sm text-ink-mute mt-1">
              {user?.email}
            </Typography>
          </View>
        </View>

        <View className="bg-ink p-6 rounded-3xl mb-8 shadow-md">
          <Typography className="text-white/80 text-sm font-medium mb-1">
            {currentYear}년의 기록
          </Typography>
          <Typography className="text-white text-2xl font-bold mb-4">
            올해{" "}
            <Typography className="text-primary-light">
              {yearlyTrips.length}
            </Typography>
            번의 여행을 다녀왔어요!
          </Typography>
          <Typography className="text-white/60 text-xs">
            여행별 상세 지출액은 아래 히스토리 카드에서 확인하세요.
          </Typography>
        </View>

        <View className="mb-6">
          <Typography className="text-lg font-bold text-ink mb-4 ml-1">
            지난 여행 히스토리
          </Typography>
          {pastTrips.length === 0 ? (
            <View className="bg-surface p-8 rounded-2xl border border-line items-center mt-2 shadow-sm">
              <Typography className="text-ink-mute text-sm font-medium">
                아직 종료된 여행 기록이 없습니다.
              </Typography>
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
