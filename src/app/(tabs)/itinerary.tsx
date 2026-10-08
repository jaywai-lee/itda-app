import { ItineraryView } from "@/components/itinerary/ItineraryView";
import { useItineraryScreen } from "@/hooks/itinerary/useItineraryScreen";

export default function ItineraryScreen() {
  const { state, handlers, panGesture } = useItineraryScreen();

  return (
    <ItineraryView state={state} handlers={handlers} panGesture={panGesture} />
  );
}
