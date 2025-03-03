import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Meta tags for SEO and responsiveness */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Olympian Health Solutions: Personal training and wellness for all ages." />
          <link rel="icon" href="/favicon.ico" />
          {/* Google Fonts, Icons, etc. */}
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

