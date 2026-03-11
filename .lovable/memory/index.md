Winline design system, economy rules, and architecture overview

## Theme: Dark premium gaming (purple/gold)
- Background: deep purple `260 60% 8%`
- Primary (gold): `45 100% 50%`
- Accent (purple glow): `270 80% 55%`
- Fonts: Cinzel (display), Inter (body)

## Pages
- Home: Daily Spin wheel
- Shop: 4 book packages ($1/$2/$3/$5) + gift card draw
- Chat: 6 rooms (World/Bronze/Silver/Gold/Diamond/Legend)
- VIP: XP progression, mystery chests
- Tarot: AI tarot card reading
- Draw: $500 gift card giveaway with progress tracking
- Games: Duel games (RPS etc.)
- Profile, UserProfile, Messages (DMs)

## Room Level Requirements
- World: open (Lv0), Bronze: Lv1-8, Silver: Lv9-16, Gold: Lv17-24, Diamond: Lv25-32, Legend: Lv33-40

## State: Zustand (useGameStore) with persist
- Points, XP, Level, GameTickets, TarotTickets, DrawEntries
- 1000 points = $1 internal credit
- 40 max level, cumulative XP thresholds

## XP System (Cumulative Thresholds)
- Lv1:0, Lv2:1K, Lv3:2.5K, Lv4:4.5K, Lv5:7K, Lv6:10K, Lv7:14K, Lv8:20K, Lv9:27K, Lv10:35K
- Lv11:45K, Lv12:56K, Lv13:69K, Lv14:84K, Lv15:101K, Lv16:120K, Lv17:145K, Lv18:175K, Lv19:210K, Lv20:250K
- Lv21:295K, Lv22:350K, Lv23:420K, Lv24:500K, Lv25:550K, Lv26:610K, Lv27:680K, Lv28:755K, Lv29:835K, Lv30:920K
- Lv31:1.01M, Lv32:1.1M, Lv33:1.195M, Lv34:1.295M, Lv35:1.4M, Lv36:1.51M, Lv37:1.625M, Lv38:1.745M, Lv39:1.87M, Lv40:2M

## DiamondFrame Component (DO NOT DELETE)
- File: src/components/DiamondFrame.tsx
- Activates at level 25+ (elite) with gold rotating gradient ring
- Legend effects at level 33+ with blue diamond gradient, sparkle particles, counter-rotating ring, 💎 ornament
- Used in: Chat avatars (ChatMessageBubble), Profile page, UserProfile page
- Props: children, size(sm/lg), active, level, className

## Economy
- Spin: 1x per 24h (resets 11AM Beirut), rewards: XP/Points/Tickets/Entries
- Books: Basic($1)=300XP+entry, Plus($2)=700XP+ticket+entry, Premium($3)=1100XP+20pts+tickets+entries, Elite($5)=1800XP+50pts+2tickets+2tarot+3entries
- Games: 1 ticket entry, bet with points only
- Winner gets 300XP, loser 80XP

## World Challenge Feature (DO NOT DELETE)
- $5 Elite book unlocks duel in World room (worldChallengeUnlocked in useGameStore)
- WorldChallengePromo shown when locked, ChatDuelChallenge shown when unlocked
- Winner announced as system message in ALL 6 rooms
- Challenge re-locks after duel ends (lockWorldChallenge)

## Draw Winner Broadcast (DO NOT DELETE)
- When draw winner picked (addPurchase hitting revenue target OR triggerDraw), broadcast to all 6 chat rooms
- Uses broadcastDrawWinner() in useDrawStore.ts → useChatStore.addMessage to all rooms
- System message format: "🎉🏆 DRAW WINNER! {name} (Entry #{id}) won a ${amount} Gift Card! 🎁💰"

## Key Components (DO NOT DELETE)
- TopBar: Shows XP/Points, language switcher
- BottomNav: Navigation tabs
- SpinWheel: Daily spin with rewards
- ChatMessageBubble: Chat messages with DiamondFrame for high-level users
- ChatDuelChallenge: Duel challenge in chat rooms
- WorldChallengePromo: Promo for $5 book to unlock World duel
- XPRainEvent: XP rain mini-game in chat
- WelcomePopup: First-visit popup with Madam Zara

## Stores (DO NOT DELETE)
- useGameStore: points, xp, level, tickets, spin, worldChallenge
- useChatStore: roomMessages, unreadCount
- useDrawStore: entries, revenue, winner, broadcast
- useLanguageStore: language preference
