import { COLORS } from "@/constants/colors";
import { Itinerary } from "@/types/database";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface ItineraryMapViewProps {
  itineraries: Itinerary[];
}

interface ValidCoordinates {
  latitude: number;
  longitude: number;
}

const DEFAULT_REGION = {
  latitude: 35.6585805,
  longitude: 139.7454329,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export const ItineraryMapView = ({ itineraries }: ItineraryMapViewProps) => {
  const mapRef = useRef<MapView>(null);

  const validItineraries =
    itineraries?.filter(
      (item): item is Itinerary & { lat: number; lng: number } =>
        item.lat !== null && item.lng !== null,
    ) || [];

  useEffect(() => {
    if (validItineraries.length === 0 || !mapRef.current) return;

    const coordinates: ValidCoordinates[] = validItineraries.map((item) => ({
      latitude: item.lat,
      longitude: item.lng,
    }));

    const timer = setTimeout(() => {
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [itineraries]);

  const initialRegion =
    validItineraries.length > 0
      ? {
          latitude: validItineraries[0].lat,
          longitude: validItineraries[0].lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      : DEFAULT_REGION;

  return (
    <View className="flex-1 w-full h-full relative">
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        initialRegion={initialRegion}
      >
        {validItineraries?.map((item) => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: item.lat,
              longitude: item.lng,
            }}
            title={item.place_name || "이름 없는 장소"}
            description={item.memo || ""}
            pinColor={COLORS.primary.DEFAULT}
          />
        ))}
      </MapView>
    </View>
  );
};
