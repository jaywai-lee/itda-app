export const QUERY_KEYS = {
  TRIPS: {
    ALL: ["trips"] as const,
    LIST: () => [...QUERY_KEYS.TRIPS.ALL, "list"] as const,
    DETAIL: (id: string) => [...QUERY_KEYS.TRIPS.ALL, "detail", id] as const,
  },
  EXPENSES: {
    ALL: ["expenses"] as const,
    BY_TRIP: (tripId: string) =>
      [...QUERY_KEYS.EXPENSES.ALL, "trip", tripId] as const,
    DETAIL: (id: string) => [...QUERY_KEYS.EXPENSES.ALL, "detail", id] as const,
  },
  ITINERARIES: {
    ALL: ["itineraries"] as const,
    BY_TRIP: (tripId: string) =>
      [...QUERY_KEYS.ITINERARIES.ALL, "trip", tripId] as const,
  },
  CATEGORIES: {
    ALL: ["categories"] as const,
    BY_TRIP: (tripId?: string) =>
      [...QUERY_KEYS.CATEGORIES.ALL, "trip", tripId ?? "default"] as const,
  },
} as const;
