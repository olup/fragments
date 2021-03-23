import { Box } from "@chakra-ui/layout";
import styled from "@emotion/styled";

export const Expander = styled.div`
  flex: 1;
`;

export const Main = styled(Box)`
  flex: 1;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding-bottom: 30px;

  background-color: #eee;
`;

export const Body = styled(Box)`
  flex: 1;
  justify-content: center;
  display: flex;
`;

export const Container = styled(Box)`
  width: 1000px;
  padding-top: 100px;
`;

export { Flex } from "@chakra-ui/react";
