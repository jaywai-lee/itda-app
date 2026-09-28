import { Text, View } from "react-native";

export default function AccountBookScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-bg p-4">
      <View className="card-container items-center w-full max-w-sm">
        <Text className="text-xl font-bold text-slate-text">여행 가계부</Text>
        <Text className="text-sm text-slate-inactive mt-1">
          예산 및 지출 내역이 여기에 표시됩니다.
        </Text>
      </View>
    </View>
  );
}
