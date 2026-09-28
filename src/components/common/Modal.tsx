import { X } from "lucide-react-native";
import React, { createContext, useContext, useEffect } from "react";
import {
  Dimensions,
  Keyboard,
  Platform,
  Pressable,
  Modal as RNModal,
  ModalProps as RNModalProps,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { COLORS } from "../../constants/colors";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const CLOSE_DISTANCE = 120;
const CLOSE_VELOCITY = 800;

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
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const keyboardHeight = useSharedValue(0);

  const animateClose = () => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      { duration: 200 },
      (finished) => {
        if (finished) scheduleOnRN(onClose);
      },
    );
  };

  useEffect(() => {
    if (visible) {
      translateY.value = SCREEN_HEIGHT;
      backdropOpacity.value = 0;
      translateY.value = withTiming(0, { duration: 250 });
      backdropOpacity.value = withTiming(1, { duration: 250 });
    }
  }, [visible, translateY, backdropOpacity]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, (e) => {
      keyboardHeight.value = withTiming(e.endCoordinates.height, {
        duration: 250,
      });
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      keyboardHeight.value = withTiming(0, { duration: 250 });
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardHeight]);

  const panGesture = Gesture.Pan()
    .onChange((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > CLOSE_DISTANCE || e.velocityY > CLOSE_VELOCITY) {
        backdropOpacity.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(
          SCREEN_HEIGHT,
          { duration: 200 },
          (finished) => {
            if (finished) scheduleOnRN(onClose);
          },
        );
      } else {
        translateY.value = withSpring(0, { damping: 18, stiffness: 120 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value - keyboardHeight.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <RNModal
      visible={visible}
      animationType="none"
      transparent
      statusBarTranslucent
      onRequestClose={animateClose}
      {...props}
    >
      <GestureHandlerRootView className="flex-1 w-full h-full">
        <ModalContext.Provider value={{ onClose: animateClose }}>
          <View className="flex-1 justify-end">
            <Animated.View
              className="absolute inset-0 bg-black/50"
              style={backdropStyle}
            >
              <Pressable className="flex-1 w-full" onPress={animateClose} />
            </Animated.View>

            <Animated.View
              style={sheetStyle}
              className="bg-white rounded-t-3xl px-6 pb-6 border-t border-slate-border"
            >
              <GestureDetector gesture={panGesture}>
                <View className="w-full items-center pt-3 pb-5 active:opacity-60">
                  <View className="w-12 h-1.5 bg-slate-inactive/40 rounded-full" />
                </View>
              </GestureDetector>

              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>{children}</View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </View>
        </ModalContext.Provider>
      </GestureHandlerRootView>
    </RNModal>
  );
};

interface HeaderProps {
  title: string;
  showCloseButton?: boolean;
}

const Header = ({ title, showCloseButton = true }: HeaderProps) => {
  const { onClose } = useModalContext();
  return (
    <View className="flex-row justify-between items-center mb-6">
      <Text className="text-xl font-bold text-slate-text">{title}</Text>
      {showCloseButton && (
        <Pressable onPress={onClose} className="p-1 active:opacity-70">
          <X size={24} color={COLORS.slate.text} />
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
