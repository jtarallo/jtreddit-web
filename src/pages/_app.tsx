import type { AppProps } from "next/app";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import theme from "../theme";
import UrqlProvider from "../providers/UrqlProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UrqlProvider>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            initialColorMode: "dark",
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </UrqlProvider>
  );
}

export default MyApp;
