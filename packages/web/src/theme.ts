import { extendTheme } from "@chakra-ui/react";
export const lightTheme = {
  colors: {
    textColor: "#222",
    fragmentBackgroundColor: "#fff",
    pageBackgroundColor: "#f3f3f3",
  },
};

export const darkTheme: typeof lightTheme = {
  colors: {
    textColor: "#fff",
    fragmentBackgroundColor: "#272727",
    pageBackgroundColor: "#222",
  },
};

export const theme = extendTheme({
  fonts: {
    heading: "Inconsolata",
    body: "Inconsolata",
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
