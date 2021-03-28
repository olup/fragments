import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
export const darkTheme = {
  colors: {
    pageBg: "#222",
    fragmentBg: "#333",
    fragmentText: "white",
  },
};

export const theme = extendTheme({
  fonts: {
    heading: "Inconsolata",
    body: "Inconsolata",
  },

  colors: {
    pageBg: "#eee",
    fragmentBg: "white",
    fragmentText: "#222",
  },

  components: {
    Button: {
      defaultProps: {
        variant: "outline",
        colorScheme: "black",
      },
      variants: {
        ghost: {
          borderBottomWidth: 0,
        },
        outlineRaised: {
          border: "1px solid",
          transition: 0,
          borderBottomWidth: 3,
          _active: {
            borderBottomWidth: 1,
          },
        },
      },
      baseStyle: {
        borderRadius: 5,
      },
    },

    Menu: {
      parts: ["list", "item"],
      baseStyle: {
        list: {
          paddingBottom: 0,
          py: 0,
          borderColor: "#ccc",
          overflow: "hidden",
          borderRadius: 2,
        },
        item: {
          borderBottomWidth: 1,
          borderColor: "#f2f2f2",
          _hover: {
            backgroundColor: "#f9f9f9",
          },
          _focus: {
            backgroundColor: "#f9f9f9",
          },
        },
      },
    },
  },
});
