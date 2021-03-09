import styled from "@emotion/styled";
import {
  useGetFragmentsPreviewQuery,
  useGetTagsQuery,
} from "graphql/generated";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce/lib";
import { Button } from "./Button";
import { Flex } from "./Layout";
import { Loading } from "./Loading";

const SIDE_WIDTH = 250;

const SideStyled = styled.div<{ isVisible?: boolean }>`
  width: ${(p) => (p.isVisible ? SIDE_WIDTH : 0)}px;
  box-sizing: border-box;
  overflow: hidden;
  color: #e3d18a;
  transition: 0.5s;

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  font-size: 20px;

  z-index: 100;
`;

const Inside = styled.div`
  background-color: #85603f;
  width: ${SIDE_WIDTH}px;
  padding: 20px;
  padding-top: 50px;
  height: 100%;
  box-sizing: border-box;
`;

const FixLink = styled.span`
  position: fixed;
  top: 10px;
  left: 20px;
  padding: 3px;
  color: #e3d18a;
  cursor: pointer;
  &:hover {
    border-bottom: 1px dashed;
  }
`;

const Title = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const SearchInput = styled.input`
  padding: 10px 20px;
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
  const tagQuery = useGetTagsQuery();
  const tags = [...(tagQuery?.data?.tags || [])].sort();
  const [debouncedSearch] = useDebounce(search, 300);

  const { data: fragmentsFoundResponse, loading } = useGetFragmentsPreviewQuery(
    {
      skip: !search,
      variables: {
        filter: { content: debouncedSearch, handle: debouncedSearch },
      },
    }
  );

  const fragmentsFound = useMemo(
    () => fragmentsFoundResponse?.fragments || [],
    [fragmentsFoundResponse?.fragments]
  );

  useEffect(() => {
    if (isVisible) tagQuery?.refetch?.();
  }, [isVisible]);

  const handleToggleShow = useCallback(() => {
    setIsVisbile(!isVisible);
    setSearch("");
  }, [isVisible, setIsVisbile, setSearch]);

  return (
    <>
      <SideStyled
        isVisible={isVisible}
        style={{ position: "relative" }}
      ></SideStyled>

      <SideStyled isVisible={isVisible}>
        <Inside>
          <FixLink onClick={handleToggleShow}>
            {isVisible ? "Hide" : "Show"} Side
          </FixLink>

          <Link to="/handle/new" style={{ marginBottom: 20, display: "block" }}>
            <Button>
              <HiOutlinePlus size={15} /> New fragment
            </Button>
          </Link>

          <Flex mb={20} mr={-20} ml={-20}>
            <SearchInput
              placeholder="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {loading && (
              <Flex style={{ position: "absolute", right: 25, top: 15 }}>
                <Loading />
              </Flex>
            )}
          </Flex>

          {!search && (
            <>
              <Title style={{ marginBottom: 10 }}>
                <Link to={"/"}>Home</Link>
              </Title>

              <Title style={{ marginBottom: 10 }}>
                <Link to={"/feed"}>Feed</Link>
              </Title>

              <Title>Tags</Title>
              {tags?.map((tag) => (
                <div>
                  <Link to={"/tag/" + tag}>#{tag}</Link>
                </div>
              ))}
            </>
          )}

          {search && (
            <>
              {fragmentsFound?.map((frament) => (
                <div>
                  <Link to={"/handle/" + frament.handle}>{frament.handle}</Link>
                </div>
              ))}
            </>
          )}
        </Inside>
      </SideStyled>
    </>
  );
};
