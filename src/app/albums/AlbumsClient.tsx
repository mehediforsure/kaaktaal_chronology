'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MusicArchiveRoom from '../../components/MusicArchiveRoom';
import { Album } from '../../types';

interface Props {
  initialAlbumId?: string;
  initialSongId?: string;
}

export default function AlbumsClient({ initialAlbumId, initialSongId }: Props) {
  const router = useRouter();

  const handleSelectAlbum = (album: Album) => {
    router.push(`/albums/${album.release_id}`);
  };

  return (
    <MusicArchiveRoom 
      onSelectAlbum={handleSelectAlbum} 
      initialAlbumId={initialAlbumId}
      initialSongId={initialSongId}
    />
  );
}
