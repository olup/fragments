import styled from "@emotion/styled";

export const Link = styled.span<{ active?: boolean }>`
  cursor: pointer;
  color: ${(p) => p.theme.colors.textColor};
  opacity: ${(p) => (p.active ? 0.8 : 0.3)};
  &:hover {
    opacity: 0.8;
  }
`;
