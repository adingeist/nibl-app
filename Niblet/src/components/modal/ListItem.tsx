import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useTheme } from '@src/hooks/useTheme';

interface ListItemProps {
  text: string;
  iconName: ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress?: () => void;
}

export const ListItem = ({ iconName, onPress, text }: ListItemProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.light }]}
      onPress={onPress}
    >
      <MaterialCommunityIcons name={iconName} style={styles.icon} size={30} />
      <Text style={styles.text} variant="bodyMedium">
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    marginVertical: 5,
  },

  icon: {
    paddingHorizontal: 10,
  },

  text: {
    fontWeight: 'bold',
  },
});
