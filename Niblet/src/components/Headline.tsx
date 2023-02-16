import { useTheme } from '@src/hooks/useTheme';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

type HeadlineProps = { addPadding?: boolean } & React.ComponentProps<
  typeof Text
>;

export const Headline = ({
  style,
  addPadding,
  children,
  ...props
}: HeadlineProps) => {
  const { colors, screenMargin } = useTheme();

  return (
    <Text
      variant="headlineMedium"
      style={[
        styles.title,
        {
          color: colors.primary,
          paddingHorizontal: addPadding ? screenMargin : 0,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: { marginBottom: 10 },
});
