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

const XP_PER_LEVEL = [
  0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500,
  5500, 6600, 7800, 9100, 10500, 12000, 13600, 15300, 17100, 19000
];

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
        const newXP = s.xp + amount;
        let newLevel = s.level;
        while (newLevel < 20 && newXP >= XP_PER_LEVEL[newLevel]) {
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
