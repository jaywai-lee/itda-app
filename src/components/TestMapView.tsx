import { Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { COLORS } from "../constants/colors";

const DEFAULT_REGION = {
  latitude: 35.6585805,
  longitude: 139.7454329,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

export const TestMapView = () => {
  return (
    <View className="flex-1 w-full h-full relative">
      <MapView
        style={{ width: "100%", height: "100%" }}
        initialRegion={DEFAULT_REGION}
      >
        <Marker
          coordinate={{
            latitude: DEFAULT_REGION.latitude,
            longitude: DEFAULT_REGION.longitude,
          }}
          title="도쿄 타워"
          description="Phase 1 지도 마커 테스트"
          pinColor={COLORS.primary.DEFAULT}
        />
      </MapView>

      <View className="absolute top-4 left-4 right-4 bg-white/90 p-3 rounded-xl border border-slate-border shadow-sm z-10">
        <Text className="text-xs font-semibold text-slate-text text-center">
          📍 지도 렌더링 테스트 중 (도쿄 타워)
        </Text>
      </View>
    </View>
  );
};
