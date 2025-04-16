import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>BlockFinaX | Secure Trade Platform</title>
        <meta name="description" content="A blockchain-powered escrow platform for international trade" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}