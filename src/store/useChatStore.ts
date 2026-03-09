import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMsg } from '@/components/ChatMessageBubble';

interface ChatStore {
  unreadCount: number;
  addUnread: (count?: number) => void;
  clearUnread: () => void;
  // Messages per room (by room index)
  roomMessages: Record<number, ChatMsg[]>;
  addMessage: (room: number, msg: ChatMsg) => void;
  initRoom: (room: number, defaults: ChatMsg[]) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      unreadCount: 3,
      addUnread: (count = 1) => set((s) => ({ unreadCount: s.unreadCount + count })),
      clearUnread: () => set({ unreadCount: 0 }),
      roomMessages: {},
      addMessage: (room, msg) =>
        set((s) => ({
          roomMessages: {
            ...s.roomMessages,
            [room]: [...(s.roomMessages[room] || []), msg],
          },
        })),
      initRoom: (room, defaults) => {
        if (!get().roomMessages[room]?.length) {
          set((s) => ({
            roomMessages: { ...s.roomMessages, [room]: defaults },
          }));
        }
      },
    }),
    { name: 'winline-chat-store' }
  )
);
