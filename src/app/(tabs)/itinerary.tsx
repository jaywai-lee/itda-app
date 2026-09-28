import { Text, View } from "react-native";

export default function ItineraryScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-bg p-4">
      <View className="card-container items-center w-full max-w-sm">
        <Text className="text-xl font-bold text-slate-text">일정 & 지도</Text>
        <Text className="text-sm text-slate-inactive mt-1">
          여행 일정과 Google Map이 여기에 표시됩니다.
        </Text>
      </View>
    </View>
  );
}
