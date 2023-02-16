import React from 'react';
import { Text } from 'react-native-paper';

import { useTheme } from '@src/hooks/useTheme';

type HeadlineProps = React.ComponentProps<typeof Text>;

export const HeadlineSmall = ({ style, children, ...props }: HeadlineProps) => {
  const { colors } = useTheme();

  return (
    <Text
      variant="headlineSmall"
      style={[{ color: colors.primary }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};
