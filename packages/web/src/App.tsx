import { ApolloProvider } from "@apollo/client";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { ThemeProvider } from "@emotion/react";
import { useAppStore } from "contexts/appStore";
import { GlobalStyles } from "GlobalStyles";
import { useInitializeApolloClient } from "libs/apollo";
import React from "react";
import { darkTheme, lightTheme } from "theme";
import { MainRouter } from "./MainRouter";

const AuthorizedApp = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { client } = useInitializeApolloClient(getAccessTokenSilently);

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
