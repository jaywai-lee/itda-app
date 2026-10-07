import { eachDayOfInterval, format, parseISO } from "date-fns";

export interface TripDay {
  dayNumber: number;
  dateString: string;
  displayDate: string;
}

export const getTripDays = (startDate: string, endDate: string): TripDay[] => {
  if (!startDate || !endDate) return [];

  try {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const days = eachDayOfInterval({ start, end });

    return days.map((date, index) => ({
      dayNumber: index + 1,
      dateString: format(date, "yyyy-MM-dd"),
      displayDate: format(date, "MM.dd"),
    }));
  } catch (error) {
    return [];
  }
};
