import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@chakra-ui/button";
import { Box, Center, Flex, Kbd } from "@chakra-ui/layout";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useEngine } from "contexts/engine";
import { useAuth } from "hooks/useAuth";
import humanId from "human-id";
import React, { FC, useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  HiArrowLeft,
  HiArrowRight,
  HiHashtag,
  HiMenu,
  HiOutlinePlus,
  HiX,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce/lib";

const SIDE_WIDTH = 250;

const SideStyled = styled.div<{ isVisible?: boolean }>`
  width: ${(p) => (p.isVisible ? SIDE_WIDTH : 0)}px;
  box-sizing: border-box;
  overflow: hidden;
  // color: #f1faee;
  transition: 0.5s;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  font-size: 22px;
  z-index: 100;
`;

const Inside = styled.div`
  background-color: #383838;
  width: ${SIDE_WIDTH}px;
  //padding: 20px;
  padding-top: 20px;
  height: 100%;
  box-sizing: border-box;
`;

const FixLink = styled.div<{ isSideOpen: boolean }>`
  position: fixed;
  display: inline-block;
  font-size: 20px;
  top: 10px;
  left: ${(p) => (p.isSideOpen ? SIDE_WIDTH + 10 : 10)}px;
  padding: 5px;
  color: #222;
  opacity: 0.5;
  z-index: 200;
  transition: 0.5s;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
`;

const SideLink = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 3px;
  font-size: 18px;

  padding-left: 20px;
  color: #ccc;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const SearchInput = styled.input`
  padding: 10px 20px;
  box-sizing: border-box;
  border: none;
  outline: none;
  font-size: 18px;
  width: 100%;
  opacity: 0.5;
  &:hover,
  &:focus {
    opacity: 1;
  }
`;

export const Side: FC = () => {
  const { logout } = useAuth();
  const [isVisible, setIsVisbile] = useState(false);
  const [search, setSearch] = useState("");
  const tagsByName = useEngine((s) => s.engine.tags);
  const tags = Object.keys(tagsByName);
  const [debouncedSearch] = useDebounce(search, 300);
  const { textColor } = useTheme().colors;
  const navigate = useNavigate();

  const searchFragments = useEngine((s) => s.actions.searchFragment);
  const fragmentsFound = searchFragments(debouncedSearch);

  const handleToggleShow = useCallback(() => {
    setIsVisbile(!isVisible);
    setSearch("");
  }, [isVisible, setIsVisbile, setSearch]);

  const navigateToNew = () => {
    const url = "/handle/" + humanId({ capitalize: false, separator: "-" });
    navigate(url);
  };

  useHotkeys("ctrl+b", (e) => {
    e.preventDefault();
    navigateToNew();
  });

  return (
    <>
      <SideStyled
        isVisible={isVisible}
        style={{ position: "relative" }}
      ></SideStyled>

      <FixLink onClick={handleToggleShow} isSideOpen={isVisible}>
        {isVisible ? <HiX /> : <HiMenu />}
      </FixLink>
      <SideStyled isVisible={isVisible}>
        <Inside>
          <Box p={2}>
            <Button
              onClick={navigateToNew}
              isFullWidth
              color="#ccc"
              leftIcon={<HiOutlinePlus size={15} />}
            >
              New fragment
            </Button>
          </Box>

          <Flex mb={5}>
            <SearchInput
              placeholder="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Flex>

          {!search && (
            <>
              <Link to={"/"}>
                <Title as={SideLink}>Home</Title>
              </Link>

              <Link to={"/feed"}>
                <Title as={SideLink}>Feed</Title>
              </Link>

              <Title as={SideLink}>Tags</Title>
              {tags?.map((tag) => (
                <Link to={"/tag/" + tag}>
                  <SideLink key={tag}>
                    <HiHashtag size={20} style={{ marginRight: 10 }} />
                    {tag}
                  </SideLink>
                </Link>
              ))}

              <Title
                onClick={() => logout()}
                style={{ marginTop: 40 }}
                as={SideLink}
              >
                Log out
              </Title>
            </>
          )}

          {search && (
            <>
              {fragmentsFound?.map((frament) => (
                <SideLink>
                  <Link to={"/handle/" + frament.handle}>{frament.handle}</Link>
                </SideLink>
              ))}
            </>
          )}
        </Inside>
      </SideStyled>
    </>
  );
};
