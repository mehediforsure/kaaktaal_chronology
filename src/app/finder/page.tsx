import React from 'react';
import type { Metadata } from 'next';
import FinderClient from './FinderClient';

export const metadata: Metadata = {
  title: 'Kaaktaal Chronology | The Finder',
  description: 'Search and discover elements in the Kaaktaal archive.',
  alternates: {
    canonical: 'https://kaaktaal-v2.vercel.app/finder',
  },
  openGraph: {
    title: 'Kaaktaal Chronology | The Finder',
    description: 'Search and discover elements in the Kaaktaal archive.',
    url: 'https://kaaktaal-v2.vercel.app/finder',
  }
};

export default function FinderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "The Finder - Kaaktaal",
            "url": "https://kaaktaal-v2.vercel.app/finder"
          })
        }}
      />
      <main className="w-full h-full flex flex-col justify-start flex-1">
        <FinderClient />
      </main>
    </>
  );
}
