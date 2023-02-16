import { Platform } from 'react-native';
import { MD3LightTheme as DefaultLight } from 'react-native-paper';

const fontFamily = Platform.OS === 'android' ? 'Roboto' : 'Avenir';

export const lightTheme = {
  ...DefaultLight,
  dark: false,
  roundness: 3,
  colors: {
    ...DefaultLight.colors,
    background: 'hsla(0,0%,100%, 1)',
    backdrop: 'hsla(0,0%,0%, 1)',
    oppositeBackground: 'hsla(0,0%,0%, 1)',
    primary: 'hsla(120, 100%, 40%, 1)',
    secondary: 'hsla(199, 100%, 50%, 1)',
    tertiary: 'hsla(117, 64%, 50%, 1)',

    success: 'hsla(117, 64%, 50%, 1)',
    error: 'hsla(0, 100%, 65%, 1)',

    outline: 'hsla(0,0%,70%, 1)',

    extraLight: 'hsla(0,0%,95%, 1)',
    light: 'hsla(0,0%,88%, 1)',
    medium: 'hsla(0,0%,70%, 1)',
    dark: 'hsla(0,0%,44%, 1)',

    like: '#f55',

    fat: 'rgba(247,207,93,1)',
    carbs: 'rgba(82,180,194,1)',
    protein: 'rgba(233,97,84,1)',
  },
  typescale: {
    bodyLarge: { ...DefaultLight.typescale.bodyLarge, fontSize: 18 },
    bodyMedium: { ...DefaultLight.typescale.bodyMedium, fontSize: 16 },
    bodySmall: { ...DefaultLight.typescale.bodySmall, fontSize: 14 },
    displayLarge: { ...DefaultLight.typescale.displayLarge },
    displayMedium: { ...DefaultLight.typescale.displayMedium },
    displaySmall: { ...DefaultLight.typescale.displaySmall },
    headlineLarge: {
      ...DefaultLight.typescale.headlineLarge,
      fontFamily,
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 0,
    },
    headlineMedium: { ...DefaultLight.typescale.headlineMedium },
    headlineSmall: {
      ...DefaultLight.typescale.headlineSmall,
      fontSize: 16,
    },
    labelLarge: { ...DefaultLight.typescale.labelLarge },
    labelMedium: { ...DefaultLight.typescale.labelMedium },
    labelSmall: { ...DefaultLight.typescale.labelSmall },
    titleLarge: { ...DefaultLight.typescale.titleLarge },
    titleMedium: { ...DefaultLight.typescale.titleMedium },
    titleSmall: { ...DefaultLight.typescale.titleSmall },
  },
  screenMargin: 14,
};

export const darkTheme: typeof lightTheme = {
  ...lightTheme,
  dark: true,
  colors: {
    ...DefaultLight.colors,
    background: 'hsla(0,0%,0%, 1)',
    backdrop: 'hsla(0,0%,0%, 1)',
    oppositeBackground: 'hsla(0,0%,100%, 1)',
    primary: 'hsla(19, 100%, 50%, 1)',
    secondary: 'hsla(180, 100%, 50%, 1)',
    tertiary: 'hsla(117, 64%, 50%, 1)',

    success: 'hsla(117, 64%, 50%, 1)',
    error: 'hsla(0, 53%, 53%, 1)',

    extraLight: 'hsla(0,0%,20%,1)',
    light: 'hsla(0,0%,30%, 1)',
    medium: 'hsla(0,0%,40%, 1)',
    dark: 'hsla(0,0%,50%, 1)',

    like: '#f55',

    fat: 'rgba(247,207,93,1)',
    carbs: 'rgba(82,180,194,1)',
    protein: 'rgba(233,97,84,1)',
  },
};

export type NibletTheme = typeof lightTheme;
