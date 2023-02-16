import { useRef } from 'react';
import { KeyboardEvent, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useKeyboard } from '@src/hooks/useKeyboard';

const KEYBOARD_EASING = Easing.bezier(0.54, 0.15, 0.05, 0.79);

type KeyboardRef = {
  accessoryHeight: number;
  height: number;
  notVisibleHeight: number;
  duration: number;
};

const defaultRefValues: KeyboardRef = {
  accessoryHeight: 0,
  height: 0,
  notVisibleHeight: 0,
  duration: 0,
};

export const useKeyboardMeasurements = () => {
  const keyboard = useRef<KeyboardRef>(defaultRefValues);
  const animatedKeyboardHeight = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const onKeyboardWillShow = (event: KeyboardEvent) => {
    Animated.timing(animatedKeyboardHeight, {
      toValue: event.endCoordinates.height,
      duration: event.duration,
      useNativeDriver: false,
      easing: KEYBOARD_EASING,
    }).start();
    keyboard.current.height = event.endCoordinates.height;
    keyboard.current.duration = event.duration;
  };

  const onKeyboardWillHide = (event: KeyboardEvent) => {
    Animated.timing(animatedKeyboardHeight, {
      toValue: keyboard.current.accessoryHeight + insets.bottom,
      duration: event.duration,
      useNativeDriver: false,
    }).start();
    keyboard.current.height = keyboard.current.accessoryHeight;
    keyboard.current.notVisibleHeight =
      keyboard.current.accessoryHeight + insets.bottom;
  };

  useKeyboard({
    onKeyboardWillShow,
    onKeyboardWillHide,
  });

  return {
    keyboard: {
      ...keyboard,
      animatedKeyboardHeight,
    },
  };
};
