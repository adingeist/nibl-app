import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type FormErrorMessageProps = {
  isVisible: boolean;
  error: string;
  style?: StyleProp<ViewStyle>;
};

export const FormErrorMessage = ({
  error,
  isVisible,
  style,
}: FormErrorMessageProps) => {
  const theme = useTheme();

  if (!error || !isVisible) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons
        name="alert-circle"
        size={20}
        color={theme.colors.error}
        style={styles.icon}
      />
      <Text variant="bodyMedium" style={{ color: theme.colors.error }}>
        {error}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
    marginBottom: 2,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: { marginRight: 5 },
});
