import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface CameraIconsProps
  extends React.ComponentProps<typeof MaterialCommunityIcons> {
  onPress?: typeof TouchableOpacity['prototype']['props']['onPress'];
  disabled?: boolean;
}

export const CameraIcons = ({
  onPress,
  disabled,
  style,
  ...props
}: CameraIconsProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.container,
        style,
        {
          backgroundColor: disabled
            ? 'rgba(100,100,100,0.2)'
            : 'rgba(100,100,100,0.5)',
        },
      ]}
    >
      <MaterialCommunityIcons
        size={35}
        color={disabled ? '#ddd' : '#fff'}
        {...props}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(100,100,100,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
