import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  points: number;
  xp: number;
  level: number;
  gameTickets: number;
  tarotTickets: number;
  drawEntries: number;
  lastSpinTime: number | null;
  canSpin: boolean;
  
  addPoints: (amount: number) => void;
  addXP: (amount: number) => void;
  addGameTicket: (amount: number) => void;
  addTarotTicket: (amount: number) => void;
  addDrawEntry: (amount: number) => void;
  setLastSpinTime: (time: number) => void;
  checkSpinAvailability: () => boolean;
}

// XP required to advance FROM each level (index = level)
// e.g. XP_FOR_LEVEL[5] = 12000 means Level 5→6 requires 12,000 XP
export const XP_FOR_LEVEL: Record<number, number> = {
  1: 5000, 2: 6000, 3: 7000, 4: 9000, 5: 12000,
  6: 14000, 7: 18000, 8: 22000, 9: 28000, 10: 35000,
  11: 42000, 12: 50000, 13: 60000, 14: 70000, 15: 80000,
  16: 95000, 17: 110000, 18: 130000, 19: 160000,
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

      addPoints: (amount) => set((s) => ({ points: s.points + amount })),
      
      addXP: (amount) => set((s) => {
        let newXP = s.xp + amount;
        let newLevel = s.level;
        // Level up: if XP exceeds requirement, advance and carry remainder
        while (newLevel < 20 && XP_FOR_LEVEL[newLevel] && newXP >= XP_FOR_LEVEL[newLevel]) {
          newXP -= XP_FOR_LEVEL[newLevel];
          newLevel++;
        }
        return { xp: newXP, level: newLevel };
      }),

      addGameTicket: (amount) => set((s) => ({ gameTickets: s.gameTickets + amount })),
      addTarotTicket: (amount) => set((s) => ({ tarotTickets: s.tarotTickets + amount })),
      addDrawEntry: (amount) => set((s) => ({ drawEntries: s.drawEntries + amount })),
      
      setLastSpinTime: (time) => set({ lastSpinTime: time, canSpin: false }),
      
      checkSpinAvailability: () => {
        const { lastSpinTime } = get();
        if (!lastSpinTime) return true;
        const elapsed = Date.now() - lastSpinTime;
        const canSpin = elapsed >= 24 * 60 * 60 * 1000;
        set({ canSpin });
        return canSpin;
      },
    }),
    { name: 'winline-game-store' }
  )
);
