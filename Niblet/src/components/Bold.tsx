import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

type BoldProps = ComponentProps<typeof Text>;

export const Bold = ({ children, style, ...props }: BoldProps) => (
  <Text style={[styles.boldText, style]} {...props}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold',
  },
});
