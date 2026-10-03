import { AddPlaceModal } from "@/components/itinerary/AddPlaceModal";
import { ItineraryMapView } from "@/components/itinerary/ItineraryMapView";
import { COLORS } from "@/constants/colors";
import { useDeleteItinerary } from "@/hooks/itinerary/useDeleteItinerary";
import { useItineraries } from "@/hooks/itinerary/useItineraries";
import { useTrips } from "@/hooks/trip/useTrips";
import { Itinerary } from "@/types/database";
import { cn } from "@/utils/cn";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function ItineraryScreen() {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<Itinerary | null>(null);

  const { data: trips, isLoading: isTripsLoading } = useTrips();
  const { data: itineraries, isLoading: isItinerariesLoading } = useItineraries(
    selectedTripId || "",
  );
  const { mutate: deleteItinerary } = useDeleteItinerary();

  const containerHeight = useSharedValue(0);
  const handleHeight = useSharedValue(36);
  const hasInitialized = useRef(false);

  const translateY = useSharedValue(0);
  const startY = useSharedValue(0);

  const expandedY = 0;
  const defaultY = useDerivedValue(() => containerHeight.value * 0.45);
  const collapsedY = useDerivedValue(() =>
    Math.max(containerHeight.value - handleHeight.value, 0),
  );

  const onContainerLayout = (e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;
    containerHeight.value = height;

    if (!hasInitialized.current && height > 0) {
      translateY.value = height * 0.45;
      hasInitialized.current = true;
    }
  };

  const onHandleLayout = (e: LayoutChangeEvent) => {
    handleHeight.value = e.nativeEvent.layout.height;
  };

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          startY.value = translateY.value;
        })
        .onUpdate((e) => {
          const next = startY.value + e.translationY;
          translateY.value = Math.min(
            Math.max(next, expandedY),
            collapsedY.value,
          );
        })
        .onEnd((e) => {
          const current = translateY.value;
          const points = [expandedY, defaultY.value, collapsedY.value];

          let target = points.reduce((closest, point) =>
            Math.abs(point - current) < Math.abs(closest - current)
              ? point
              : closest,
          );

          if (e.velocityY > 800) {
            target = points.find((p) => p > current) ?? collapsedY.value;
          } else if (e.velocityY < -800) {
            target =
              [...points].reverse().find((p) => p < current) ?? expandedY;
          }

          translateY.value = withTiming(target, {
            duration: 220,
            easing: Easing.out(Easing.cubic),
          });
        }),
    [],
  );

  const sheetStyle = useAnimatedStyle(() => ({
    height: containerHeight.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (trips && trips.length > 0 && !selectedTripId) {
      setSelectedTripId(trips[0].id);
    }
  }, [trips]);

  const handleOpenCreateModal = () => {
    setEditTarget(null);
    setIsAddModalVisible(true);
  };

  const handleOpenEditModal = (item: Itinerary) => {
    setEditTarget(item);
    setIsAddModalVisible(true);
  };

  const handleDeleteItinerary = (id: string) => {
    Alert.alert("일정 삭제", "해당 장소를 일정에서 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          if (selectedTripId) deleteItinerary({ id, tripId: selectedTripId });
        },
      },
    ]);
  };

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

      <View className="flex-1 relative" onLayout={onContainerLayout}>
        <ItineraryMapView itineraries={itineraries || []} />

        <Animated.View
          style={sheetStyle}
          className="absolute bottom-0 left-0 right-0 bg-slate-bg shadow-2xl border-t border-slate-border"
        >
          <GestureDetector gesture={panGesture}>
            <View
              onLayout={onHandleLayout}
              className="w-full pt-3 pb-2.5 items-center"
            >
              <View className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </View>
          </GestureDetector>

          <View className="flex-row justify-between px-4 pb-4 items-center">
            <Text className="text-lg font-bold text-slate-text">상세 일정</Text>
            <Pressable
              onPress={handleOpenCreateModal}
              className="bg-primary flex-row items-center px-3 py-2 rounded-xl active:opacity-80"
            >
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
              style={{ flex: 1 }}
              data={itineraries}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 100,
              }}
              renderItem={({ item, index }) => (
                <View className="flex-row mb-3 pl-2">
                  <View className="items-center mr-3">
                    <View className="w-3 h-3 rounded-full bg-primary mt-1.5" />
                    {index !== (itineraries?.length ?? 0) - 1 && (
                      <View className="w-0.5 flex-1 bg-slate-border mt-1" />
                    )}
                  </View>

                  <View className="flex-1 bg-white p-3.5 rounded-xl border border-slate-border shadow-sm flex-row justify-between items-center">
                    <View className="flex-1 pr-3">
                      <View className="flex-row items-center mb-1">
                        <MapPin
                          size={12}
                          color={COLORS.primary.DEFAULT}
                          className="mr-1"
                        />
                        <Text className="font-bold ml-2 text-slate-text">
                          {item.place_name}
                        </Text>
                      </View>
                      {item.memo && (
                        <Text
                          className="text-xs text-slate-inactive mt-1 ml-6"
                          numberOfLines={2}
                        >
                          {item.memo}
                        </Text>
                      )}
                    </View>

                    <View className="flex-row gap-3">
                      <Pressable
                        onPress={() => handleOpenEditModal(item)}
                        className="p-1 active:opacity-60"
                      >
                        <Pencil size={18} color={COLORS.slate.inactive} />
                      </Pressable>
                      <Pressable
                        onPress={() => handleDeleteItinerary(item.id)}
                        className="p-1 active:opacity-60"
                      >
                        <Trash2 size={18} color={COLORS.budget.danger} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        </Animated.View>
      </View>

      <AddPlaceModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        tripId={selectedTripId || ""}
      />
    </View>
  );
}
