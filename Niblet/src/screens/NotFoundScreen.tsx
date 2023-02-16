import React from 'react';
import { Text } from 'react-native-paper';

import { Screen } from '@src/components/Screen';
import { useTheme } from '@src/hooks/useTheme';

export default function NotFoundScreen(): JSX.Element {
  const { colors } = useTheme();

  return (
    <Screen addPadding>
      <Text style={{ color: colors.primary }} variant="headlineLarge">
        :(
      </Text>
      <Text style={{ color: colors.primary }} variant="headlineLarge">
        Uh oh.
      </Text>
      <Text variant="bodyLarge">{`We couldn't find what you're looking for.`}</Text>
    </Screen>
  );
}
