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
    },
    Text: {
      baseStyle: {
        fontSize: "md",
        color: "brand.700",
      },
    },
  },
});

export default theme;
