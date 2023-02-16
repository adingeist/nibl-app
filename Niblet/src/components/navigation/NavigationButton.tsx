import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@src/hooks/useTheme';

type NavigationButtonProps = React.ComponentProps<
  typeof MaterialCommunityIcons
>;

export const NavigationButton = (props: NavigationButtonProps) => {
  const theme = useTheme();

  return (
    <MaterialCommunityIcons color={theme.colors.primary} size={28} {...props} />
  );
};
