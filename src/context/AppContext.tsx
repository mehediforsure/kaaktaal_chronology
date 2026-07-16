'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CrowAccident, FinderTab } from '../types';

interface AppContextType {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isFinderNavOpen: boolean;
  setIsFinderNavOpen: (open: boolean) => void;
  activeFinderTab: FinderTab;
  setActiveFinderTab: (tab: FinderTab) => void;
  currentOverlayAccident: CrowAccident | null;
  setCurrentOverlayAccident: (accident: CrowAccident | null) => void;
  showMemoryInvitation: boolean;
  setShowMemoryInvitation: (show: boolean) => void;
  hasDismissedInvitation: boolean;
  setHasDismissedInvitation: (dismissed: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFinderNavOpen, setIsFinderNavOpen] = useState(false);
  const [activeFinderTab, setActiveFinderTab] = useState<FinderTab>('music');
  const [currentOverlayAccident, setCurrentOverlayAccident] = useState<CrowAccident | null>(null);
  const [showMemoryInvitation, setShowMemoryInvitation] = useState(false);
  const [hasDismissedInvitation, setHasDismissedInvitation] = useState(false);

  return (
    <AppContext.Provider
      value={{
        isDrawerOpen,
        setIsDrawerOpen,
        isFinderNavOpen,
        setIsFinderNavOpen,
        activeFinderTab,
        setActiveFinderTab,
        currentOverlayAccident,
        setCurrentOverlayAccident,
        showMemoryInvitation,
        setShowMemoryInvitation,
        hasDismissedInvitation,
        setHasDismissedInvitation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
