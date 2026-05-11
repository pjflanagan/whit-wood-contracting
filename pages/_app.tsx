import React from "react";
import Head from "next/head";
import { GoogleAnalytics } from '@next/third-parties/google';
import type { SiteConfig } from '../model/site-config';
import "../styles/index.scss";

export default function App({ Component, pageProps }: { Component: React.ComponentType<any>; pageProps: { siteConfig?: SiteConfig } & Record<string, unknown> }) {
  const config = pageProps.siteConfig;
  const title = config?.businessName ?? 'Ridge & Rail Renovations';
  const subtitle = config?.tagline ?? 'Licensed General Contractor';
  const description = config?.seoDescription ?? '';
  const keywords = config?.seoKeywords ?? '';

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="theme-color" content="#1e1e1e" />
        <link rel="icon" href="favicon.ico" sizes="16x16" type="image/x-icon" />
        <link rel="icon" href="favicon.png" sizes="32x32" type="image/png" />
        <title>{`${title} | ${subtitle}`}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={subtitle} />
        <meta property="og:type" content="website" />
      </Head>
      <Component {...pageProps} />
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </>
  );
}
