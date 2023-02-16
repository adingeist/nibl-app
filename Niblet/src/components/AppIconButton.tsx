import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { ComponentProps } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

type AppIconButtonProps = {
  containerStyle: StyleProp<ViewStyle>;
} & ComponentProps<typeof MaterialCommunityIcons>;

export const AppIconButton = ({
  containerStyle,
  onPress,
  ...props
}: AppIconButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <MaterialCommunityIcons {...props} />
    </TouchableOpacity>
  );
};
