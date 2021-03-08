import { useAuth0 } from "@auth0/auth0-react";
import { Container, Main, Body, Flex } from "components/Layout";
import { Side } from "components/Side";
import { FragmentPage } from "pages/FragmentPage";
import { Feed } from "pages/Feed";
import { Home } from "pages/Home";
import { TagPage } from "pages/TagPage";
import React from "react";
import {
  BrowserRouter as Router,
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Loading } from "components/Loading";
import humanId from "human-id";
import { HiOutlinePlus } from "react-icons/hi";
import { Button } from "components/Button";

export const MainRouter = () => {
  const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0();

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
              <Route path="/handle/new">
                <Navigate
                  to={
                    "/handle/" + humanId({ capitalize: false, separator: "-" })
                  }
                />
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
