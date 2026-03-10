# Winline Design System

## Theme: Dark premium gaming (purple/gold)
- Background: deep purple `260 60% 8%`
- Primary (gold): `45 100% 50%`
- Accent (purple glow): `270 80% 55%`
- Fonts: Cinzel (display), Inter (body)

## Pages
- Home: Daily Spin wheel
- Shop: 3 book packages ($1/$2/$3) + gift card draw
- Chat: 6 rooms (World/Bronze/Silver/Gold/Diamond/Legend)
- VIP: XP progression, mystery chests
- Tarot: AI tarot card reading

## Room Level Requirements
- World: open (Lv0), Bronze: Lv1, Silver: Lv5, Gold: Lv10, Diamond: Lv20, Legend: Lv40

## State: Zustand (useGameStore) with persist
- Points, XP, Level, GameTickets, TarotTickets, DrawEntries
- 1000 points = $1 internal credit
- 40 max level, XP thresholds scale exponentially

## Frame System
- DiamondFrame activates at level 20+ (elite), legend effects at level 40+

## Economy
- Spin: 1x per 24h, rewards: XP/Points/Tickets/Entries
- Books: Basic($1)=50XP+entry, Plus($2)=120XP+ticket+entry, Premium($3)=250XP+tickets+entry
- Games: 1 ticket entry, bet with points only
- Winner gets 40XP, loser max 5XP
