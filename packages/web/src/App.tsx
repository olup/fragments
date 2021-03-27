import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { GlobalStyles } from "GlobalStyles";
import { useAppStore } from "hooks/appStore";
import { useAppInit } from "hooks/useAppInit";
import { GithubProvider } from "hooks/useGithub";
import { theme } from "theme";
import { MainRouter } from "./MainRouter";

const AppWithContext = () => {
  useAppInit();
  const useDarkMode = useAppStore((s) => s.useDarkMode);
  return (
    <ChakraProvider theme={theme}>
      <GlobalStyles />
      <CSSReset />
      <MainRouter />
    </ChakraProvider>
  );
};

const App = () => (
  <GithubProvider>
    <AppWithContext />
  </GithubProvider>
);

export default App;
