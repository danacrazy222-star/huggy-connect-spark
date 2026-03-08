import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DrawEntry {
  userId: string;
  username: string;
  amount: number;
  timestamp: number;
}

interface DrawState {
  poolAmount: number; // internal $ amount
  targetAmount: number;
  entries: DrawEntry[];
  currentWinner: string | null;
  winnerAnnouncedAt: number | null;
  drawHistory: { winner: string; date: number; prize: string }[];
  isDrawActive: boolean;

  addPurchase: (username: string, amount: number) => void;
  getProgressPercent: () => number;
  resetDraw: () => void;
}

// Simulated entries for demo
const DEMO_ENTRIES: DrawEntry[] = [
  { userId: "1", username: "Sarah_M", amount: 3, timestamp: Date.now() - 86400000 * 5 },
  { userId: "2", username: "Ahmed_K", amount: 2, timestamp: Date.now() - 86400000 * 4 },
  { userId: "3", username: "Luna_Star", amount: 1, timestamp: Date.now() - 86400000 * 3 },
  { userId: "4", username: "MaxPower", amount: 3, timestamp: Date.now() - 86400000 * 2 },
  { userId: "5", username: "Nora_VIP", amount: 2, timestamp: Date.now() - 86400000 },
  { userId: "6", username: "Player_X", amount: 1, timestamp: Date.now() - 43200000 },
  { userId: "7", username: "GoldRush", amount: 3, timestamp: Date.now() - 21600000 },
  { userId: "8", username: "DiamondQ", amount: 2, timestamp: Date.now() - 10800000 },
];

export const useDrawStore = create<DrawState>()(
  persist(
    (set, get) => ({
      poolAmount: 680,
      targetAmount: 1000,
      entries: DEMO_ENTRIES,
      currentWinner: null,
      winnerAnnouncedAt: null,
      drawHistory: [
        { winner: "CryptoKing_99", date: Date.now() - 86400000 * 30, prize: "$500 Amazon" },
        { winner: "Lucky_Luna", date: Date.now() - 86400000 * 60, prize: "$500 Google Play" },
      ],
      isDrawActive: true,

      addPurchase: (username, amount) => {
        const state = get();
        const newPool = state.poolAmount + amount;
        const newEntry: DrawEntry = {
          userId: Math.random().toString(36).slice(2),
          username,
          amount,
          timestamp: Date.now(),
        };

        if (newPool >= state.targetAmount) {
          // Draw complete! Pick random winner
          const allEntries = [...state.entries, newEntry];
          // Weight by amount (more $ = more entries)
          const weightedEntries: string[] = [];
          allEntries.forEach((e) => {
            for (let i = 0; i < e.amount; i++) {
              weightedEntries.push(e.username);
            }
          });
          const winnerIdx = Math.floor(Math.random() * weightedEntries.length);
          const winner = weightedEntries[winnerIdx];

          set({
            poolAmount: newPool,
            entries: allEntries,
            currentWinner: winner,
            winnerAnnouncedAt: Date.now(),
            isDrawActive: false,
            drawHistory: [
              { winner, date: Date.now(), prize: "$500 Gift Card" },
              ...state.drawHistory,
            ],
          });
        } else {
          set({
            poolAmount: newPool,
            entries: [...state.entries, newEntry],
          });
        }
      },

      getProgressPercent: () => {
        const { poolAmount, targetAmount } = get();
        return Math.min(Math.round((poolAmount / targetAmount) * 100), 100);
      },

      resetDraw: () => set({
        poolAmount: 0,
        entries: [],
        currentWinner: null,
        winnerAnnouncedAt: null,
        isDrawActive: true,
      }),
    }),
    { name: 'winline-draw-store' }
  )
);
