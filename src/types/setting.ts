import { useUserSettings } from "@/hooks/auth/useUserSettings";

export type Settings = ReturnType<typeof useUserSettings>["settings"];
export type UpdateSettings = ReturnType<
  typeof useUserSettings
>["updateSettings"];
