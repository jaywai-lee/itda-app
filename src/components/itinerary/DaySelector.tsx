import { cn } from "@/utils/cn";
import { TripDay } from "@/utils/dateUtils";
import { Pressable, ScrollView, Text, View } from "react-native";

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
    <View className="bg-white pt-2 pb-3 border-b border-slate-border z-10 shadow-sm">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {days.map((day) => {
          const isSelected = day.dateString === selectedDate;
          return (
            <Pressable
              key={day.dateString}
              onPress={() => onSelectDate(day.dateString)}
              className={cn(
                "px-4 py-1.5 rounded-full border",
                isSelected
                  ? "bg-slate-800 border-slate-800"
                  : "bg-slate-bg border-slate-border",
              )}
            >
              <Text
                className={cn(
                  "font-bold text-xs",
                  isSelected ? "text-white" : "text-slate-text",
                )}
              >
                Day {day.dayNumber} ({day.displayDate})
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
