import { TripDetailView } from "@/components/trip/TripDetailView";
import { useExpenses } from "@/hooks/expense/useExpenses";
import { useTrips } from "@/hooks/trip/useTrips";
import { Expense } from "@/types/database";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

export default function TripDetailScreen() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: trips } = useTrips();
  const trip = trips?.find((t) => t.id === id);
  const { data: expenses, isLoading } = useExpenses(id);

  if (!trip) return null;

  const totalSpent = expenses?.reduce((acc, cur) => acc + cur.amount, 0) || 0;

  const handleOpenCreateModal = () => {
    setSelectedExpense(null);
    setIsModalVisible(true);
  };

  const handleOpenEditModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsModalVisible(true);
  };

  return (
    <TripDetailView
      state={{
        trip,
        expenses,
        isLoading,
        totalSpent,
        isModalVisible,
        selectedExpense,
      }}
      handlers={{
        onGoBack: () => router.back(),
        onOpenCreateModal: handleOpenCreateModal,
        onOpenEditModal: handleOpenEditModal,
        onCloseModal: () => setIsModalVisible(false),
      }}
    />
  );
}
