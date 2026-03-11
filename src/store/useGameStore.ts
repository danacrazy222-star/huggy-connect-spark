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
  duelActive: boolean;
  lastChestTime: number | null;
  lastChestReward: number | null;
  
  addPoints: (amount: number) => void;
  addXP: (amount: number) => void;
  addGameTicket: (amount: number) => void;
  addTarotTicket: (amount: number) => void;
  addDrawEntry: (amount: number) => void;
  setLastSpinTime: (time: number) => void;
  checkSpinAvailability: () => boolean;
  unlockWorldChallenge: () => void;
  lockWorldChallenge: () => void;
  setDuelActive: (active: boolean) => void;
  canOpenChest: () => boolean;
  openDailyChest: () => number;
}

// Cumulative XP thresholds to REACH each level
export const XP_FOR_LEVEL: Record<number, number> = {
  1: 0, 2: 1000, 3: 2500, 4: 4500, 5: 7000,
  6: 10000, 7: 14000, 8: 20000, 9: 27000, 10: 35000,
  11: 45000, 12: 56000, 13: 69000, 14: 84000, 15: 101000,
  16: 120000, 17: 145000, 18: 175000, 19: 210000, 20: 250000,
  21: 295000, 22: 350000, 23: 420000, 24: 500000, 25: 550000,
  26: 610000, 27: 680000, 28: 755000, 29: 835000, 30: 920000,
  31: 1010000, 32: 1100000, 33: 1195000, 34: 1295000, 35: 1400000,
  36: 1510000, 37: 1625000, 38: 1745000, 39: 1870000, 40: 2000000,
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
      duelActive: false,
      lastChestTime: null,
      lastChestReward: null,
      addPoints: (amount) => set((s) => ({ points: s.points + amount })),
      
      addXP: (amount) => set((s) => {
        let newXP = s.xp + amount;
        let newLevel = s.level;
        const oldLevel = s.level;
        // Level up while total XP meets the next level's cumulative threshold
        while (newLevel < 40 && XP_FOR_LEVEL[newLevel + 1] && newXP >= XP_FOR_LEVEL[newLevel + 1]) {
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
      
      canOpenChest: () => {
        const { lastChestTime } = get();
        if (!lastChestTime) return true;
        const now = new Date();
        const beirutNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Beirut' }));
        const beirutChest = new Date(new Date(lastChestTime).toLocaleString('en-US', { timeZone: 'Asia/Beirut' }));
        const todayReset = new Date(beirutNow);
        todayReset.setHours(11, 0, 0, 0);
        const currentReset = beirutNow.getHours() < 11
          ? new Date(todayReset.getTime() - 24 * 60 * 60 * 1000)
          : todayReset;
        return beirutChest < currentReset;
      },

      openDailyChest: () => {
        const { level } = get();
        let min: number, max: number;
        if (level >= 33) { min = 450; max = 800; }
        else if (level >= 25) { min = 250; max = 450; }
        else if (level >= 17) { min = 120; max = 250; }
        else if (level >= 9) { min = 60; max = 120; }
        else { min = 20; max = 60; }
        const reward = Math.floor(Math.random() * (max - min + 1)) + min;
        set({ lastChestTime: Date.now(), lastChestReward: reward });
        // Add the XP via the addXP action
        get().addXP(reward);
        return reward;
      },

      checkSpinAvailability: () => {
        const { lastSpinTime } = get();
        if (!lastSpinTime) { set({ canSpin: true }); return true; }
        const now = new Date();
        const beirutNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Beirut' }));
        const beirutSpin = new Date(new Date(lastSpinTime).toLocaleString('en-US', { timeZone: 'Asia/Beirut' }));
        const todayReset = new Date(beirutNow);
        todayReset.setHours(11, 0, 0, 0);
        const currentReset = beirutNow.getHours() < 11 
          ? new Date(todayReset.getTime() - 24 * 60 * 60 * 1000)
          : todayReset;
        const canSpin = beirutSpin < currentReset;
        set({ canSpin });
        return canSpin;
      },
    }),
    { name: 'winline-game-store' }
  )
);
