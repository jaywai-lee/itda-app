import { TestMapView } from "@/components/TestMapView";
import { View } from "react-native";

export default function ItineraryScreen() {
  return (
    <View className="flex-1 w-full h-full bg-slate-bg">
      <TestMapView />
    </View>
  );
}
