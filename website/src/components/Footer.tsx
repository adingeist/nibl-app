import React from 'react';
import { Flex } from './styles/Flex.styled';
import { StyledFooter } from './styles/Footer.styled';

export default function Footer() {
  return (
    <StyledFooter>
      <Flex>
        <ul>
          <li>About us</li>
          <li>Privacy</li>
          <li>Terms</li>
          <li>Contact</li>
        </ul>
      </Flex>
    </StyledFooter>
  );
}
