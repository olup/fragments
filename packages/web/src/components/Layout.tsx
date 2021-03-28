import { useColorModeValue } from "@chakra-ui/color-mode";
import { Box, BoxProps, FlexProps, Flex } from "@chakra-ui/layout";
import styled from "@emotion/styled";
import { FC } from "react";

export const Expander = styled.div`
  flex: 1;
`;

export const Main: FC<FlexProps> = ({ ...props }) => {
  return <Flex backgroundColor={"pageBg"} p={5} minHeight="100vh" {...props} />;
};

// styled(Box)`
//   flex: 1;
//   min-height: 100vh;
//   display: flex;
//   justify-content: center;
//   padding-bottom: 90px;

//   background-color: #eee;
// `;

export const Body = styled(Box)`
  flex: 1;
  justify-content: center;
  display: flex;
  max-width: 100%;
`;

export const Container = styled(Box)`
  width: 1000px;
  max-width: 100%;
  padding-top: 100px;
`;

export { Flex } from "@chakra-ui/react";
