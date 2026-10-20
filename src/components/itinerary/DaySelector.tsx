import { TripDay } from "@/utils/dateUtils";
import { ScrollView, View } from "react-native";
import { Chip } from "../common/Chip";

interface DaySelectorProps {
  days: TripDay[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export const DaySelector = ({
  days,
  selectedDate,
  onSelectDate,
}: DaySelectorProps) => {
  if (!days || days.length === 0) return null;

  return (
    <View className="bg-surface pt-2 pb-3 border-b border-line z-10 shadow-sm">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {days.map((day) => (
          <Chip
            key={day.dateString}
            label={`Day ${day.dayNumber} (${day.displayDate})`}
            isActive={day.dateString === selectedDate}
            onPress={() => onSelectDate(day.dateString)}
            className="px-4 py-2"
          />
        ))}
      </ScrollView>
    </View>
  );
};
