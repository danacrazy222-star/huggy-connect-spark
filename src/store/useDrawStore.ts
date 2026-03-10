import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DrawEntry {
  entryId: number;
  userId: string;
  username: string;
  timestamp: number;
}

interface DrawState {
  poolAmount: number;
  targetAmount: number;
  prizeAmount: number;
  entries: DrawEntry[];
  nextEntryId: number;
  currentWinner: string | null;
  winningEntryId: number | null;
  winnerAnnouncedAt: number | null;
  drawHistory: { winner: string; date: number; prize: string; entryId: number; totalEntries: number }[];
  isDrawActive: boolean;

  addPurchase: (username: string, amount: number) => void;
  getProgressPercent: () => number;
  resetDraw: () => void;
}

// Simulated entries for demo
const DEMO_ENTRIES: DrawEntry[] = [
  { entryId: 1, userId: "1", username: "Sarah_M", timestamp: Date.now() - 86400000 * 5 },
  { entryId: 2, userId: "2", username: "Ahmed_K", timestamp: Date.now() - 86400000 * 4 },
  { entryId: 3, userId: "3", username: "Luna_Star", timestamp: Date.now() - 86400000 * 3 },
  { entryId: 4, userId: "4", username: "MaxPower", timestamp: Date.now() - 86400000 * 2 },
  { entryId: 5, userId: "5", username: "Nora_VIP", timestamp: Date.now() - 86400000 },
  { entryId: 6, userId: "6", username: "Player_X", timestamp: Date.now() - 43200000 },
  { entryId: 7, userId: "7", username: "GoldRush", timestamp: Date.now() - 21600000 },
  { entryId: 8, userId: "8", username: "DiamondQ", timestamp: Date.now() - 10800000 },
];

export const useDrawStore = create<DrawState>()(
  persist(
    (set, get) => ({
      poolAmount: 680,
      targetAmount: 1000,
      prizeAmount: 500,
      entries: DEMO_ENTRIES,
      nextEntryId: 9,
      currentWinner: null,
      winningEntryId: null,
      winnerAnnouncedAt: null,
      drawHistory: [
        { winner: "CryptoKing_99", date: Date.now() - 86400000 * 30, prize: "$500 Amazon", entryId: 12, totalEntries: 25 },
        { winner: "Lucky_Luna", date: Date.now() - 86400000 * 60, prize: "$500 Google Play", entryId: 8, totalEntries: 20 },
      ],
      isDrawActive: true,

      addPurchase: (username, amount) => {
        const state = get();
        const newPool = state.poolAmount + amount;
        const newEntry: DrawEntry = {
          entryId: state.nextEntryId,
          userId: Math.random().toString(36).slice(2),
          username,
          timestamp: Date.now(),
        };

        if (newPool >= state.targetAmount) {
          const allEntries = [...state.entries, newEntry];
          // Fair random: pick random entry by index (each entry = equal chance)
          const winnerIdx = Math.floor(Math.random() * allEntries.length);
          const winnerEntry = allEntries[winnerIdx];

          set({
            poolAmount: newPool,
            entries: allEntries,
            nextEntryId: state.nextEntryId + 1,
            currentWinner: winnerEntry.username,
            winningEntryId: winnerEntry.entryId,
            winnerAnnouncedAt: Date.now(),
            isDrawActive: false,
            drawHistory: [
              { winner: winnerEntry.username, date: Date.now(), prize: `$${state.prizeAmount} Gift Card`, entryId: winnerEntry.entryId, totalEntries: allEntries.length },
              ...state.drawHistory,
            ],
          });
        } else {
          set({
            poolAmount: newPool,
            entries: [...state.entries, newEntry],
            nextEntryId: state.nextEntryId + 1,
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
        nextEntryId: 1,
        currentWinner: null,
        winningEntryId: null,
        winnerAnnouncedAt: null,
        isDrawActive: true,
      }),
    }),
    { name: 'winline-draw-store' }
  )
);
