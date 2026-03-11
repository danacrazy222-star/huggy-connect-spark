Registry of things that must NOT be removed or changed without explicit user request

## NEVER DELETE these components:
- DiamondFrame.tsx - animated tier frames: Bronze(1-8), Silver(9-16), Gold(17-24), Diamond(25-32), Legend(33-40)
- WorldChallengePromo - $5 book unlock for World room duel
- ChatDuelChallenge - duel challenge component in chat
- XPRainEvent - XP rain mini-game
- WelcomePopup - first-visit Madam Zara popup
- broadcastDrawWinner in useDrawStore - winner announcement to all rooms

## NEVER CHANGE without asking:
- XP cumulative thresholds (40 levels, 0 to 2M)
- Room level requirements (World:0, Bronze:1-8, Silver:9-16, Gold:17-24, Diamond:25-32, Legend:33-40)
- Economy values (book prices, XP rewards, spin rewards)
- DiamondFrame tier colors (bronze/silver/gold/diamond/legend gradients)
- World Challenge flow (buy $5 → unlock → duel → announce → re-lock)
- World Challenge flow (buy $5 → unlock → duel → announce → re-lock)
