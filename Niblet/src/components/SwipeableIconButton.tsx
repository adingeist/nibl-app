import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { ComponentProps } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { useTheme } from '@src/hooks/useTheme';

type SwipeableIconButtonProps = {
  containerStyle?: StyleProp<ViewStyle>;
  containerColor?: string;
} & ComponentProps<typeof MaterialCommunityIcons>;

export const SwipeableIconButton = ({
  color,
  containerColor,
  containerStyle,
  ...props
}: SwipeableIconButtonProps) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: containerColor
            ? containerColor
            : theme.colors.primary,
        },
        styles.container,
        containerStyle,
      ]}
    >
      <MaterialCommunityIcons
        color={color ? color : theme.colors.background}
        size={24}
        {...props}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {},
});
