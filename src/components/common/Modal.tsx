import { COLORS } from "@/constants/colors";
import { X } from "lucide-react-native";
import { createContext, useContext } from "react";
import {
  Pressable,
  Modal as RNModal,
  ModalProps as RNModalProps,
  Text,
  View,
} from "react-native";

interface ModalContextType {
  onClose: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal 서브 컴포넌트는 Modal 내에서 사용되어야 합니다.");
  }
  return context;
};

interface ModalProps extends RNModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ visible, onClose, children, ...props }: ModalProps) => {
  return (
    <RNModal visible={visible} animationType="slide" transparent {...props}>
      <ModalContext.Provider value={{ onClose }}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 border-t border-slate-border">
            {children}
          </View>
        </View>
      </ModalContext.Provider>
    </RNModal>
  );
};

interface HeaderProps {
  title: string;
  showCloseButton?: boolean;
}

const Header = ({ title, showCloseButton }: HeaderProps) => {
  const { onClose } = useModalContext();
  return (
    <View className="flex-row justify-between items-center mb-6">
      <Text className="text-xl font-bold text-slate-TEXT">{title}</Text>
      {showCloseButton && (
        <Pressable onPress={onClose} className="p-1 active:opacity-70">
          <X size={24} color={COLORS.SLATE.TEXT} />
        </Pressable>
      )}
    </View>
  );
};

const Body = ({ children }: { children: React.ReactNode }) => {
  return <View className="mb-6">{children}</View>;
};

const Footer = ({ children }: { children: React.ReactNode }) => {
  return <View className="flex-row justify-end gap-3">{children}</View>;
};

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;
