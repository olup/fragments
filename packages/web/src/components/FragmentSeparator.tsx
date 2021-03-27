import { Box } from "@chakra-ui/layout";

export const FragmentSeparator = () => (
  <Box
    h="3px"
    w="100%"
    backgroundColor="fragmentBg"
    backgroundImage={`url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3cline x1='0' y1='0' y2='0' x2='100%25' fill='none' stroke='%23f3f3f3' stroke-width='5' stroke-dasharray='20' stroke-dashoffset='0' /%3e%3c/svg%3e")`}
  />
);
