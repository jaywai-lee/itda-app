import { ItineraryMapView } from "@/components/itinerary/ItineraryMapView";
import { COLORS } from "@/constants/colors";
import { useItineraries } from "@/hooks/itinerary/useItineraries";
import { useTrips } from "@/hooks/trip/useTrips";
import { cn } from "@/utils/cn";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function ItineraryScreen() {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const { data: trips, isLoading: isTripsLoading } = useTrips();
  const { data: itineraries, isLoading: isItinerariesLoading } = useItineraries(
    selectedTripId || "",
  );

  useEffect(() => {
    if (trips && trips.length > 0 && !selectedTripId) {
      setSelectedTripId(trips[0].id);
    }
  }, [trips]);

  if (isTripsLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-bg">
        <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
      </View>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-bg p-4">
        <Text className="text-base font-semibold text-slate-text mb-1">
          등록된 여행이 없습니다.
        </Text>
        <Text className="text-sm text-slate-inactive">
          가계부 탭에서 여행을 먼저 생성해 주세요.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-bg">
      <View className="bg-white pt-14 pb-3 border-b border-slate-border z-10 shadow-sm">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {trips.map((trip) => {
            const isSelected = trip.id === selectedTripId;
            return (
              <Pressable
                key={trip.id}
                onPress={() => setSelectedTripId(trip.id)}
                className={cn(
                  "px-4 py-2 rounded-full border",
                  isSelected
                    ? "bg-primary border-primary"
                    : "bg-white border-slate-border",
                )}
              >
                <Text
                  className={cn(
                    "font-semibold text-sm",
                    isSelected ? "text-white" : "text-slate-text",
                  )}
                >
                  {trip.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View className="flex-1 relative">
        <ItineraryMapView itineraries={itineraries || []} />

        <View className="absolute bottom-0 left-0 right-0 h-2/5 bg-white rounded-t-3xl shadow-lg border-t border-slate-border p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-slate-text">상세 일정</Text>
            <Pressable className="bg-primary flex-row items-center px-3 py-2 rounded-xl active:opacity-80">
              <Plus size={16} color="#FFFFFF" />
              <Text className="text-white font-semibold ml-1 text-xs">
                장소 추가
              </Text>
            </Pressable>
          </View>

          {isItinerariesLoading ? (
            <ActivityIndicator
              size="small"
              color={COLORS.primary.DEFAULT}
              className="mt-4"
            />
          ) : itineraries?.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-slate-inactive text-sm">
                아직 등록된 일정이 없습니다.
              </Text>
            </View>
          ) : (
            <FlatList
              data={itineraries}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="p-3 border-b border-slate-border flew-row items-center">
                  <Text className="font-bold text-primary mr-3">
                    {item.order_index}
                  </Text>
                  <Text className="text-slate-text flew-1">
                    {item.place_name}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
}
