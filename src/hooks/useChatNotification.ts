import { useCallback, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';

// Simple notification sound using Web Audio API
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.08);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.16);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Audio not supported
  }
}

export function useChatNotification() {
  const addUnread = useChatStore((s) => s.addUnread);
  const clearUnread = useChatStore((s) => s.clearUnread);
  const unreadCount = useChatStore((s) => s.unreadCount);

  const notify = useCallback(() => {
    addUnread(1);
    playNotificationSound();
  }, [addUnread]);

  return { notify, clearUnread, unreadCount };
}
