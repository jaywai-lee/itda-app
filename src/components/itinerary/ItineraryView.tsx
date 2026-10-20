import { COLORS } from "@/constants/colors";
import { Expense, Itinerary, Trip } from "@/types/database";
import { TripDay } from "@/utils/dateUtils";
import { MapPin, Plus } from "lucide-react-native";
import { useCallback } from "react";
import {
  ActivityIndicator,
  LayoutChangeEvent,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import type { PanGesture } from "react-native-gesture-handler";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { Button } from "../common/Button";
import { Typography } from "../common/Typography";
import { CreateExpenseModal } from "../expense/CreateExpenseModal";
import { AddPlaceModal } from "./AddPlaceModal";
import { DaySelector } from "./DaySelector";
import { ItineraryListItem } from "./ItineraryListItem";
import { ItineraryMapView } from "./ItineraryMapView";
import { TripSelector } from "./TripSelector";

export interface ItineraryViewState {
  trips: Trip[] | undefined;
  selectedTripId: string | null;
  tripDays: TripDay[];
  selectedDate: string | null;
  localItineraries: Itinerary[];
  isTripsLoading: boolean;
  isItinerariesLoading: boolean;
  isAddModalVisible: boolean;
  editTarget: Itinerary | null;
  isMeasured: boolean;
  sheetStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  activeTripCurrency: string;
  isExpenseModalVisible: boolean;
  selectedItineraryIdForExpense: string | null;
  totalBudget: number;
  currentTotalSpent: number;
  expenses: Expense[];
  itineraryVisitDate: string | null;
}

export interface ItineraryViewHandlers {
  onSelectTrip: (id: string) => void;
  onSelectDate: (date: string) => void;
  onContainerLayout: (e: LayoutChangeEvent) => void;
  onHandleLayout: (e: LayoutChangeEvent) => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (item: Itinerary) => void;
  onDeleteItinerary: (id: string) => void;
  onDragEnd: (params: { data: Itinerary[] }) => void;
  onCloseAddModal: () => void;
  onOpenExpenseModal: (id: string) => void;
  onCloseExpenseModal: () => void;
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
      const linkedSum = state.expenses
        .filter((e) => e.itinerary_id === item.id)
        .reduce((acc, cur) => acc + cur.amount, 0);

      return (
        <ItineraryListItem
          item={item}
          index={index}
          isLast={isLast}
          isActive={isActive}
          drag={drag}
          onEdit={handlers.onOpenEditModal}
          onDelete={handlers.onDeleteItinerary}
          onAddExpense={handlers.onOpenExpenseModal}
          linkedExpensesSum={linkedSum}
          currency={state.activeTripCurrency}
        />
      );
    },
    [state.localItineraries.length, state.expenses, handlers],
  );

  if (
    state.isTripsLoading ||
    (state.trips && state.trips.length > 0 && !state.selectedTripId)
  ) {
    return (
      <View className="flex-1 justify-center items-center bg-canvas">
        <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
      </View>
    );
  }

  if (!state.trips || state.trips.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-canvas p-5">
        <Typography variant="headline" className="mb-2">
          등록된 여행이 없습니다.
        </Typography>
        <Typography variant="body" color="sub">
          가계부 탭에서 여행을 먼저 생성해 주세요.
        </Typography>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-canvas">
      <TripSelector
        trips={state.trips}
        selectedTripId={state.selectedTripId}
        onSelectTrip={handlers.onSelectTrip}
      />

      <DaySelector
        days={state.tripDays}
        selectedDate={state.selectedDate}
        onSelectDate={handlers.onSelectDate}
      />

      <View className="flex-1 relative" onLayout={handlers.onContainerLayout}>
        <ItineraryMapView itineraries={state.localItineraries} />

        {state.isMeasured && (
          <Animated.View
            style={state.sheetStyle}
            className="absolute bottom-0 left-0 right-0 bg-surface shadow-2xl border-t border-line rounded-t-sheet"
          >
            <GestureDetector gesture={panGesture}>
              <View
                onLayout={handlers.onHandleLayout}
                className="w-full pt-4 pb-3 items-center bg-transparent z-10"
              >
                <View className="w-12 h-1.5 bg-line rounded-full" />
              </View>
            </GestureDetector>

            <View className="flex-row justify-between px-5 pb-5 items-center">
              <Typography variant="headline">상세 일정</Typography>
              <Button
                variant="solid"
                onPress={handlers.onOpenCreateModal}
                className="py-2.5 px-4 shadow-sm"
              >
                <View className="flex-row items-center justify-center gap-2">
                  <Plus size={16} color="#FFFFFF" strokeWidth={3} />
                  <Typography variant="subhead" color="white">
                    장소 추가
                  </Typography>
                </View>
              </Button>
            </View>

            {state.isItinerariesLoading ? (
              <ActivityIndicator
                size="small"
                color={COLORS.primary.DEFAULT}
                className="mt-4"
              />
            ) : state.localItineraries.length === 0 ? (
              <View className="justify-center items-center pb-20">
                <View className="bg-surface rounded-card p-8 border border-line items-center w-full max-w-sm shadow-sm mx-5">
                  <View className="w-16 h-16 bg-fill-strong rounded-full items-center justify-center mb-5">
                    <MapPin
                      size={32}
                      color={COLORS.ink.mute}
                      strokeWidth={1.5}
                    />
                  </View>
                  <Typography variant="headline" className="mb-2">
                    등록된 장소가 없어요
                  </Typography>
                  <Typography
                    variant="body"
                    color="sub"
                    className="text-center"
                  >
                    우측 상단의 추가 버튼을 눌러{"\n"}상세 일정을 구성해 보세요.
                  </Typography>
                </View>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <DraggableFlatList
                  data={state.localItineraries}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 20,
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
        selectedDate={state.selectedDate}
        editTarget={state.editTarget}
      />

      <CreateExpenseModal
        tripId={state.selectedTripId || ""}
        currency={state.activeTripCurrency}
        visible={state.isExpenseModalVisible}
        onClose={handlers.onCloseExpenseModal}
        itineraryId={state.selectedItineraryIdForExpense}
        itineraryVisitDate={state.itineraryVisitDate}
        totalBudget={state.totalBudget}
        currentTotalSpent={state.currentTotalSpent}
      />
    </View>
  );
};
