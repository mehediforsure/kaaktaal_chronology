import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EngagementState, EngagementAction } from '../types';

interface EngagementContextType {
  state: EngagementState;
  logAction: (action: EngagementAction, payload?: any) => void;
  isUnlocked: (experienceId: string) => boolean;
  resetEngagement: () => void;
}

const LOCAL_STORAGE_KEY = 'kaaktaal_engagement_v2';

const INITIAL_STATE: EngagementState = {
  timeSpent: 0,
  visitedRooms: ['home'],
  songsOpened: 0,
  journalInteractions: 0,
  finderUsage: 0,
  mapClicks: 0,
  globalClicks: 0,
};

const EngagementContext = createContext<EngagementContextType | undefined>(undefined);

export function EngagementProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EngagementState>(INITIAL_STATE);

  // Load from local storage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Ensure standard fields are populated
          setState((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {
      console.error('Failed to parse engagement state', e);
    }
  }, []);

  // Sync state to local storage on changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      }
    } catch (e) {
      console.error('Failed to save engagement state', e);
    }
  }, [state]);

  // Track time spent (tick every second when tab is active/visible)
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        setState((prev) => ({
          ...prev,
          timeSpent: prev.timeSpent + 1,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const logAction = useCallback((action: EngagementAction, payload?: any) => {
    setState((prev) => {
      let changed = false;
      const updated = { ...prev };
 
      switch (action) {
        case 'visit_room':
          if (payload && typeof payload === 'string') {
            if (!updated.visitedRooms.includes(payload)) {
              updated.visitedRooms = [...updated.visitedRooms, payload];
              changed = true;
            }
          }
          break;
        case 'song_opened':
          updated.songsOpened += 1;
          changed = true;
          break;
        case 'journal_interaction':
          updated.journalInteractions += 1;
          changed = true;
          break;
        case 'finder_usage':
          updated.finderUsage += 1;
          changed = true;
          break;
        case 'map_click':
          updated.mapClicks += 1;
          changed = true;
          break;
        case 'global_click':
          updated.globalClicks = (updated.globalClicks || 0) + 1;
          changed = true;
          break;
        default:
          break;
      }
 
      return changed ? updated : prev;
    });
  }, []);
 
  // Track global clicks
  useEffect(() => {
    const handleGlobalClick = () => {
      logAction('global_click');
    };
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [logAction]);
 
  // Check if a specific hidden experience should unlock based on current engagement
  const isUnlocked = useCallback((experienceId: string): boolean => {
    if (experienceId === 'crow') {
      // Configurable criteria for crow unlock (representing access to Divine Accident):
      // - Total seconds spent >= 12 OR
      // - Unique rooms visited >= 3 OR
      // - Active clicks/interactions (songs opened + journal atmosphere toggles + finder queries + map clicks) >= 3
      const totalInteractions = 
        state.songsOpened + 
        state.journalInteractions + 
        state.finderUsage + 
        state.mapClicks;
 
      return state.timeSpent >= 12 || state.visitedRooms.length >= 3 || totalInteractions >= 3;
    }
 
    // Future-proofing other hidden experiences (Secret Rooms, hidden events)
    if (experienceId === 'secret_room') {
      return state.songsOpened >= 5 && state.timeSpent >= 120;
    }
 
    return false;
  }, [state.timeSpent, state.visitedRooms, state.songsOpened, state.journalInteractions, state.finderUsage, state.mapClicks]);
 
  const resetEngagement = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return (
    <EngagementContext.Provider value={{ state, logAction, isUnlocked, resetEngagement }}>
      {children}
    </EngagementContext.Provider>
  );
}

export function useEngagement() {
  const context = useContext(EngagementContext);
  if (!context) {
    throw new Error('useEngagement must be used within an EngagementProvider');
  }
  return context;
}
