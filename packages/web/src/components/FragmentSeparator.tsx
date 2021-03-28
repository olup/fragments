import { Box } from "@chakra-ui/layout";
import { useTheme } from "@chakra-ui/system";

export const FragmentSeparator = () => {
  const theme = useTheme();
  return (
    <Box backgroundColor="fragmentBg" height="4px">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100% 5"
        height="100%"
        width="100%"
      >
        <line
          x1="0"
          y1="0"
          y2="0"
          x2="100%"
          fill="none"
          stroke={theme.colors.pageBg}
          stroke-width="100%"
          stroke-dasharray="20"
          stroke-dashoffset="0"
        />
      </svg>
    </Box>
    // <Box
    //   h="3px"
    //   w="100%"
    //   backgroundColor="fragmentBg"
    //   stroke="fragmentText"
    //   backgroundImage={`url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3cline x1='0' y1='0' y2='0' x2='100%25' fill='none' stroke='%23f3f3f3' stroke-width='5' stroke-dasharray='20' stroke-dashoffset='0' /%3e%3c/svg%3e")`}
    // />
  );
};
