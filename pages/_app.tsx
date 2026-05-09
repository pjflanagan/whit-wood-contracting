import React from "react";
import Head from "next/head";
import { GoogleAnalytics } from '@next/third-parties/google';
import { SEO_DESCRIPTION, SEO_KEYWORDS, TITLE, SUBTITLE } from '../content/metadata';
import "../styles/index.scss";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="description" content={SEO_DESCRIPTION} />
        <meta name="keywords" content={SEO_KEYWORDS} />
        <meta name="theme-color" content="#1e1e1e" />
        <link rel="icon" href="favicon.ico" sizes="16x16" type="image/x-icon" />
        <link rel="icon" href="favicon.png" sizes="32x32" type="image/png" />
        <title>{`${TITLE} | ${SUBTITLE}`}</title>
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={SUBTITLE} />
        <meta property="og:type" content="website" />
      </Head>
      <Component {...pageProps} />
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </>
  );
}
