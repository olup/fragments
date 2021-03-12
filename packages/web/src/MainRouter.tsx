import { useAuth0 } from "@auth0/auth0-react";
import { Body, Container, Flex, Main } from "components/Layout";
import { Loading } from "components/Loading";
import { OptionBar } from "components/OptionBar";
import { Side } from "components/Side";
import { useAppStore } from "contexts/appStore";
import { useTypeWriterPos } from "hooks/useTypewriterPos";
import { Feed } from "pages/Feed";
import { FragmentPage } from "pages/FragmentPage";
import { Home } from "pages/Home";
import { TagPage } from "pages/TagPage";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export const MainRouter = () => {
  const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0();

  const useTypewriterScroll = useAppStore((s) => s.useTypewriterMode);

  useTypeWriterPos(useTypewriterScroll);

  if (isLoading)
    return (
      <Main>
        <Flex justify="center" align="center">
          <Loading />
        </Flex>
      </Main>
    );

  if (!isAuthenticated) {
    loginWithRedirect();
    return <Main></Main>;
  }

  return (
    <Router>
      <Main>
        <OptionBar />
        <Side />
        <Body>
          <Container>
            <Routes>
              <Route path="/">
                <Home />
              </Route>
              <Route path="/feed">
                <Feed />
              </Route>
              <Route path="/handle/:handle">
                <FragmentPage />
              </Route>
              <Route path="/tag/:tag">
                <TagPage />
              </Route>
            </Routes>
          </Container>
        </Body>
      </Main>
    </Router>
  );
};
