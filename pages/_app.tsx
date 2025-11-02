import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src="https://prod-assets.sequelvideo.com/uploads/toolkit/sequel.js"
        strategy="beforeInteractive"
      />
      <Component {...pageProps} />
    </>
  );
}

