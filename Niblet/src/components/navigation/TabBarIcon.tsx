import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type TabBarIconProps = {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
  size: number;
};

export default function TabBarIcon({
  name,
  color,
  size,
}: TabBarIconProps): JSX.Element {
  return (
    <View>
      <MaterialCommunityIcons name={name} color={color} size={size} />
    </View>
  );
}
