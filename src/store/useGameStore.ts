import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { playLevelUp } from '@/utils/sounds';

interface GameState {
  points: number;
  xp: number;
  level: number;
  gameTickets: number;
  tarotTickets: number;
  drawEntries: number;
  lastSpinTime: number | null;
  canSpin: boolean;
  worldChallengeUnlocked: boolean;
  
  addPoints: (amount: number) => void;
  addXP: (amount: number) => void;
  addGameTicket: (amount: number) => void;
  addTarotTicket: (amount: number) => void;
  addDrawEntry: (amount: number) => void;
  setLastSpinTime: (time: number) => void;
  checkSpinAvailability: () => boolean;
  unlockWorldChallenge: () => void;
  lockWorldChallenge: () => void;
}

// XP required to advance FROM each level (index = level)
// e.g. XP_FOR_LEVEL[5] = 12000 means Level 5→6 requires 12,000 XP
export const XP_FOR_LEVEL: Record<number, number> = {
  1: 8000, 2: 12000, 3: 16000, 4: 22000, 5: 30000,
  6: 38000, 7: 48000, 8: 58000, 9: 70000, 10: 85000,
  11: 100000, 12: 120000, 13: 140000, 14: 165000, 15: 195000,
  16: 230000, 17: 270000, 18: 320000, 19: 380000, 20: 450000,
  21: 530000, 22: 620000, 23: 720000, 24: 830000, 25: 950000,
  26: 1100000, 27: 1280000, 28: 1500000, 29: 1750000,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      points: 500,
      xp: 1300,
      level: 5,
      gameTickets: 3,
      tarotTickets: 1,
      drawEntries: 2,
      lastSpinTime: null,
      canSpin: true,
      worldChallengeUnlocked: false,
      addPoints: (amount) => set((s) => ({ points: s.points + amount })),
      
      addXP: (amount) => set((s) => {
        let newXP = s.xp + amount;
        let newLevel = s.level;
        const oldLevel = s.level;
        while (newLevel < 30 && XP_FOR_LEVEL[newLevel] && newXP >= XP_FOR_LEVEL[newLevel]) {
          newXP -= XP_FOR_LEVEL[newLevel];
          newLevel++;
        }
        if (newLevel > oldLevel) {
          setTimeout(() => playLevelUp(), 100);
        }
        return { xp: newXP, level: newLevel };
      }),

      addGameTicket: (amount) => set((s) => ({ gameTickets: s.gameTickets + amount })),
      addTarotTicket: (amount) => set((s) => ({ tarotTickets: s.tarotTickets + amount })),
      addDrawEntry: (amount) => set((s) => ({ drawEntries: s.drawEntries + amount })),
      
      setLastSpinTime: (time) => set({ lastSpinTime: time, canSpin: false }),
      unlockWorldChallenge: () => set({ worldChallengeUnlocked: true }),
      lockWorldChallenge: () => set({ worldChallengeUnlocked: false }),
      
      checkSpinAvailability: () => {
        const { lastSpinTime } = get();
        if (!lastSpinTime) { set({ canSpin: true }); return true; }
        // Lebanon timezone (Asia/Beirut) daily reset at 11:00 AM
        const now = new Date();
        const beirutNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Beirut' }));
        const beirutSpin = new Date(new Date(lastSpinTime).toLocaleString('en-US', { timeZone: 'Asia/Beirut' }));
        
        // Find the current day's 11:00 AM reset boundary in Beirut time
        const todayReset = new Date(beirutNow);
        todayReset.setHours(11, 0, 0, 0);
        
        // If current Beirut time is before 11 AM, the relevant reset was yesterday's 11 AM
        const currentReset = beirutNow.getHours() < 11 
          ? new Date(todayReset.getTime() - 24 * 60 * 60 * 1000)
          : todayReset;
        
        // User can spin if the last spin was before the current reset boundary
        const canSpin = beirutSpin < currentReset;
        set({ canSpin });
        return canSpin;
      },
    }),
    { name: 'winline-game-store' }
  )
);
