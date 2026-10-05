import { Trip } from "@/types/database";
import { cn } from "@/utils/cn";
import { Pressable, ScrollView, Text, View } from "react-native";

interface TripSelectorProps {
  trips: Trip[];
  selectedTripId: string | null;
  onSelectTrip: (id: string) => void;
}

export const TripSelector = ({
  trips,
  selectedTripId,
  onSelectTrip,
}: TripSelectorProps) => {
  return (
    <View className="bg-white pt-14 pb-3 border-b border-slate-border z-10 shadow-sm">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {trips.map((trip) => {
          const isSelected = trip.id === selectedTripId;
          return (
            <Pressable
              key={trip.id}
              onPress={() => onSelectTrip(trip.id)}
              className={cn(
                "px-4 py-2 rounded-full border",
                isSelected
                  ? "bg-primary border-primary"
                  : "bg-white border-slate-border",
              )}
            >
              <Text
                className={cn(
                  "font-semibold text-sm",
                  isSelected ? "text-white" : "text-slate-text",
                )}
              >
                {trip.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
