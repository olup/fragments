import styled from "@emotion/styled/macro";
import { useAppStore } from "contexts/appStore";
import { FC } from "react";

const OptionBatStyled = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  padding: 5px;
  opacity: 0;
  background-color: ${(p) => p.theme.colors.pageBackgroundColor};
  color: ${(p) => p.theme.colors.textColor};

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
      <Option
        onClick={() =>
          set({
            useDarkMode: !useDarkMode,
          })
        }
      >
        Dark Theme {useDarkMode ? "ON" : "OFF"}
      </Option>
    </OptionBatStyled>
  );
};
