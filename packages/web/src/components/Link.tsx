import { Box } from "@chakra-ui/layout";
import styled from "@emotion/styled";

export const Link = styled(Box)<{ active?: boolean }>`
  display: inline-block;
  cursor: pointer;
  opacity: ${(p) => (p.active ? 0.8 : 0.3)};
  &:hover {
    opacity: 0.8;
  }
`;
