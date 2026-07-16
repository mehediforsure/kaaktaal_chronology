'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import FinderRoom from '../../components/FinderRoom';

export default function FinderClient() {
  const router = useRouter();
  const { activeFinderTab, setActiveFinderTab } = useAppContext();

  return (
    <FinderRoom 
      activeTab={activeFinderTab} 
      onBack={() => {
        setActiveFinderTab('music');
        router.push('/');
      }}
    />
  );
}
