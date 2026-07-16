import React from 'react';
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Kaaktaal Chronology | Home',
  description: 'Welcome to the Kaaktaal Archival Collection. Coincidence & Serendipity.',
  alternates: {
    canonical: 'https://kaaktaal-v2.vercel.app/',
  },
  openGraph: {
    title: 'Kaaktaal Chronology | Home',
    description: 'Welcome to the Kaaktaal Archival Collection. Coincidence & Serendipity.',
    url: 'https://kaaktaal-v2.vercel.app/',
  }
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Kaaktaal Chronology",
              "url": "https://kaaktaal-v2.vercel.app/",
              "description": "An archival collection of Kaaktaal Band's recorded works.",
              "publisher": {
                "@type": "Organization",
                "name": "Kaaktaal",
                "url": "https://kaaktaal-v2.vercel.app/"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://kaaktaal-v2.vercel.app/finder?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              "name": "Kaaktaal",
              "url": "https://kaaktaal-v2.vercel.app/",
              "image": "https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/logo%20grey%20black.png",
              "description": "Bengali indie music band"
            }
          ])
        }}
      />
      <HomeClient />
    </>
  );
}
