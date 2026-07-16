import React from 'react';
import type { Metadata } from 'next';
import AlbumsClient from './AlbumsClient';

export const metadata: Metadata = {
  title: 'Kaaktaal Chronology | Recorded Works',
  description: 'The complete recorded works of Kaaktaal. An archival collection of music.',
  alternates: {
    canonical: 'https://kaaktaal-v2.vercel.app/albums',
  },
  openGraph: {
    title: 'Kaaktaal Chronology | Recorded Works',
    description: 'The complete recorded works of Kaaktaal. An archival collection of music.',
    url: 'https://kaaktaal-v2.vercel.app/albums',
  }
};

export default function AlbumsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Kaaktaal Recorded Works",
            "url": "https://kaaktaal-v2.vercel.app/albums",
            "description": "The complete recorded works of Kaaktaal."
          })
        }}
      />
      <main className="p-6 md:p-12 flex-1 max-w-5xl mx-auto w-full">
        <AlbumsClient />
      </main>
    </>
  );
}
