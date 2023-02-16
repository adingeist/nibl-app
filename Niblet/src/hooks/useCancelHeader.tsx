import React, { useLayoutEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

import { LinkText } from '@src/components/LinkText';
import { useTheme } from '@src/hooks/useTheme';

type useCancelHeaderParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: NavigationProp<any>;
  isFormChanged: () => boolean;
  onDone: () => void;
};

export const useCancelHeader = ({
  navigation,
  isFormChanged,
  onDone,
}: useCancelHeaderParams) => {
  const { colors } = useTheme();

  const handleGoBack = () => {
    if (isFormChanged()) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to cancel them?',
        [
          { text: 'Continue Editing', style: 'default' },
          {
            text: 'Discard Changes',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <LinkText
          variant="bodyLarge"
          style={[{ color: colors.dark }, styles.cancel]}
          onPress={handleGoBack}
        >
          Cancel
        </LinkText>
      ),
      headerRight: () => (
        <LinkText variant="bodyLarge" onPress={onDone}>
          Done
        </LinkText>
      ),
    });
  });
};

const styles = StyleSheet.create({
  cancel: { fontWeight: '400' },
});
