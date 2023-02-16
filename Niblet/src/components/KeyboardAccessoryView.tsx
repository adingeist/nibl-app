import { useKeyboardMeasurements } from '@src/hooks/useKeyboardMeasurements';
import React from 'react';
import {
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  InputAccessoryView,
  View,
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

type KeyboardAccessoryViewProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function KeyboardAccessoryView({
  children,
  style,
}: KeyboardAccessoryViewProps): JSX.Element {
  const { keyboard } = useKeyboardMeasurements();
  const insets = useSafeAreaInsets();

  const handleLayout = (event: LayoutChangeEvent) => {
    keyboard.current.accessoryHeight = event.nativeEvent.layout.height;
    keyboard.current.notVisibleHeight =
      event.nativeEvent.layout.height + insets.bottom;
  };

  if (Platform.OS === 'ios') {
    return (
      <InputAccessoryView>
        <View style={style} onLayout={handleLayout}>
          {children}
        </View>
      </InputAccessoryView>
    );
  } else {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            bottom: keyboard.animatedKeyboardHeight,
          },
        ]}
        onLayout={handleLayout}
      >
        {children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    zIndex: 50,
  },
});
