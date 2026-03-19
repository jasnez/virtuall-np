import { generateJsonLd, type StructuredDataPage } from "@/lib/structuredData";

type StructuredDataProps = {
  page: StructuredDataPage;
};

export default function StructuredData({ page }: StructuredDataProps) {
  const jsonLd = generateJsonLd(page);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

