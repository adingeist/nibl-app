import React from 'react';
import Header from './components/Header';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import GlobalStyles from './components/styles/Global';
import { StyledBody } from './components/styles/Body.styled';
import Footer from './components/Footer';
import { Flex } from './components/styles/Flex.styled';

const theme: DefaultTheme = {
  colors: {
    background: 'hsla(0,0%,100%, 1)',
    white: 'hsla(0,0%,100%, 1)',
    nearWhite: 'hsla(0,0%,99%, 1)',
    extraLight: 'hsla(0,0%,96%, 1)',
    light: 'hsla(0,0%,88%, 1)',
    medium: 'hsla(0,0%,70%, 1)',
    dark: 'hsla(0,0%,44%, 1)',
    extraDark: 'hsla(0,0%,26%, 1)',
    nearBlack: 'hsla(0,0%,12%, 1)',
    black: 'hsla(0,0%,0%, 1)',
    // *-*-*-* Theme Colors *-*-*-*
    primary: 'hsla(19, 100%, 50%, 1)',
    secondary: 'hsla(199, 100%, 50%, 1)',
    tertiary: 'hsla(0, 74%, 59%, 1)',
    quaternary: 'hsla(117, 64%, 50%, 1)',
    quinary: 'hsla(291, 68%, 68%, 1)',
    warning: 'hsla(0, 100%, 65%, 1)',
    success: 'hsla(90, 100%, 45%, 1)',
  },
  mobile: '768px',
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Header />
      <Flex>
        <h2>Watch and discover amazing recipes</h2>
      </Flex>
      <Flex>
        <h2>Share what you make</h2>
      </Flex>
      <Flex>
        <h2>Grow your following</h2>
      </Flex>
      <Flex>
        <h2>Get your recipes' groceries</h2>
      </Flex>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
