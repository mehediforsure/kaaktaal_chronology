import { EngagementState } from '../types';

/**
 * Centrally defines unlockable content categories and criteria.
 * Supports future hidden experiences (Secret Rooms, Hidden Journals, Seasonal Content)
 */
export interface HiddenExperience {
  id: string;
  name: string;
  description: string;
  category: 'accident' | 'room' | 'journal' | 'event';
  isUnlocked: (state: EngagementState) => boolean;
}

export const HIDDEN_EXPERIENCES: HiddenExperience[] = [
  {
    id: 'crow',
    name: 'Messenger of Chance',
    description: 'A quiet bird observing engagement. Only gateway to the Divine Accident.',
    category: 'accident',
    isUnlocked: (state) => {
      const totalClicks = 
        state.songsOpened + 
        state.journalInteractions + 
        state.finderUsage + 
        state.mapClicks;
      
      return state.timeSpent >= 12 || state.visitedRooms.length >= 3 || totalClicks >= 3;
    }
  },
  {
    id: 'secret_room',
    name: 'The Living Room Sessions Room',
    description: 'A private space for intimate Dhaka gatherings.',
    category: 'room',
    isUnlocked: (state) => state.timeSpent >= 180 && state.songsOpened >= 6
  },
  {
    id: 'hidden_journal',
    name: 'Damp Attic Logs',
    description: 'An unreleased journal of raw paper entries.',
    category: 'journal',
    isUnlocked: (state) => state.visitedRooms.includes('portal') && state.journalInteractions >= 5
  },
  {
    id: 'seasonal_content',
    name: 'Monsoon Rains Overpass',
    description: 'Seasonal coordinates that unlock after heavy exploration.',
    category: 'event',
    isUnlocked: (state) => state.mapClicks >= 10
  }
];
