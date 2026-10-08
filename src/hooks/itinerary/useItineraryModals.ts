import { Itinerary } from "@/types/database";
import { useState } from "react";

export const useItineraryModals = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<Itinerary | null>(null);
  const [isExpenseModalVisible, setIsExpenseModalVisible] =
    useState<boolean>(false);
  const [selectedItineraryIdForExpense, setSelectedItineraryIdForExpense] =
    useState<string | null>(null);

  const handleOpenCreateModal = () => {
    setEditTarget(null);
    setIsAddModalVisible(true);
  };

  const handleOpenEditModal = (item: Itinerary) => {
    setEditTarget(item);
    setIsAddModalVisible(true);
  };

  const handleOpenExpenseModal = (id: string) => {
    setSelectedItineraryIdForExpense(id);
    setIsExpenseModalVisible(true);
  };

  const handleCloseExpenseModal = () => {
    setIsExpenseModalVisible(false);
    setSelectedItineraryIdForExpense(null);
  };

  return {
    isAddModalVisible,
    editTarget,
    isExpenseModalVisible,
    selectedItineraryIdForExpense,
    setIsAddModalVisible,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleOpenExpenseModal,
    handleCloseExpenseModal,
  };
};
