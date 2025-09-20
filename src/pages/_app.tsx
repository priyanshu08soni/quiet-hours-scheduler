import "../styles/globals.css"; // <- adjust path if your styles are elsewhere
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
