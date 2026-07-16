'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import { CROW_ACCIDENTS } from '../../data';

const PortalRoom = dynamic(() => import('../../components/PortalRoom'), { ssr: false });

export default function PortalClient() {
  const router = useRouter();
  const { setCurrentOverlayAccident } = useAppContext();

  const handleRoomChange = (room: string) => {
    router.push(`/${room}`);
  };

  const triggerRandomAccident = () => {
    const rand = CROW_ACCIDENTS[Math.floor(Math.random() * CROW_ACCIDENTS.length)];
    setCurrentOverlayAccident(rand);
  };

  return (
    <PortalRoom onRoomChange={handleRoomChange} triggerRandomAccident={triggerRandomAccident} />
  );
}
