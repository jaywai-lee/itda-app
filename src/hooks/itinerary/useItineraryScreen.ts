import { Itinerary } from "@/types/database";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useExpenses } from "../expense/useExpenses";
import { useTrips } from "../trip/useTrips";
import { useBottomSheet } from "./useBottomSheet";
import { useDeleteItinerary } from "./useDeleteItinerary";
import { useItineraries } from "./useItineraries";
import { useItineraryModals } from "./useItineraryModals";
import { useItinerarySelection } from "./useItinerarySelection";
import { useUpdateItineraryOrder } from "./useUpdateItineraryOrder";

export const useItineraryScreen = () => {
  const { data: trips, isLoading: isTripsLoading } = useTrips();
  const selection = useItinerarySelection(trips);
  const modals = useItineraryModals();
  const bottomSheet = useBottomSheet();

  const [localItineraries, setLocalItineraries] = useState<Itinerary[]>([]);

  const { data: expenses } = useExpenses(selection.selectedTripId);
  const { data: itineraries, isLoading: isItinerariesLoading } = useItineraries(
    selection.selectedTripId || "",
  );
  const { mutate: deleteItinerary } = useDeleteItinerary();
  const { mutate: updateOrder } = useUpdateItineraryOrder();

  useEffect(() => {
    if (itineraries && selection.selectedDate) {
      const filtered = itineraries.filter(
        (item) => item.visit_date === selection.selectedDate,
      );
      setLocalItineraries(
        filtered.sort((a, b) => a.order_index - b.order_index),
      );
    } else {
      setLocalItineraries([]);
    }
  }, [itineraries, selection.selectedDate]);

  const handleDeleteItinerary = (id: string) => {
    Alert.alert("일정 삭제", "해당 장소를 일정에서 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          if (selection.selectedTripId)
            deleteItinerary(
              { id, tripId: selection.selectedTripId },
              {
                onSuccess: () => {
                  Alert.alert("성공", "일정이 삭제되었습니다.");
                },
                onError: (e) => Alert.alert("오류", e.message),
              },
            );
        },
      },
    ]);
  };

  const handleDragEnd = ({ data }: { data: Itinerary[] }) => {
    setLocalItineraries(data);

    if (!selection.selectedTripId) return;

    const updates = data.map((item, index) => ({
      id: item.id,
      order_index: index,
    }));

    updateOrder({ tripId: selection.selectedTripId, updates });
  };

  const selectedItineraryForExpense = itineraries?.find(
    (i) => i.id === modals.selectedItineraryIdForExpense,
  );

  return {
    state: {
      trips,
      selectedTripId: selection.selectedTripId,
      tripDays: selection.tripDays,
      selectedDate: selection.selectedDate,
      localItineraries,
      isTripsLoading,
      isItinerariesLoading,
      isAddModalVisible: modals.isAddModalVisible,
      editTarget: modals.editTarget,
      isMeasured: bottomSheet.isMeasured,
      sheetStyle: bottomSheet.sheetStyle,
      activeTripCurrency: selection.activeTrip?.currency || "KRW",
      isExpenseModalVisible: modals.isExpenseModalVisible,
      selectedItineraryIdForExpense: modals.selectedItineraryIdForExpense,
      totalBudget: selection.activeTrip?.total_budget || 0,
      currentTotalSpent:
        expenses?.reduce((acc, cur) => acc + cur.amount, 0) || 0,
      expenses: expenses || [],
      itineraryVisitDate: selectedItineraryForExpense?.visit_date ?? null,
    },
    handlers: {
      onSelectTrip: selection.handleSelectTrip,
      onSelectDate: selection.setSelectedDate,
      onContainerLayout: bottomSheet.onContainerLayout,
      onHandleLayout: bottomSheet.onHandleLayout,
      onOpenCreateModal: modals.handleOpenCreateModal,
      onOpenEditModal: modals.handleOpenEditModal,
      onDeleteItinerary: handleDeleteItinerary,
      onDragEnd: handleDragEnd,
      onCloseAddModal: () => modals.setIsAddModalVisible(false),
      onOpenExpenseModal: modals.handleOpenExpenseModal,
      onCloseExpenseModal: modals.handleCloseExpenseModal,
    },
    panGesture: bottomSheet.panGesture,
  };
};
