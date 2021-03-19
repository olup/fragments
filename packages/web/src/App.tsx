import { ApolloProvider } from "@apollo/client";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { ThemeProvider } from "@emotion/react";
import { useAppStore } from "contexts/appStore";
import { useEngine } from "contexts/engine";
import { GlobalStyles } from "GlobalStyles";
import { useInitializeApolloClient } from "libs/apollo";
import { buildIndex } from "libs/engine";
import { github } from "libs/github";
import React, { useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";
import { darkTheme, lightTheme } from "theme";
import { MainRouter } from "./MainRouter";

const AuthorizedApp = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { client } = useInitializeApolloClient(getAccessTokenSilently);
  const reset = useEngine((s) => s.actions.reset);

  useIdleTimer({
    timeout: 5 * 1000,
    onIdle: () => {
      github.commitStaged();
    },
  });

  useEffect(() => {
    github.getFragmentsContent().then((fragments) => {
      reset(buildIndex(fragments));
    });
  }, []);

  return (
    <ApolloProvider client={client}>
      <StyledApp />
    </ApolloProvider>
  );
};

const StyledApp = () => {
  const useDarkMode = useAppStore((s) => s.useDarkMode);
  return (
    <ThemeProvider theme={useDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <MainRouter />
    </ThemeProvider>
  );
};

const App = () => (
  <Auth0Provider
    domain="fragment-app.eu.auth0.com"
    clientId="Zt12A3VhpiI83mOPs3S0MgOqf1NpWO94"
    redirectUri={window.location.origin}
    audience="https://fragment.ml"
  >
    <AuthorizedApp />
  </Auth0Provider>
);

export default App;
