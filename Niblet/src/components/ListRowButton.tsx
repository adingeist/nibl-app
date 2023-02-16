import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, useTheme } from 'react-native-paper';
import React, { useState } from 'react';

export type ListRowButtonProps = {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  text: string;
  textColor?: string;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
};

export default function ListRowButton({
  iconName,
  text,
  textColor,
  onPress,
}: ListRowButtonProps) {
  const theme = useTheme();
  const [color, setColor] = useState(theme.colors.background);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setColor(theme.colors.light)}
      onPressOut={() => setColor(theme.colors.background)}
      style={[{ backgroundColor: color }, styles.container]}
    >
      <>
        <MaterialCommunityIcons
          size={26}
          color={textColor || theme.colors.oppositeBackground}
          style={styles.leftIcon}
          name={iconName}
        />
        <Text
          style={[
            {
              color: textColor || theme.colors.oppositeBackground,
            },
            styles.text,
          ]}
          variant="bodyMedium"
        >
          {text}
        </Text>
        <MaterialCommunityIcons
          size={22}
          name="chevron-right"
          style={styles.chevronRight}
        />
      </>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 3,
    alignItems: 'center',
  },
  leftIcon: { paddingHorizontal: 20, paddingVertical: 10 },
  chevronRight: { marginLeft: 'auto', paddingRight: 20 },
  text: { fontWeight: '500' },
});
