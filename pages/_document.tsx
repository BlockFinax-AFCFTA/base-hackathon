import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* This is a replit script which adds a banner on the top of the page when opened in development mode outside the replit environment */}
        <script 
          type="text/javascript" 
          src="https://replit.com/public/js/replit-dev-banner.js"
          async
        />
      </body>
    </Html>
  )
}