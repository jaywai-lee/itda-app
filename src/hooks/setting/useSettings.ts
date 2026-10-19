import { useAuth } from "@/context/AuthContext";
import { Href, router } from "expo-router";
import { useAuthActions } from "../auth/useAuthActions";
import { useChangePasswordModal } from "../auth/useChangePasswordModal";
import { useUserSettings } from "../auth/useUserSettings";
import { useBudgetSettings } from "./useBudgetSettings";
import { useContact } from "./useContact";
import { useExportCSV } from "./useExportCSV";
import { useGeneralSettings } from "./useGeneralSettings";
import { useReminderSettings } from "./useReminderSettings";

export const useSettings = () => {
  const { session } = useAuth();
  const userEmail = session?.user?.email || "이메일 정보 없음";

  const { handleLogout, handleDeleteAccount, isDeleting } = useAuthActions();
  const pwModal = useChangePasswordModal();
  const { settings, updateSettings, isUpdating } = useUserSettings();
  const { handleContactUs } = useContact();
  const { handleExportCSV, isExporting } = useExportCSV();

  const general = useGeneralSettings(settings, updateSettings);
  const reminder = useReminderSettings(settings, updateSettings);
  const budget = useBudgetSettings(updateSettings);

  return {
    state: {
      userEmail,
      settings,
      isUpdating,
      isDeleting,
      isCountryModalVisible: general.isCountryModalVisible,
      isTimePickerVisible: reminder.isTimePickerVisible,
      reminderDraftTime: reminder.draftTime,
      pwModalState: pwModal.state,
      isBudgetModalVisible: budget.isBudgetModalVisible,
      isExportingCSV: isExporting,
    },
    handlers: {
      onGoBack: () => router.back(),
      onNavigate: (path: Href) => router.push(path),
      onComingSoon: general.handleComingSoon,
      onToggleKrwConversion: general.handleToggleKrwConversion,
      onSelectDefaultCountry: general.handleSelectDefaultCountry,
      onToggleCountryModal: general.setIsCountryModalVisible,

      onToggleReminder: reminder.handleToggleReminder,
      onToggleTimePicker: (visible: boolean) =>
        visible
          ? reminder.handleOpenTimePicker()
          : reminder.handleDismissTimePicker(),
      onChangeReminderTime: reminder.handleChangeReminderTime,
      onConfirmTimePicker: reminder.handleConfirmTimePicker,
      onDismissTimePicker: reminder.handleDismissTimePicker,

      onToggleBudgetModal: budget.setIsBudgetModalVisible,
      onSelectBudgetThreshold: budget.handleSelectBudgetThreshold,

      onLogout: handleLogout,
      onDeleteAccount: handleDeleteAccount,
      pwModalHandlers: pwModal.handlers,
      onContactUs: handleContactUs,
      onExportCSV: handleExportCSV,
    },
  };
};
