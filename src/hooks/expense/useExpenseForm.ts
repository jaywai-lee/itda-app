import { Category, Expense } from "@/types/database";
import { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker";
import { parseISO } from "date-fns";
import { useState } from "react";

export const useExpenseForm = (
  visible: boolean,
  categories: Category[],
  editTarget?: Expense | null,
  itineraryId?: string | null,
  itineraryVisitDate?: string | null,
) => {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [memo, setMemo] = useState("");
  const [linkedItineraryId, setLinkedItineraryId] = useState<string | null>(
    null,
  );
  const [spentDate, setSpentDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [prevProps, setPrevProps] = useState({
    visible: false,
    editTarget,
    categories,
    itineraryId,
    itineraryVisitDate,
  });

  if (
    visible !== prevProps.visible ||
    editTarget !== prevProps.editTarget ||
    categories !== prevProps.categories ||
    itineraryId !== prevProps.itineraryId ||
    itineraryVisitDate !== prevProps.itineraryVisitDate
  ) {
    setPrevProps({
      visible,
      editTarget,
      categories,
      itineraryId,
      itineraryVisitDate,
    });

    if (visible) {
      if (editTarget) {
        setAmount(editTarget.amount.toString());
        setCategoryId(editTarget.category_id || null);
        setMemo(editTarget.memo || "");
        setLinkedItineraryId(editTarget.itinerary_id ?? null);
        setSpentDate(parseISO(editTarget.spent_at));
      } else {
        setAmount("");
        setCategoryId(categories.length > 0 ? categories[0].id : null);
        setMemo("");
        setLinkedItineraryId(itineraryId ?? null);
        setSpentDate(
          itineraryVisitDate ? parseISO(itineraryVisitDate) : new Date(),
        );
      }
      setIsDatePickerOpen(false);
    }
  }

  const handleChangeSpentDate = (
    event: DateTimePickerChangeEvent,
    date: Date,
  ) => {
    setSpentDate(date);
    setIsDatePickerOpen(false);
  };

  const handleDismissDatePicker = () => setIsDatePickerOpen(false);

  return {
    state: {
      amount,
      categoryId,
      memo,
      linkedItineraryId,
      spentDate,
      isDatePickerOpen,
    },
    setters: {
      setAmount,
      setCategoryId,
      setMemo,
      setIsDatePickerOpen,
    },
    handlers: {
      handleChangeSpentDate,
      handleDismissDatePicker,
    },
  };
};
