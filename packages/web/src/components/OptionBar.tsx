import { useColorMode } from "@chakra-ui/color-mode";
import styled from "@emotion/styled/macro";
import { useAppStore } from "hooks/appStore";
import { useEngine } from "hooks/engine";
import { FC } from "react";

const OptionBatStyled = styled.div`
  display: flex;
  position: fixed;
  background-color: #f9f9f9;
  top: 0;
  right: 0;
  padding: 5px;
  opacity: 0;

  &:hover {
    opacity: 1;
  }
  z-index: 100;
`;

const Option = styled.div`
  padding-top: 2px;
  padding-bottom: 2px;
  margin-right: 5px;
  margin-left: 5px;
  cursor: pointer;
  &:hover {
    border-bottom: 1px dashed;
  }

  /* If you want to implement it in very old browser-versions */
  -webkit-user-select: none; /* Chrome/Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */

  /* The rule below is not implemented in browsers yet */
  -o-user-select: none;

  /* The rule below is implemented in most browsers by now */
  user-select: none;
`;
export const OptionBar: FC = () => {
  const { set, useDarkMode, useTypewriterMode } = useAppStore((s) => s);
  const commit = useEngine((s) => s.actions.commit);
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <OptionBatStyled>
      <Option
        onClick={() =>
          set({
            useTypewriterMode: !useTypewriterMode,
          })
        }
      >
        Typewriter Mode {useTypewriterMode ? "ON" : "OFF"}
      </Option>
      <Option onClick={() => toggleColorMode()}>
        Use {colorMode === "light" ? "Dark" : "Light"} Theme
      </Option>
      <Option onClick={() => commit()}>Commit</Option>
    </OptionBatStyled>
  );
};
