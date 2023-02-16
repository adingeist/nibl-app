import React, { useCallback } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { NavigationButton } from '@src/components/navigation/NavigationButton';
import { Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type BackButtonProps = Omit<
  React.ComponentProps<typeof MaterialCommunityIcons>,
  'name'
>;

// Themed back button that pops the current screen off the navigation stack

export default function BackButton(props: BackButtonProps): JSX.Element {
  const navigation = useNavigation();

  const SLOP = 5;

  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <Pressable
      hitSlop={{ bottom: SLOP, left: SLOP, right: SLOP, top: SLOP }}
      style={styles.container}
      onPress={handleGoBack}
    >
      <NavigationButton
        {...props}
        size={35}
        name="chevron-left"
        style={styles.icon}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    position: 'absolute',
    right: 5,
  },
});
