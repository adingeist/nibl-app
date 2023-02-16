import React from 'react';
import { Logo, StyledHeader } from './styles/Header.styled';

export default function Header() {
  return (
    <>
      <StyledHeader>
        <Logo src="./images/niblet-text-logo.svg" alt="Niblet logo" />
      </StyledHeader>
    </>
  );
}
