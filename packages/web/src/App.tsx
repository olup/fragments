import {
  ChakraProvider,
  ColorModeProvider,
  CSSReset,
  ThemeProvider,
  useColorMode,
  useColorModePreference,
  useColorModeValue,
} from "@chakra-ui/react";
import { GlobalStyles } from "GlobalStyles";
import { useAppStore } from "hooks/appStore";
import { useAppInit } from "hooks/useAppInit";
import { GithubProvider } from "hooks/useGithub";
import { darkTheme, theme } from "theme";
import { MainRouter } from "./MainRouter";

const AppWithContext = () => {
  useAppInit();
  const { colorMode } = useColorMode();
  const modedTheme = { ...theme, ...(colorMode === "dark" ? darkTheme : {}) };
  return (
    <ThemeProvider theme={modedTheme}>
      <GlobalStyles />
      <CSSReset />
      <MainRouter />
    </ThemeProvider>
  );
};

const App = () => (
  <GithubProvider>
    <ColorModeProvider
      options={{ initialColorMode: "light", useSystemColorMode: false }}
    >
      <AppWithContext />
    </ColorModeProvider>
  </GithubProvider>
);

export default App;
