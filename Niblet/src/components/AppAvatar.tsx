import React from 'react';
import { Avatar } from 'react-native-paper';

import { Pressable } from 'react-native';

type AppAvatarProps = {
  uri?: string;
  onPress?: () => void;
} & Omit<React.ComponentProps<typeof Avatar.Image>, 'source'>;

export const AppAvatar = ({ uri, onPress, ...props }: AppAvatarProps) => {
  return (
    <Pressable onPress={onPress}>
      <Avatar.Image
        source={uri ? { uri } : require('@src/assets/user.png')}
        {...props}
      />
    </Pressable>
  );
};
