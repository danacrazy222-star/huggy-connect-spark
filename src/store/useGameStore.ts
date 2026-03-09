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
  0, 5000, 11000, 18000, 27000, 39000, 53000, 71000, 93000, 121000,
  156000, 198000, 248000, 308000, 378000, 458000, 553000, 663000, 793000, 953000
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
