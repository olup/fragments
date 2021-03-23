import { ApolloProvider } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { ChakraProvider } from "@chakra-ui/react";
import { useAppStore } from "contexts/appStore";
import { useEngine } from "contexts/engine";
import { GlobalStyles } from "GlobalStyles";
import { useAuth } from "hooks/useAuth";
import { useInitializeApolloClient } from "libs/apollo";
import { buildIndex } from "libs/engine";
import { github } from "libs/github";
import React, { useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";
import { theme } from "theme";
import { MainRouter } from "./MainRouter";

const App = () => {
  const reset = useEngine((s) => s.actions.reset);
  const { init, token, user, isLoading } = useAuth();
  const { repo } = useAppStore();

  useIdleTimer({
    timeout: 5 * 1000,
    onIdle: () => {
      github.commitStaged();
    },
  });

  useEffect(() => {
    if (token) {
      github.init(token);
      if (repo) {
        github.setRepo(repo.owner, repo.name);
        github
          .getFragmentsContent()
          .then((fragments) => reset(buildIndex(fragments)));
      }
    }
  }, [token, repo]);

  useEffect(() => {
    init();
  }, []);

  return <StyledApp />;
};

const StyledApp = () => {
  const useDarkMode = useAppStore((s) => s.useDarkMode);
  return (
    <ChakraProvider theme={theme}>
      <GlobalStyles />
      <MainRouter />
    </ChakraProvider>
  );
};

// const App = () => (
//   <Auth0Provider
//     domain="fragment-app.eu.auth0.com"
//     clientId="Zt12A3VhpiI83mOPs3S0MgOqf1NpWO94"
//     redirectUri={window.location.origin}
//     audience="https://fragment.ml"
//   >
//     <AuthorizedApp />
//   </Auth0Provider>
// );

export default App;
