import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { Box, Center, Flex, Kbd } from "@chakra-ui/layout";
import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useAppStore } from "hooks/appStore";
import { useEngine } from "hooks/engine";
import { useAuth } from "hooks/useAuth";
import humanId from "human-id";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  HiArrowLeft,
  HiArrowRight,
  HiHashtag,
  HiMenu,
  HiOutlinePlus,
  HiRefresh,
  HiTag,
  HiX,
} from "react-icons/hi";
import { MdAllOut, MdClose } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce/lib";
import { RiHomeLine } from "react-icons/ri";

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
  height: 100%;
  box-sizing: border-box;
`;

const FixLink = styled(Box)<{ isSideOpen: boolean }>`
  position: fixed;
  display: inline-block;
  font-size: 20px;
  top: 10px;
  left: ${(p) => (p.isSideOpen ? SIDE_WIDTH + 10 : 10)}px;
  padding: 5px;
  opacity: 0.5;
  z-index: 200;
  transition: 0.5s;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

const Title = styled(Box)`
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
  color: #222;
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
  const navigate = useNavigate();
  const set = useAppStore((s) => s.set);

  const searchFragments = useEngine((s) => s.actions.searchFragment);
  const fragmentsFound = useMemo(() => searchFragments(debouncedSearch), [
    debouncedSearch,
  ]);

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

      <FixLink
        onClick={handleToggleShow}
        isSideOpen={isVisible}
        color="fragmentText"
      >
        {isVisible ? <HiX /> : <HiMenu />}
      </FixLink>
      <SideStyled isVisible={isVisible}>
        <Inside>
          <Box p={5}>
            <Button
              onClick={navigateToNew}
              isFullWidth
              variant="outlineRaised"
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
                <Title as={SideLink}>
                  <Icon as={RiHomeLine} mr={3} /> Home
                </Title>
              </Link>

              <Link to={"/feed"}>
                <Title as={SideLink}>
                  <Icon as={HiMenu} mr={3} />
                  Feed
                </Title>
              </Link>

              <Title as={SideLink}>
                <Icon as={HiTag} mr={3} />
                Tags
              </Title>
              <Box mb={5} pl={2}>
                {tags?.map((tag) => (
                  <Link to={"/tag/" + tag} key={tag}>
                    <SideLink key={tag}>
                      <HiHashtag size={20} style={{ marginRight: 10 }} />
                      {tag}
                    </SideLink>
                  </Link>
                ))}
              </Box>

              <Title onClick={() => set({ repo: undefined })} as={SideLink}>
                <Icon as={HiRefresh} mr={3} /> Change repository
              </Title>
              <Title onClick={() => logout()} as={SideLink}>
                <Icon as={MdClose} mr={3} /> Log out
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
