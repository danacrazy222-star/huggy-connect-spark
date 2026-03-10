# Winline Design System

## Theme: Dark premium casino (deep purple/gold)
- Background: radial-gradient #2a0a55 → #1a0038 → #0b0220
- Primary gold: #FFD700, #FFC300, #FF9F00
- Purple accent: #9b59b6
- Blue accent: #3498db
- Green reward: #2ecc71
- Red rare: #e74c3c
- Fonts: Cinzel (display), Inter (body)
- Max 6 primary colors, gold unified across all headings/buttons

## Pages
- Home: Daily Spin wheel (reset 11:00 AM Asia/Beirut)
- Shop: 3 book packages ($1/$2/$3) + gift card draw
- Chat: 4 VIP rooms (Bronze/Silver/Gold/Diamond)
- VIP: XP progression, mystery chests
- Tarot: AI tarot card reading

## State: Zustand (useGameStore) with persist
- Points, XP, Level, GameTickets, TarotTickets, DrawEntries
- 1000 points = $1 internal credit
- 20 VIP levels, XP thresholds scale exponentially

## Economy
- Spin: 1x per day (reset 11 AM Beirut), rewards: XP/Points/Tickets
- Books: Basic($1)=50XP+entry, Plus($2)=120XP+ticket+entry, Premium($3)=250XP+tickets+entry
- Games: 1 ticket entry, bet with points only
- Winner gets 40XP, loser max 5XP
