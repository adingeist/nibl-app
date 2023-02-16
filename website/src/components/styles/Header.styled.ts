import styled from 'styled-components';

export const StyledHeader = styled.div`
  border-bottom-color: ${({ theme }) => theme.colors.primary};
  border-bottom-width: 1px;
  text-align: center;
`;

export const Logo = styled.img`
  margin: 30px 0;
  width: 50%;
`;
