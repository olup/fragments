import { Box, Center } from "@chakra-ui/layout";
import styled from "@emotion/styled";
import { Fragment } from "components/Fragment";
import { Container, Flex } from "components/Layout";
import { Link } from "components/Link";
import { NewFragment } from "components/NewFragment";
import { useEngine } from "hooks/engine";
import useStickyHeader from "hooks/useStickyHeader";
import React, { useMemo } from "react";
import { HiHashtag } from "react-icons/hi";
import { Link as RouterLink, useParams } from "react-router-dom";
import { MdCreate } from "react-icons/md";
import Icon from "@chakra-ui/icon";

const Header = styled.div`
  padding: 20px 0;
`;

const HiddenHeader = styled.div`
  // width: 100%;
  background-color: #f9f9f9;
  top: -150px;
  position: fixed;
  z-index: 10;
  width: 100%;
  transition: 0.3s;
  &.sticky {
    top: 0;
  }
`;

export const TagPage = () => {
  const { tag: tagName } = useParams();
  const [isSticky] = useStickyHeader(200);

  const tag = useEngine((s) => s.engine.tags[tagName]);
  const getFragments = useEngine((s) => s.actions.getFragments);
  const deletFragment = useEngine((s) => s.actions.deleteFragment);
  const fragments = useMemo(() => (tag ? getFragments(tag.handles) : []), [
    tag,
  ]);

  return (
    <Box position="relative">
      <HiddenHeader className={isSticky ? "sticky" : ""}>
        <Box w={1000}>
          <Header>
            <RouterLink to="/">
              <Link>Back home</Link>
            </RouterLink>
            <Flex mt={2} align="center" color="#bbb" fontSize={25}>
              <HiHashtag /> {tagName}
            </Flex>
          </Header>
        </Box>
      </HiddenHeader>

      <Header>
        <RouterLink to="/">
          <Link>Back home</Link>
        </RouterLink>
        <Flex
          mt={2}
          align="center"
          style={{
            color: "#bbb",
            fontSize: 40,
          }}
        >
          <HiHashtag /> {tagName}
        </Flex>
      </Header>
      {/* {!!subTags?.length && (
        <Flex mb={30}>
          {subTags.map((tag) => (
            <RouterLink to={"/tag/" + tag} key={tag}>
              <Link style={{ marginRight: 10 }}>
                <HiHashtag /> {tag}
              </Link>
            </RouterLink>
          ))}
        </Flex>
      )} */}
      {/* 
      {loading && !fragments?.length && (
        <Flex justify="center" align={"center"} h={100}>
          <Loading />
        </Flex>
      )} */}

      {fragments?.map((fragment) => (
        <Box key={fragment.handle}>
          <Fragment
            // @ts-ignore
            fragment={fragment}
            onDelete={(handle) => handle && deletFragment(handle)}
            saveOnBlur
          />
          <Box
            h="3px"
            w="100%"
            backgroundColor="#fff"
            backgroundImage={`url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3cline x1='0' y1='0' y2='0' x2='100%25' fill='none' stroke='%23f3f3f3' stroke-width='5' stroke-dasharray='20' stroke-dashoffset='0' /%3e%3c/svg%3e")`}
          />
        </Box>
      ))}

      <NewFragment
        initialContent={`\n#${tagName}`}
        placeholder={
          <Flex align="center">
            <Icon as={MdCreate} mr={3} /> Add note to the list
          </Flex>
        }
      />
    </Box>
  );
};
