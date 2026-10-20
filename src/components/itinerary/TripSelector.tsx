import { Trip } from "@/types/database";
import { ScrollView, View } from "react-native";
import { Chip } from "../common/Chip";

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
    <View className="bg-surface pt-14 pb-3 border-b border-line z-10 shadow-sm">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {trips.map((trip) => (
          <Chip
            key={trip.id}
            label={trip.name}
            isActive={trip.id === selectedTripId}
            onPress={() => onSelectTrip(trip.id)}
            className="px-5 py-2.5"
          />
        ))}
      </ScrollView>
    </View>
  );
};
