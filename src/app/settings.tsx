import { COLORS } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react-native";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-slate-bg" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 pb-4 border-b border-slate-border bg-white">
        <Pressable
          onPress={() => router.back()}
          className="p-2 -ml-2 active:opacity-70"
        >
          <ChevronLeft size={28} color={COLORS.slate?.text || "#1E293B"} />
        </Pressable>
        <Text className="text-lg font-bold text-slate-text">설정</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 pt-4">
        <View className="bg-white border-y border-slate-border mb-6">
          <Pressable className="flex-row justify-between items-center p-4 border-b border-slate-border active:bg-slate-50">
            <Text className="text-base text-slate-text font-medium">
              통화 및 환율 관리
            </Text>
            <ChevronRight
              size={20}
              color={COLORS.slate?.inactive || "#94a3b8"}
            />
          </Pressable>
          <Pressable className="flex-row justify-between items-center p-4 border-b border-slate-border active:bg-slate-50">
            <Text className="text-base text-slate-text font-medium">
              카테고리 커스터마이징
            </Text>
            <ChevronRight
              size={20}
              color={COLORS.slate?.inactive || "#94a3b8"}
            />
          </Pressable>
          <Pressable className="flex-row justify-between items-center p-4 active:bg-slate-50">
            <Text className="text-base text-slate-text font-medium">
              데이터 CSV 내보내기
            </Text>
            <ChevronRight
              size={20}
              color={COLORS.slate?.inactive || "#94a3b8"}
            />
          </Pressable>
        </View>

        <View className="bg-white border-y border-slate-border mb-8">
          <Pressable
            onPress={handleLogout}
            className="flex-row items-center p-4 active:bg-slate-50"
          >
            <LogOut size={20} color={COLORS.budget?.danger || "#EF4444"} />
            <Text className="text-base text-budget-danger font-medium ml-3">
              로그아웃
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
