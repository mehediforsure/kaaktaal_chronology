'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const MapRoom = dynamic(() => import('../../components/MapRoom'), { ssr: false });

export default function MapClient() {
  const router = useRouter();

  return (
    <MapRoom onBack={() => router.push('/')} />
  );
}
