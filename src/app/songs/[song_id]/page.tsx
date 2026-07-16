import React from 'react';
import type { Metadata } from 'next';
import AlbumsClient from '../../albums/AlbumsClient';
import { fetchSongs } from '../../../lib/supabase';
import { ALBUMS } from '../../../data';

interface Props {
  params: { song_id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { song_id } = params;
  
  const songs = await fetchSongs(song_id);
  const song = songs.length > 0 ? songs[0] : null;

  if (!song) {
    return { title: 'Kaaktaal | Song Not Found' };
  }

  return {
    title: `${song.title_en} - Kaaktaal Song`,
    description: song.description_short || `Listen to ${song.title_en} by Kaaktaal from the album ${song.album}.`,
    alternates: {
      canonical: `https://kaaktaal.com/songs/${song_id}`,
    },
    openGraph: {
      title: `${song.title_en} - Kaaktaal`,
      description: song.description_short || `Kaaktaal track from ${song.album}.`,
      images: song.cover_image ? [{ url: song.cover_image }] : [],
    }
  };
}

export default async function SongDetailPage({ params }: Props) {
  const { song_id } = params;
  
  const songs = await fetchSongs(song_id);
  const song = songs.length > 0 ? songs[0] : null;

  // Try to figure out the album ID from the song's album name
  let albumId = undefined;
  if (song && song.album) {
    const matched = ALBUMS.find(a => a.title.toLowerCase() === song.album?.toLowerCase());
    if (matched) albumId = matched.release_id;
  }

  return (
    <>
      {song && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicRecording",
              "name": song.title_en,
              "byArtist": {
                "@type": "MusicGroup",
                "name": "Kaaktaal"
              },
              "inAlbum": song.album ? {
                "@type": "MusicAlbum",
                "name": song.album
              } : undefined,
              "datePublished": song.year_released,
              "description": song.description_short,
              "url": `https://kaaktaal.com/songs/${song_id}`,
              "image": song.cover_image
            })
          }}
        />
      )}
      <div className="flex-1 w-full flex flex-col">
        <AlbumsClient initialAlbumId={albumId || song?.release_id} initialSongId={song_id} />
      </div>
    </>
  );
}
