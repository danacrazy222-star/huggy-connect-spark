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
- Games: 1 ticket entry, bet with points only, 1 game per 24h
- Game XP by room: R1(Lv1-5)=600W/250P, R2(Lv6-10)=1200W/400P, R3(Lv11-15)=2000W/700P, R4(Lv16-20)=3000W/1000P
- Loss gives 0 XP

## Future: 10 languages, RTL Arabic, Snake&Ladder multiplayer, gift card draw ($1000 pool → $500 prize)
