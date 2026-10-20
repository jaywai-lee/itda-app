import { TabHeader } from "@/components/common/TabHeader";
import { COLORS } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { Redirect, router, Tabs } from "expo-router";
import { Calendar, User, Wallet } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { session, loading } = useAuth();
  const insets = useSafeAreaInsets();

  const handleOpenSettings = () => {
    router.push("/settings");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-canvas">
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
        header: ({ options, route }) => (
          <TabHeader
            title={
              typeof options.headerTitle === "string"
                ? options.headerTitle
                : (options.title ?? route.name)
            }
            icon={options.tabBarIcon?.({
              focused: true,
              color: COLORS.primary.DEFAULT,
              size: 20,
            })}
            onPressSettings={handleOpenSettings}
          />
        ),
        tabBarActiveTintColor: COLORS.primary.DEFAULT,
        tabBarInactiveTintColor: COLORS.slate.inactive,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          backgroundColor: "#FFFFFF",
          height: 56 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom,
        },
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
