import { useGameSync } from "@/hooks/useGameSync";

export function GameSyncProvider({ children }: { children: React.ReactNode }) {
  useGameSync();
  return <>{children}</>;
}
