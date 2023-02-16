import React from 'react';
import { GestureResponderEvent, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type LinkTextProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
} & React.ComponentProps<typeof Text>;

export const LinkText = ({
  children,
  disabled,
  ...paperProps
}: LinkTextProps) => {
  const { colors } = useTheme();

  return (
    <Text
      {...paperProps}
      onPress={disabled ? undefined : paperProps.onPress}
      style={[{ color: colors.primary }, styles.text, paperProps.style]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({ text: { fontWeight: 'bold' } });
