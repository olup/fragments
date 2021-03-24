import { Body, Container, Main } from "components/Layout";
import { OptionBar } from "components/OptionBar";
import { Side } from "components/Side";
import { useAppStore } from "hooks/appStore";
import { useAuth } from "hooks/useAuth";
import { useTypeWriterPos } from "hooks/useTypewriterPos";
import { Feed } from "pages/Feed";
import { FragmentPage } from "pages/FragmentPage";
import { Home } from "pages/Home";
import { LoginPage } from "pages/LoginPage";
import { SettingsPage } from "pages/SettingsPage";
import { TagPage } from "pages/TagPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export const MainRouter = () => {
  const useTypewriterScroll = useAppStore((s) => s.useTypewriterMode);
  useTypeWriterPos(useTypewriterScroll);
  const { isLoggedIn, isLoading } = useAuth();
  const { repo } = useAppStore();

  if (isLoading) return null;

  if (!isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<LoginPage />}></Route>
        </Routes>
      </Router>
    );
  }

  if (!repo) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<SettingsPage />}></Route>
        </Routes>
      </Router>
    );
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
