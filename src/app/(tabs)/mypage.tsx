import { Text, View } from "react-native";

export default function MyPageScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-bg p-4">
      <View className="card-container items-center w-full max-w-sm">
        <Text className="text-xl font-bold text-slate-text">내 정보</Text>
        <Text className="text-sm text-slate-inactive mt-1">
          사용자 프로필 및 설정 내역입니다.
        </Text>
      </View>
    </View>
  );
}
