import { COLORS } from "@/constants/colors";
import { Expense } from "@/types/database";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { MapPin } from "lucide-react-native";
import { View } from "react-native";
import { Card } from "../common/Card";
import { CategoryIcon } from "../common/CategoryIcon";
import { Typography } from "../common/Typography";

interface ExpenseListItemProps {
  item: Expense;
  tripStartDate: string;
  onPress: (expense: Expense) => void;
  showKrwConversion?: boolean;
}

export const ExpenseListItem = ({
  item,
  tripStartDate,
  onPress,
  showKrwConversion,
}: ExpenseListItemProps) => {
  const dayDiff = differenceInCalendarDays(
    parseISO(item.spent_at),
    parseISO(tripStartDate),
  );
  const displayDay = dayDiff < 0 ? "준비" : `Day ${dayDiff + 1}`;

  const categoryColor = item.categories?.color || COLORS.slate.inactive;

  return (
    <Card
      onPress={() => onPress(item)}
      className="p-4 mb-3 flex-row justify-between items-center"
      pressEffect="scale"
    >
      <View className="flex-1 pr-4">
        <View className="mb-2 flex-row items-center">
          <Typography variant="caption" color="primary">
            {displayDay}
          </Typography>
        </View>

        <View className="flex-row items-center mb-1.5">
          <View
            className="w-7 h-7 rounded-full items-center justify-center mr-2.5"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            <CategoryIcon
              name={item.categories?.icon}
              color={categoryColor}
              size={14}
            />
          </View>
          <Typography variant="body" className="font-bold mr-2.5">
            {item.categories?.name || "기타"}
          </Typography>

          {item.itinerary_id && (
            <View className="bg-fill-strong px-2 py-1 rounded-chip flex-row items-center max-w-[130px]">
              <MapPin size={10} color={COLORS.ink.sub} />
              <Typography
                variant="caption"
                color="sub"
                className="ml-1"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.itineraries?.place_name ||
                  item.itineraries?.title ||
                  "일정 연동"}
              </Typography>
            </View>
          )}
        </View>
        {item.memo && (
          <Typography variant="subhead" color="sub" numberOfLines={1}>
            {item.memo}
          </Typography>
        )}
      </View>

      <View className="items-end">
        <Typography variant="button">
          {item.amount.toLocaleString()} {item.currency}
        </Typography>
        {showKrwConversion &&
          item.currency !== "KRW" &&
          item.amount_krw != null && (
            <Typography variant="caption" color="sub" className="mt-1">
              ≈ {item.amount_krw.toLocaleString()} KRW
            </Typography>
          )}
      </View>
    </Card>
  );
};
