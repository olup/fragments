import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { useEngine } from "contexts/engine";
import {
  useGetFragmentsPreviewQuery,
  useGetTagsQuery,
} from "graphql/generated";
import humanId from "human-id";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { HiHashtag, HiOutlinePlus, HiTag } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce/lib";
import { Flex } from "./Layout";
import { Loading } from "./Loading";

const SIDE_WIDTH = 300;

const SideStyled = styled.div<{ isVisible?: boolean }>`
  width: ${(p) => (p.isVisible ? SIDE_WIDTH : 0)}px;
  box-sizing: border-box;
  overflow: hidden;
  color: #f1faee;
  transition: 0.5s;

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  font-size: 22px;

  z-index: 100;
`;

const Inside = styled.div`
  background-color: #1d3557;
  width: ${SIDE_WIDTH}px;
  //padding: 20px;
  padding-top: 50px;
  height: 100%;
  box-sizing: border-box;
`;

const FixLink = styled.span`
  position: fixed;
  top: 10px;
  left: 20px;
  padding: 3px;
  color: #222;
  cursor: pointer;
  &:hover {
    border-bottom: 1px dashed;
  }
`;

const Title = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const SideLink = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 5px;
  padding-left: 20px;
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

      <SideStyled isVisible={isVisible}>
        <Inside>
          <FixLink onClick={handleToggleShow} style={{ color: textColor }}>
            {isVisible ? "Hide" : "Show"} Side
          </FixLink>

          <Flex
            onClick={navigateToNew}
            as={SideLink}
            style={{ marginBottom: 20, display: "block", cursor: "pointer" }}
          >
            <HiOutlinePlus size={15} /> New fragment [ctrl b]
          </Flex>

          <Flex mb={20}>
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
