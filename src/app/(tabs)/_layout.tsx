import { COLORS } from "@/constants/colors";
import { router, Tabs } from "expo-router";
import { Calendar, Settings, User, Wallet } from "lucide-react-native";
import { Pressable } from "react-native";

export default function TabLayout() {
  const handleOpenSettings = () => {
    router.push("/settings" as any);
  };
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary.DEFAULT,
        tabBarInactiveTintColor: COLORS.slate.inactive,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.slate.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerRight: () => (
          <Pressable
            onPress={handleOpenSettings}
            className="mr-4 p-1 active:opacity-70"
          >
            <Settings size={22} color={COLORS.slate.text} />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "가계부",
          headerTitle: "여행 가계부",
          tabBarIcon: ({ color }) => <Wallet size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="itinerary"
        options={{
          title: "일정",
          headerTitle: "여행 일정",
          tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: "마이페이지",
          headerTitle: "내 정보",
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
