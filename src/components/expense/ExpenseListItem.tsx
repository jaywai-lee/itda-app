import { COLORS } from "@/constants/colors";
import { Expense } from "@/types/database";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { MapPin } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface ExpenseListItemProps {
  item: Expense;
  tripStartDate: string;
  onPress: (expense: Expense) => void;
}

export const ExpenseListItem = ({
  item,
  tripStartDate,
  onPress,
}: ExpenseListItemProps) => {
  const dayDiff = differenceInCalendarDays(
    parseISO(item.spent_at),
    parseISO(tripStartDate),
  );
  const displayDay = dayDiff < 0 ? "준비" : `Day ${dayDiff + 1}`;

  return (
    <Pressable
      onPress={() => onPress(item)}
      className="bg-white p-4 rounded-xl border border-slate-border mb-3 flex-row justify-between items-center active:opacity-75"
    >
      <View className="flex-1 pr-4">
        <View className="mb-1.5 flex-row items-center">
          <Text className="text-xs font-bold text-primary mr-1">
            {displayDay}
          </Text>
        </View>

        <View className="flex-row items-center mb-1">
          <Text className="text-sm font-bold text-slate-text mr-2">
            {item.categories?.name || "기타"}
          </Text>

          {item.itinerary_id && (
            <View className="bg-primary/10 px-1.5 py-0.5 rounded flex-row items-center max-w-[130px]">
              <MapPin size={10} color={COLORS.primary.DEFAULT as string} />
              <Text
                className="text-[10px] font-semibold text-primary ml-0.5"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.itineraries?.place_name ||
                  item.itineraries?.title ||
                  "일정 연동"}
              </Text>
            </View>
          )}
        </View>
        {item.memo && (
          <Text className="text-xs text-slate-inactive" numberOfLines={1}>
            {item.memo}
          </Text>
        )}
      </View>

      <View className="items-end">
        <Text className="text-base font-bold text-slate-text">
          {item.amount.toLocaleString()} {item.currency}
        </Text>
        {item.currency !== "KRW" && item.amount_krw != null && (
          <Text className="text-xs text-slate-inactive mt-0.5">
            ≈ {item.amount_krw.toLocaleString()} KRW
          </Text>
        )}
      </View>
    </Pressable>
  );
};
