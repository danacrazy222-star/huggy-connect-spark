import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useChatStore } from './useChatStore';
import { supabase } from '@/integrations/supabase/client';

function saveWinnerToDB(winnerName: string, prizeAmount: number) {
  supabase.from('draw_winners').insert({
    winner_name: winnerName,
    prize_type: 'Gift Card',
    prize_amount: prizeAmount,
    draw_round_id: `round_${Date.now()}`,
  }).then(({ error }) => {
    if (error) console.error('Failed to save winner:', error);
  });
}

function broadcastDrawWinner(winnerName: string, entryId: number, prizeAmount: number) {
  const chatStore = useChatStore.getState();
  const allRoomIds = [0, 1, 2, 3, 4, 5];
  const msg = {
    user: "System",
    avatar: "🏆",
    message: `🎉🏆 DRAW WINNER! ${winnerName} (Entry #${entryId}) won a $${prizeAmount} Gift Card! 🎁💰`,
    crown: false,
    isSystem: true,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  allRoomIds.forEach(roomId => {
    chatStore.addMessage(roomId, msg);
  });
}

interface DrawEntry {
  entryId: number;
  userId: string;
  username: string;
  timestamp: number;
  amount: number; // purchase amount in $
}

interface DrawState {
  entries: DrawEntry[];
  nextEntryId: number;
  totalRevenue: number; // INTERNAL - total $ from purchases
  prizeAmount: number;
  currentWinner: string | null;
  winningEntryId: number | null;
  winnerAnnouncedAt: number | null;
  drawHistory: { winner: string; date: number; prize: string; entryId: number }[];
  isDrawActive: boolean;

  addPurchase: (username: string, amount: number) => void;
  getProgressPercent: () => number;
  resetDraw: () => void;
  triggerDraw: () => void;
}

// Revenue target = prizeAmount * 2 (2x profit margin)
const PRIZE_AMOUNT = 500;
const REVENUE_TARGET = PRIZE_AMOUNT * 2; // $1000

// Simulated entries for demo
const DEMO_ENTRIES: DrawEntry[] = [
  { entryId: 1, userId: "1", username: "Sarah_M", timestamp: Date.now() - 86400000 * 5, amount: 2 },
  { entryId: 2, userId: "2", username: "Ahmed_K", timestamp: Date.now() - 86400000 * 4, amount: 3 },
  { entryId: 3, userId: "3", username: "Luna_Star", timestamp: Date.now() - 86400000 * 3, amount: 1 },
  { entryId: 4, userId: "4", username: "MaxPower", timestamp: Date.now() - 86400000 * 2, amount: 3 },
  { entryId: 5, userId: "5", username: "Nora_VIP", timestamp: Date.now() - 86400000, amount: 2 },
  { entryId: 6, userId: "6", username: "Player_X", timestamp: Date.now() - 43200000, amount: 1 },
  { entryId: 7, userId: "7", username: "GoldRush", timestamp: Date.now() - 21600000, amount: 3 },
  { entryId: 8, userId: "8", username: "DiamondQ", timestamp: Date.now() - 10800000, amount: 2 },
];

const DEMO_REVENUE = DEMO_ENTRIES.reduce((sum, e) => sum + e.amount, 0); // $17

export const useDrawStore = create<DrawState>()(
  persist(
    (set, get) => ({
      entries: DEMO_ENTRIES,
      nextEntryId: 9,
      totalRevenue: DEMO_REVENUE,
      prizeAmount: PRIZE_AMOUNT,
      currentWinner: null,
      winningEntryId: null,
      winnerAnnouncedAt: null,
      drawHistory: [
        { winner: "CryptoKing_99", date: Date.now() - 86400000 * 30, prize: "$500 Amazon", entryId: 12 },
        { winner: "Lucky_Luna", date: Date.now() - 86400000 * 60, prize: "$500 Google Play", entryId: 8 },
      ],
      isDrawActive: true,

      addPurchase: (username, amount) => {
        const state = get();
        if (!state.isDrawActive) return;

        const newEntry: DrawEntry = {
          entryId: state.nextEntryId,
          userId: Math.random().toString(36).slice(2),
          username,
          timestamp: Date.now(),
          amount,
        };

        const allEntries = [...state.entries, newEntry];
        const newRevenue = state.totalRevenue + amount;

        // Check if revenue target reached (2x profit) → trigger draw
        if (newRevenue >= REVENUE_TARGET) {
          const winnerIdx = Math.floor(Math.random() * allEntries.length);
          const winnerEntry = allEntries[winnerIdx];

          set({
            entries: allEntries,
            nextEntryId: state.nextEntryId + 1,
            totalRevenue: newRevenue,
            currentWinner: winnerEntry.username,
            winningEntryId: winnerEntry.entryId,
            winnerAnnouncedAt: Date.now(),
            isDrawActive: false,
            drawHistory: [
              { winner: winnerEntry.username, date: Date.now(), prize: `$${state.prizeAmount} Gift Card`, entryId: winnerEntry.entryId },
              ...state.drawHistory,
            ],
          });

          // Broadcast winner to all chat rooms
          broadcastDrawWinner(winnerEntry.username, winnerEntry.entryId, state.prizeAmount);
        } else {
          set({
            entries: allEntries,
            nextEntryId: state.nextEntryId + 1,
            totalRevenue: newRevenue,
          });
        }
      },

      getProgressPercent: () => {
        const { totalRevenue } = get();
        return Math.min(Math.round((totalRevenue / REVENUE_TARGET) * 100), 100);
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

        broadcastDrawWinner(winnerEntry.username, winnerEntry.entryId, state.prizeAmount);
      },

      resetDraw: () => set({
        entries: [],
        nextEntryId: 1,
        totalRevenue: 0,
        currentWinner: null,
        winningEntryId: null,
        winnerAnnouncedAt: null,
        isDrawActive: true,
      }),
    }),
    { name: 'winline-draw-store' }
  )
);
