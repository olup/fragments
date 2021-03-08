import styled from "@emotion/styled";
import { Flex } from "./Layout";

export const Button = styled(Flex)`
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 20px;
  background-color: #d9d9d9;
  color: #4d4d4d;
  cursor: pointer;
  align-items: center;

  &:hover {
    color: #d9d9d9;
    background-color: #4d4d4d;
  }

  svg {
    margin-right: 10px;
  }
`;
