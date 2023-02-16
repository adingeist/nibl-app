import React from 'react';
import { View, StyleSheet } from 'react-native';

import { AppIconButton } from '@src/components/AppIconButton';
import { useTheme } from '@src/hooks/useTheme';

type DeleteOrConfirmButtonsProps = {
  onDeletePress: () => void;
  onConfirmPress: () => void;
};

export const DeleteOrConfirmButtons = ({
  onConfirmPress,
  onDeletePress,
}: DeleteOrConfirmButtonsProps) => {
  const theme = useTheme();

  return (
    <View style={styles.buttonContainer}>
      <AppIconButton
        containerStyle={[
          {
            backgroundColor: theme.colors.error,
            borderRadius: theme.roundness,
          },
          styles.button,
        ]}
        color={theme.colors.background}
        name="trash-can-outline"
        size={20}
        onPress={onDeletePress}
      />
      <AppIconButton
        containerStyle={[
          {
            backgroundColor: theme.colors.primary,
            borderRadius: theme.roundness,
          },
          styles.button,
        ]}
        color={theme.colors.background}
        name="check"
        size={20}
        onPress={onConfirmPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 4,
    flex: 0.48,
  },

  button: {
    flex: 0.46,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
