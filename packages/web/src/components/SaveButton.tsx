import { useColorMode } from "@chakra-ui/color-mode";
import Icon from "@chakra-ui/icon";
import { Box, Flex } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { useEngine } from "hooks/engine";
import { FC, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { MdHdrWeak, MdSave, MdWbSunny } from "react-icons/md";
import { WiMoonAltFull, WiMoonAltNew } from "react-icons/wi";

export const SaveButton: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const commit = useEngine((s) => s.actions.commit);
  const { colorMode, toggleColorMode } = useColorMode();
  useHotkeys("ctrl+s", (e) => {
    e.preventDefault();
    onCommit();
  });
  const onCommit = async () => {
    setIsLoading(true);
    await commit();
    setIsLoading(false);
  };
  return (
    <Flex position="fixed" top={5} right={5}>
      <Flex
        bg="#ddd"
        onClick={() => toggleColorMode()}
        cursor="pointer"
        padding={3}
        fontSize={20}
        align="center"
        justify="center"
        zIndex={100}
        opacity={0.8}
        borderRadius={2}
        height="45px"
        width="45px"
        mr={3}
      >
        {colorMode === "light" && <Icon as={WiMoonAltFull} opacity={0.5} />}
        {colorMode === "dark" && <Icon as={WiMoonAltNew} opacity={0.5} />}
      </Flex>
      <Flex
        bg="#ddd"
        onClick={onCommit}
        cursor="pointer"
        padding={3}
        fontSize={20}
        align="center"
        justify="center"
        zIndex={100}
        opacity={0.8}
        borderRadius={2}
        height="45px"
        width="45px"
      >
        {!isLoading && <Icon as={MdSave} opacity={0.5} />}
        {isLoading && <Spinner opacity={0.5} size="sm" />}
      </Flex>
    </Flex>
  );
};
