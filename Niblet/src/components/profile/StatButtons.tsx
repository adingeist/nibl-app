import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';

interface StatButtonProps {
  number?: number;
  label: string;
  onPress?: () => void;
}

export const StatButton = ({ number, label, onPress }: StatButtonProps) => {
  return (
    <Pressable onPress={onPress} style={styles.statContainer}>
      <Text variant="bodyMedium" style={styles.statNumber}>
        {number === undefined ? '-' : number}
      </Text>
      <Text variant="bodySmall">{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  statContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  statNumber: {
    fontWeight: '500',
  },
});
