import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    900: "#0a2239",
    800: "#005f73",
    700: "#e63946",
  },
};

const theme = extendTheme({
  colors,
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "md",
      },
      sizes: {
        md: {
          h: "48px",
          fontSize: "lg",
        },
      },
    },
    Text: {
      baseStyle: {
        fontSize: "md",
        color: "brand.700",
      },
    },
  },
  breakpoints: {
    sm: "320px",
    md: "768px",
    lg: "960px",
    xl: "1200px",
    "2xl": "1536px",
  },
});

export default theme;
