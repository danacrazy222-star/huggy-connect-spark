import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatStore {
  unreadCount: number;
  addUnread: (count?: number) => void;
  clearUnread: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      unreadCount: 3,
      addUnread: (count = 1) => set((s) => ({ unreadCount: s.unreadCount + count })),
      clearUnread: () => set({ unreadCount: 0 }),
    }),
    { name: 'winline-chat-store' }
  )
);
