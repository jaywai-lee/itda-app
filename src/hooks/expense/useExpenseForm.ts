import { Category, Expense } from "@/types/database";
import { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker";
import { parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

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
  const [photoUrl, setPhotoUrl] = useState("");
  const [linkedItineraryId, setLinkedItineraryId] = useState<string | null>(
    null,
  );
  const [spentDate, setSpentDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    if (visible) {
      if (editTarget) {
        setAmount(editTarget.amount.toString());
        setCategoryId(editTarget.category_id || null);
        setMemo(editTarget.memo || "");
        setPhotoUrl(editTarget.photo_url || "");
        setLinkedItineraryId(editTarget.itinerary_id ?? null);
        setSpentDate(parseISO(editTarget.spent_at));
      } else {
        setAmount("");
        setCategoryId(categories.length > 0 ? categories[0].id : null);
        setMemo("");
        setPhotoUrl("");
        setLinkedItineraryId(itineraryId ?? null);
        setSpentDate(
          itineraryVisitDate ? parseISO(itineraryVisitDate) : new Date(),
        );
      }
      setIsDatePickerOpen(false);
    }
  }, [visible, editTarget, categories, itineraryId, itineraryVisitDate]);

  const handleChangeSpentDate = (
    event: DateTimePickerChangeEvent,
    date: Date,
  ) => {
    setSpentDate(date);
    if (Platform.OS === "android") setIsDatePickerOpen(false);
  };

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
    },
  };
};
