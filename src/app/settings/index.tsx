import { SettingsView } from "@/components/setting/SettingsView";
import { useSettings } from "@/hooks/setting/useSettings";

export default function SettingsScreen() {
  const { state, handlers } = useSettings();
  return <SettingsView state={state} handlers={handlers} />;
}
