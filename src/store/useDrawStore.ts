import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DrawEntry {
  entryId: number;
  userId: string;
  username: string;
  timestamp: number;
}

interface DrawState {
  entries: DrawEntry[];
  nextEntryId: number;
  targetEntries: number; // INTERNAL ONLY - never show to users
  prizeAmount: number;
  currentWinner: string | null;
  winningEntryId: number | null;
  winnerAnnouncedAt: number | null;
  drawHistory: { winner: string; date: number; prize: string; entryId: number }[];
  isDrawActive: boolean;
  drawStartedAt: number; // timestamp when current draw started
  drawDurationMs: number; // duration in ms (24h default)

  addPurchase: (username: string) => void;
  getProgressPercent: () => number;
  resetDraw: () => void;
  checkTimerExpired: () => boolean;
  triggerDraw: () => void;
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

const DRAW_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const useDrawStore = create<DrawState>()(
  persist(
    (set, get) => ({
      entries: DEMO_ENTRIES,
      nextEntryId: 9,
      targetEntries: 500, // HIDDEN from users
      prizeAmount: 500,
      currentWinner: null,
      winningEntryId: null,
      winnerAnnouncedAt: null,
      drawHistory: [
        { winner: "CryptoKing_99", date: Date.now() - 86400000 * 30, prize: "$500 Amazon", entryId: 12 },
        { winner: "Lucky_Luna", date: Date.now() - 86400000 * 60, prize: "$500 Google Play", entryId: 8 },
      ],
      isDrawActive: true,
      drawStartedAt: Date.now() - 12 * 60 * 60 * 1000, // started 12h ago for demo
      drawDurationMs: DRAW_DURATION,

      addPurchase: (username) => {
        const state = get();
        if (!state.isDrawActive) return;

        const newEntry: DrawEntry = {
          entryId: state.nextEntryId,
          userId: Math.random().toString(36).slice(2),
          username,
          timestamp: Date.now(),
        };

        const allEntries = [...state.entries, newEntry];

        // Check if target entries reached → trigger draw
        if (allEntries.length >= state.targetEntries) {
          const winnerIdx = Math.floor(Math.random() * allEntries.length);
          const winnerEntry = allEntries[winnerIdx];

          set({
            entries: allEntries,
            nextEntryId: state.nextEntryId + 1,
            currentWinner: winnerEntry.username,
            winningEntryId: winnerEntry.entryId,
            winnerAnnouncedAt: Date.now(),
            isDrawActive: false,
            drawHistory: [
              { winner: winnerEntry.username, date: Date.now(), prize: `$${state.prizeAmount} Gift Card`, entryId: winnerEntry.entryId },
              ...state.drawHistory,
            ],
          });
        } else {
          set({
            entries: allEntries,
            nextEntryId: state.nextEntryId + 1,
          });
        }
      },

      getProgressPercent: () => {
        const { entries, targetEntries } = get();
        return Math.min(Math.round((entries.length / targetEntries) * 100), 100);
      },

      checkTimerExpired: () => {
        const { drawStartedAt, drawDurationMs, isDrawActive } = get();
        if (!isDrawActive) return false;
        return Date.now() >= drawStartedAt + drawDurationMs;
      },

      triggerDraw: () => {
        const state = get();
        if (!state.isDrawActive || state.entries.length === 0) return;

        const winnerIdx = Math.floor(Math.random() * state.entries.length);
        const winnerEntry = state.entries[winnerIdx];

        set({
          currentWinner: winnerEntry.username,
          winningEntryId: winnerEntry.entryId,
          winnerAnnouncedAt: Date.now(),
          isDrawActive: false,
          drawHistory: [
            { winner: winnerEntry.username, date: Date.now(), prize: `$${state.prizeAmount} Gift Card`, entryId: winnerEntry.entryId },
            ...state.drawHistory,
          ],
        });
      },

      resetDraw: () => set({
        entries: [],
        nextEntryId: 1,
        currentWinner: null,
        winningEntryId: null,
        winnerAnnouncedAt: null,
        isDrawActive: true,
        drawStartedAt: Date.now(),
      }),
    }),
    { name: 'winline-draw-store' }
  )
);
