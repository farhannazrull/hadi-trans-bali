// Renders structured data (schema.org) into the static HTML so crawlers see it
// without executing JavaScript. Server component on purpose — do not add 'use client'.
const JsonLd = ({ data }) => {
  const blocks = Array.isArray(data) ? data : [data];
  return blocks.filter(Boolean).map((block, i) => (
    <script
      key={i}
      type="application/ld+json"
      // The payload is built from our own static data, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
    />
  ));
};

export default JsonLd;
