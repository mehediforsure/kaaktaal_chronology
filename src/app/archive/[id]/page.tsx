import React from 'react';
import type { Metadata } from 'next';
import { CROW_ACCIDENTS } from '../../../data';
import ArchiveClient from './ArchiveClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  
  const accident = CROW_ACCIDENTS.find(a => a.id === id);

  if (!accident) {
    return { title: 'Kaaktaal Archive | Not Found' };
  }

  return {
    title: `${accident.title} - Kaaktaal Archive`,
    description: accident.content.slice(0, 150) + '...',
    alternates: {
      canonical: `https://kaaktaal.com/archive/${id}`,
    },
    openGraph: {
      title: `${accident.title} - Kaaktaal Archive`,
      description: accident.content.slice(0, 150) + '...',
      images: accident.image ? [{ url: accident.image }] : [],
    }
  };
}

export default async function ArchiveDetailPage({ params }: Props) {
  const { id } = params;
  const accident = CROW_ACCIDENTS.find(a => a.id === id);

  return (
    <>
      {accident && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              "name": accident.title,
              "text": accident.content,
              "author": {
                "@type": "Organization",
                "name": "Kaaktaal"
              },
              "url": `https://kaaktaal.com/archive/${id}`,
              "image": accident.image
            })
          }}
        />
      )}
      <div className="flex-1 w-full flex flex-col items-center justify-center pt-24 px-4 pb-12">
        <ArchiveClient initialAccidentId={id} />
      </div>
    </>
  );
}
