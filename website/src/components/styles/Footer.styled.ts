import styled from 'styled-components';

export const StyledFooter = styled.div`
  background-color: ${({ theme }) => theme.colors.medium};

  ul li {
    display: inline-block;
    background-color: #eee;
    list-style-type: none;
    margin-right: -4px;
    padding: 10px;
    border-right: 1px solid white;
  }
`;
