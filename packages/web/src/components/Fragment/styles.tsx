import styled from "@emotion/styled/macro";
import { Flex } from "components/Layout";
import AutosizeInput from "react-input-autosize";

export const Info = styled(Flex)`
  font-size: 20px;
  color: #ccc;
  display: inline-flex;
`;

export const HideOut = styled.div``;
export const FragmentStyled = styled.div`
  padding: 20px 30px;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 7px 7px 0px 0px #00000008;
  ${HideOut} {
    opacity: 0;
  }

  &:hover ${HideOut} {
    opacity: 1;
  }
`;

export const HandleInput = styled(AutosizeInput)`
  margin-bottom: 20px;
  padding-bottom: 5px;

  & input {
    &:hover,
    &:focus {
      background-color: #e2f8ff;
      box-shadow: 0 0 0 5px #e2f8ff;
      color: #222;
    }
    padding: 0;
    color: #ccc;
    min-width: 0;
    border: none;
    outline: none;
    background-color: transparent;
    font-family: "Inconsolata", monospace;
    font-size: 20px;
  }
`;

export const BackLinksLine = styled(Flex)`
  font-size: 20px;
  color: #ccc;
  svg {
    margin-right: 10px;
  }
`;
