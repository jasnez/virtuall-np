import Head from "next/head";

import { generateJsonLd, type StructuredDataPage } from "@/lib/structuredData";

type StructuredDataProps = {
  page: StructuredDataPage;
};

export default function StructuredData({ page }: StructuredDataProps) {
  const jsonLd = generateJsonLd(page);

  return (
    <Head>
      <script
        type="application/ld+json"
        // next/head manages placement in <head>; the script content must be JSON.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}

