import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMsg } from '@/components/ChatMessageBubble';

interface ChatStore {
  unreadCount: number;
  addUnread: (count?: number) => void;
  clearUnread: () => void;
  roomMessages: Record<number, ChatMsg[]>;
  addMessage: (room: number, msg: ChatMsg) => void;
  initRoom: (room: number, defaults: ChatMsg[]) => void;
  updateMessageInRoom: (room: number, index: number, updates: Partial<ChatMsg>) => void;
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
      updateMessageInRoom: (room, index, updates) =>
        set((s) => ({
          roomMessages: {
            ...s.roomMessages,
            [room]: (s.roomMessages[room] || []).map((m, i) =>
              i === index ? { ...m, ...updates } : m
            ),
          },
        })),
    }),
    { name: 'winline-chat-store' }
  )
);
