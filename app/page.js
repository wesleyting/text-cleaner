import Head from "next/head";
import TextCleaner from "../components/TextCleaner";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Text Cleaner</title>
        <meta
          name="description"
          content="Clean sensitive words from your text"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <TextCleaner />
      </main>
    </div>
  );
}
