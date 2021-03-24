import { useColorModeValue } from "@chakra-ui/color-mode";
import { Box, BoxProps, FlexProps, Flex } from "@chakra-ui/layout";
import styled from "@emotion/styled";
import { FC } from "react";

export const Expander = styled.div`
  flex: 1;
`;

export const Main: FC<FlexProps> = ({ ...props }) => {
  return <Flex backgroundColor="#f3f3f3" p={5} minHeight="100vh" {...props} />;
};

// styled(Box)`
//   flex: 1;
//   min-height: 100vh;
//   display: flex;
//   justify-content: center;
//   padding-bottom: 30px;

//   background-color: #eee;
// `;

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
