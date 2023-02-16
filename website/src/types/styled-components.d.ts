import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      white: string;
      nearWhite: string;
      extraLight: string;
      light: string;
      medium: string;
      dark: string;
      extraDark: string;
      nearBlack: string;
      black: string;
      // *-*-*-* Theme Colors *-*-*-*
      primary: string;
      secondary: string;
      tertiary: string;
      quaternary: string;
      quinary: string;
      warning: string;
      success: string;
    };
    mobile: '768px';
  }
}
