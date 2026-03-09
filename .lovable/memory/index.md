# Winline Design System

## Theme: Dark premium gaming (purple/gold)
- Background: deep purple `260 60% 8%`
- Primary (gold): `45 100% 50%`
- Accent (purple glow): `270 80% 55%`
- Fonts: Cinzel (display), Inter (body)

## Pages
- Home: Daily Spin wheel
- Shop: 3 book packages ($1/$2/$3) + gift card draw
- Chat: 4 VIP rooms (Bronze/Silver/Gold/Diamond)
- VIP: XP progression, mystery chests
- Tarot: AI tarot card reading

## State: Zustand (useGameStore) with persist
- Points, XP, Level, GameTickets, TarotTickets, DrawEntries
- 1000 points = $1 internal credit
- 20 VIP levels, XP thresholds scale exponentially

## Economy
- Spin: 1x per 24h, rewards: XP/Points/Tickets/Entries
- Books: Basic($1)=1500XP+entry, Plus($2)=3500XP+ticket+entry, Premium($3)=6000XP+tickets+entry
- Snake & Ladder: 1 ticket entry, Win=300XP, Lose=80XP, bet with points
- Scratch Card rewards: 20XP, 50XP, 100XP, Game Ticket, Points, Empty
- Draw: hidden $ tracking, users see % only, prize×2 = required sales

## Future: 10 languages, RTL Arabic, Snake&Ladder multiplayer
