import { useTheme as useThemeRNP } from 'react-native-paper';

import type { NibletTheme } from '@src/theme/theme';

export const useTheme = (overrides?: NibletTheme): NibletTheme =>
  useThemeRNP(overrides);
