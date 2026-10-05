import { COLORS } from "@/constants/colors";
import { Itinerary, Trip } from "@/types/database";
import { Plus } from "lucide-react-native";
import { useCallback } from "react";
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import type { PanGesture } from "react-native-gesture-handler";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { AddPlaceModal } from "./AddPlaceModal";
import { ItineraryListItem } from "./ItineraryListItem";
import { ItineraryMapView } from "./ItineraryMapView";
import { TripSelector } from "./TripSelector";

export interface ItineraryViewState {
  trips: Trip[] | undefined;
  selectedTripId: string | null;
  localItineraries: Itinerary[];
  isTripsLoading: boolean;
  isItinerariesLoading: boolean;
  isAddModalVisible: boolean;
  editTarget: Itinerary | null;
  isMeasured: boolean;
  sheetStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

export interface ItineraryViewHandlers {
  onSelectTrip: (id: string) => void;
  onContainerLayout: (e: LayoutChangeEvent) => void;
  onHandleLayout: (e: LayoutChangeEvent) => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (item: Itinerary) => void;
  onDeleteItinerary: (id: string) => void;
  onDragEnd: (params: { data: Itinerary[] }) => void;
  onCloseAddModal: () => void;
}

interface ItineraryViewProps {
  state: ItineraryViewState;
  handlers: ItineraryViewHandlers;
  panGesture: PanGesture;
}

export const ItineraryView = ({
  state,
  handlers,
  panGesture,
}: ItineraryViewProps) => {
  const renderItem = useCallback(
    ({ item, getIndex, drag, isActive }: RenderItemParams<Itinerary>) => {
      const index = getIndex() ?? 0;
      const isLast = index === state.localItineraries.length - 1;

      return (
        <ItineraryListItem
          item={item}
          index={index}
          isLast={isLast}
          isActive={isActive}
          drag={drag}
          onEdit={handlers.onOpenEditModal}
          onDelete={handlers.onDeleteItinerary}
        />
      );
    },
    [state.localItineraries.length, handlers],
  );

  if (
    state.isTripsLoading ||
    (state.trips && state.trips.length > 0 && !state.selectedTripId)
  ) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-bg">
        <ActivityIndicator
          size="large"
          color={COLORS.primary.DEFAULT as string}
        />
      </View>
    );
  }

  if (!state.trips || state.trips.length === 0) {
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
      <TripSelector
        trips={state.trips}
        selectedTripId={state.selectedTripId}
        onSelectTrip={handlers.onSelectTrip}
      />

      <View className="flex-1 relative" onLayout={handlers.onContainerLayout}>
        <ItineraryMapView itineraries={state.localItineraries} />

        {state.isMeasured && (
          <Animated.View
            style={state.sheetStyle}
            className="absolute bottom-0 left-0 right-0 bg-slate-bg shadow-2xl border-t border-slate-border"
          >
            <GestureDetector gesture={panGesture}>
              <View
                onLayout={handlers.onHandleLayout}
                className="w-full pt-3 pb-2.5 items-center bg-transparent z-10"
              >
                <View className="w-12 h-1.5 bg-slate-300 rounded-full" />
              </View>
            </GestureDetector>

            <View className="flex-row justify-between px-4 pb-4 items-center">
              <Text className="text-lg font-bold text-slate-text">
                상세 일정
              </Text>
              <Pressable
                onPress={handlers.onOpenCreateModal}
                className="bg-primary flex-row items-center px-3 py-2 rounded-xl active:opacity-80"
              >
                <Plus size={16} color="#FFFFFF" />
                <Text className="text-white font-semibold ml-1 text-xs">
                  장소 추가
                </Text>
              </Pressable>
            </View>

            {state.isItinerariesLoading ? (
              <ActivityIndicator
                size="small"
                color={COLORS.primary.DEFAULT as string}
                className="mt-4"
              />
            ) : state.localItineraries.length === 0 ? (
              <View className="flex-1 justify-center items-center">
                <Text className="text-slate-inactive text-sm">
                  아직 등록된 일정이 없습니다.
                </Text>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <DraggableFlatList
                  data={state.localItineraries}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 100,
                  }}
                  onDragEnd={handlers.onDragEnd}
                  renderItem={renderItem}
                />
              </View>
            )}
          </Animated.View>
        )}
      </View>

      <AddPlaceModal
        visible={state.isAddModalVisible}
        onClose={handlers.onCloseAddModal}
        tripId={state.selectedTripId || ""}
        editTarget={state.editTarget}
      />
    </View>
  );
};
