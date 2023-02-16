import { Text } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';

type AppErrorMsgProps = {
  error?: string;
  isVisible: boolean;
};

export default function AppErrorMessage({
  error,
  isVisible,
}: AppErrorMsgProps) {
  const { colors } = useTheme();

  if (!isVisible || !error) {
    return null;
  }

  return (
    <Text style={{ color: colors.error, alignSelf: 'flex-start' }}>
      {error}
    </Text>
  );
}
