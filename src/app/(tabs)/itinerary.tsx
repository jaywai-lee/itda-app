import { ItineraryView } from "@/components/itinerary/ItineraryView";
import { useDeleteItinerary } from "@/hooks/itinerary/useDeleteItinerary";
import { useItineraries } from "@/hooks/itinerary/useItineraries";
import { useUpdateItineraryOrder } from "@/hooks/itinerary/useUpdateItineraryOrder";
import { useTrips } from "@/hooks/trip/useTrips";
import { Itinerary } from "@/types/database";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, LayoutChangeEvent } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
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
  const [localItineraries, setLocalItineraries] = useState<Itinerary[]>([]);
  const [isMeasured, setIsMeasured] = useState<boolean>(false);

  const { data: trips, isLoading: isTripsLoading } = useTrips();
  const { data: itineraries, isLoading: isItinerariesLoading } = useItineraries(
    selectedTripId || "",
  );
  const { mutate: deleteItinerary } = useDeleteItinerary();
  const { mutate: updateOrder } = useUpdateItineraryOrder();

  useEffect(() => {
    if (itineraries) {
      setLocalItineraries(itineraries);
    }
  }, [itineraries]);

  useEffect(() => {
    if (trips && trips.length > 0 && !selectedTripId) {
      setSelectedTripId(trips[0].id);
    }
  }, [trips]);

  const containerHeight = useSharedValue<number>(0);
  const handleHeight = useSharedValue<number>(36);
  const hasInitialized = useRef<boolean>(false);

  const translateY = useSharedValue<number>(0);
  const startY = useSharedValue<number>(0);

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
      setIsMeasured(true);
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

  const handleDragEnd = ({ data }: { data: Itinerary[] }) => {
    setLocalItineraries(data);

    if (!selectedTripId) return;

    const updates = data.map((item, index) => ({
      id: item.id,
      order_index: index,
    }));

    updateOrder({ tripId: selectedTripId, updates });
  };

  return (
    <ItineraryView
      state={{
        trips,
        selectedTripId,
        localItineraries,
        isTripsLoading,
        isItinerariesLoading,
        isAddModalVisible,
        editTarget,
        isMeasured,
        sheetStyle,
      }}
      handlers={{
        onSelectTrip: setSelectedTripId,
        onContainerLayout,
        onHandleLayout,
        onOpenCreateModal: handleOpenCreateModal,
        onOpenEditModal: handleOpenEditModal,
        onDeleteItinerary: handleDeleteItinerary,
        onDragEnd: handleDragEnd,
        onCloseAddModal: () => setIsAddModalVisible,
      }}
      panGesture={panGesture}
    />
  );
}
