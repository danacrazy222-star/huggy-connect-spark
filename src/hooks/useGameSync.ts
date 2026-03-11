import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGameStore } from '@/store/useGameStore';
import { supabase } from '@/integrations/supabase/client';

/**
 * Syncs game state (XP, level, points, tickets) with the database.
 * On login: loads from DB (DB is source of truth).
 * On state change: saves to DB with debounce.
 */
export function useGameSync() {
  const { user } = useAuth();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loaded = useRef(false);

  // Load from DB on login
  useEffect(() => {
    if (!user) {
      loaded.current = false;
      return;
    }

    const loadFromDB = async () => {
      const { data, error } = await supabase
        .from('user_game_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Failed to load game data:', error);
        return;
      }

      if (data) {
        // DB exists → load it into store
        useGameStore.setState({
          xp: data.xp,
          level: data.level,
          points: data.points,
          gameTickets: data.game_tickets,
          tarotTickets: data.tarot_tickets,
          drawEntries: data.draw_entries,
          lastSpinTime: data.last_spin_time ? Number(data.last_spin_time) : null,
          lastChestTime: data.last_chest_time ? Number(data.last_chest_time) : null,
          lastChestReward: data.last_chest_reward,
        });
      } else {
        // No row yet (existing user before migration) → create one with current local state
        const state = useGameStore.getState();
        await supabase.from('user_game_data').insert({
          user_id: user.id,
          xp: state.xp,
          level: state.level,
          points: state.points,
          game_tickets: state.gameTickets,
          tarot_tickets: state.tarotTickets,
          draw_entries: state.drawEntries,
          last_spin_time: state.lastSpinTime,
          last_chest_time: state.lastChestTime,
          last_chest_reward: state.lastChestReward,
        });
      }
      loaded.current = true;
    };

    loadFromDB();
  }, [user]);

  // Save to DB on state changes (debounced)
  useEffect(() => {
    if (!user) return;

    const unsub = useGameStore.subscribe((state) => {
      if (!loaded.current) return;

      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await supabase
          .from('user_game_data')
          .update({
            xp: state.xp,
            level: state.level,
            points: state.points,
            game_tickets: state.gameTickets,
            tarot_tickets: state.tarotTickets,
            draw_entries: state.drawEntries,
            last_spin_time: state.lastSpinTime,
            last_chest_time: state.lastChestTime,
            last_chest_reward: state.lastChestReward,
          })
          .eq('user_id', user.id);
      }, 1000);
    });

    return () => {
      unsub();
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [user]);
}
