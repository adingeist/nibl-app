import {
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { useTheme } from '@src/hooks/useTheme';

type ScreenProps = {
  onPress?: () => void;
  addPadding?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const Screen = ({
  addPadding,
  onPress,
  children,
  style,
}: ScreenProps) => {
  const { colors, screenMargin } = useTheme();

  const handlePress = () => {
    Keyboard.dismiss();
    if (onPress) onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[{ backgroundColor: colors.background }, styles.container]}
    >
      <SafeAreaView
        style={[
          styles.safeArea,
          addPadding
            ? { marginHorizontal: screenMargin, marginTop: screenMargin / 2 }
            : {},
          style,
        ]}
      >
        {children}
      </SafeAreaView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
});
