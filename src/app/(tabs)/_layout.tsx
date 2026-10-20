import { COLORS } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { Redirect, router, Tabs } from "expo-router";
import { Calendar, Settings, User, Wallet } from "lucide-react-native";
import { ActivityIndicator, Pressable, View } from "react-native";

export default function TabLayout() {
  const { session, loading } = useAuth();

  const handleOpenSettings = () => {
    router.push("/settings");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-bg">
        <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href={"/login"} />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary.DEFAULT,
        tabBarInactiveTintColor: COLORS.slate.inactive,
        // 💡 탭바 디자인 고도화: 테두리 제거 및 부드러운 그림자 추가
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          backgroundColor: "#FFFFFF",
          height: 85,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: COLORS.slate.bg,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 17,
          color: COLORS.slate.text,
        },
        headerRight: () => (
          <Pressable
            onPress={handleOpenSettings}
            className="mr-5 p-2 active:opacity-60 bg-white rounded-full border border-slate-border shadow-sm"
          >
            <Settings size={20} color={COLORS.slate.text} />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "가계부",
          headerTitle: "여행 가계부",
          tabBarIcon: ({ color }) => (
            <Wallet
              size={22}
              color={typeof color === "string" ? color : COLORS.slate.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="itinerary"
        options={{
          title: "일정",
          headerTitle: "여행 일정",
          tabBarIcon: ({ color }) => (
            <Calendar
              size={22}
              color={typeof color === "string" ? color : COLORS.slate.inactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: "마이페이지",
          headerTitle: "내 정보",
          tabBarIcon: ({ color }) => (
            <User
              size={22}
              color={typeof color === "string" ? color : COLORS.slate.inactive}
            />
          ),
        }}
      />
    </Tabs>
  );
}
