import { useMemo, useRef, useState } from "react";
import { LayoutChangeEvent } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const useBottomSheet = () => {
  const [isMeasured, setIsMeasured] = useState<boolean>(false);

  const containerHeight = useSharedValue<number>(0);
  const handleHeight = useSharedValue<number>(36);
  const hasInitialized = useRef<boolean>(false);
  const translateY = useSharedValue<number>(0);
  const startY = useSharedValue<number>(0);

  const expandedY = 0;
  const defaultY = useDerivedValue(() => containerHeight.value * 0.45);
  const collapsedY = useDerivedValue(() =>
    Math.max(containerHeight.value - handleHeight.value, 0),
  );

  const onContainerLayout = (e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;
    containerHeight.value = height;

    if (!hasInitialized.current && height > 0) {
      translateY.value = height * 0.45;
      hasInitialized.current = true;
      setIsMeasured(true);
    }
  };

  const onHandleLayout = (e: LayoutChangeEvent) => {
    handleHeight.value = e.nativeEvent.layout.height;
  };

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          startY.value = translateY.value;
        })
        .onUpdate((e) => {
          const next = startY.value + e.translationY;
          translateY.value = Math.min(
            Math.max(next, expandedY),
            collapsedY.value,
          );
        })
        .onEnd((e) => {
          const current = translateY.value;
          const points = [expandedY, defaultY.value, collapsedY.value];

          let target = points.reduce((closest, point) =>
            Math.abs(point - current) < Math.abs(closest - current)
              ? point
              : closest,
          );

          if (e.velocityY > 800) {
            target = points.find((p) => p > current) ?? collapsedY.value;
          } else if (e.velocityY < -800) {
            target =
              [...points].reverse().find((p) => p < current) ?? expandedY;
          }

          translateY.value = withTiming(target, {
            duration: 220,
            easing: Easing.out(Easing.cubic),
          });
        }),
    [collapsedY, defaultY, translateY, startY],
  );

  const sheetStyle = useAnimatedStyle(() => ({
    height: containerHeight.value,
    transform: [{ translateY: translateY.value }],
  }));

  return {
    isMeasured,
    sheetStyle,
    panGesture,
    onContainerLayout,
    onHandleLayout,
  };
};
