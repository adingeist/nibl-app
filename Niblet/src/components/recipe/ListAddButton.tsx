import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@src/hooks/useTheme';

type ListAddButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  iconStyle?: StyleProp<ViewStyle>;
};

export const ListAddButton = ({
  disabled,
  label,
  onPress,
  iconStyle,
}: ListAddButtonProps) => {
  const { colors } = useTheme();

  const color = useMemo(
    () => (disabled ? colors.medium : colors.oppositeBackground),
    [colors.medium, colors.oppositeBackground, disabled]
  );

  return (
    <TouchableOpacity
      hitSlop={{ bottom: 16, left: 50, right: 50, top: 16 }}
      style={styles.container}
      disabled={disabled}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name="plus-circle-outline"
        color={color}
        size={20}
        style={[styles.icon, iconStyle]}
      />
      <Text style={[{ color }, styles.text]} variant="bodyMedium">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 'auto',
  },

  icon: {
    marginHorizontal: 5,
  },

  text: {
    fontWeight: 'bold',
  },
});
