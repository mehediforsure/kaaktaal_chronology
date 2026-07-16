import React from 'react';
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Kaaktaal Chronology | Home',
  description: 'Welcome to the Kaaktaal Archival Collection. Coincidence & Serendipity.',
  alternates: {
    canonical: 'https://kaaktaal.com',
  }
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Kaaktaal Chronology",
            "url": "https://kaaktaal.com",
            "description": "An archival collection of Kaaktaal Band's recorded works.",
            "publisher": {
              "@type": "Organization",
              "name": "Kaaktaal",
              "url": "https://kaaktaal.com"
            }
          })
        }}
      />
      <HomeClient />
    </>
  );
}
