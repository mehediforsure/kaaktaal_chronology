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

  const isArticle = accident.type === 'journal' || accident.type === 'story';

  return {
    title: `${accident.title} - Kaaktaal Archive`,
    description: accident.content.slice(0, 150) + '...',
    alternates: {
      canonical: `https://kaaktaal-v2.vercel.app/archive/${id}`,
    },
    openGraph: {
      title: `${accident.title} - Kaaktaal Archive`,
      description: accident.content.slice(0, 150) + '...',
      url: `https://kaaktaal-v2.vercel.app/archive/${id}`,
      type: isArticle ? 'article' : 'website',
      images: accident.image ? [{ url: accident.image }] : [],
    }
  };
}

export default async function ArchiveDetailPage({ params }: Props) {
  const { id } = params;
  const accident = CROW_ACCIDENTS.find(a => a.id === id);

  const schemaType = accident?.type === 'journal' ? 'BlogPosting' 
    : accident?.type === 'story' ? 'Article' 
    : 'CreativeWork';

  return (
    <>
      {accident && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": schemaType,
              "headline": accident.title,
              "name": accident.title,
              "text": accident.content,
              "author": {
                "@type": "Organization",
                "name": "Kaaktaal",
                "url": "https://kaaktaal-v2.vercel.app/"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Kaaktaal",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/logo%20grey%20black.png"
                }
              },
              "url": `https://kaaktaal-v2.vercel.app/archive/${id}`,
              "image": accident.image || "https://raw.githubusercontent.com/mehediforsure/kaaktaal_assets/main/logo%20grey%20black.png"
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
