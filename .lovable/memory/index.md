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

## Frame System
- DiamondFrame activates at level 25+ (elite), legend effects at level 33+

## Economy
- Spin: 1x per 24h (resets 11AM Beirut), rewards: XP/Points/Tickets/Entries
- Books: Basic($1)=1500XP+entry, Plus($2)=3500XP+ticket+entry, Premium($3)=6000XP+20pts+tickets+entries, Elite($5)=12000XP+50pts+2tickets+2tarot+3entries
- Games: 1 ticket entry, bet with points only
- Winner gets 300XP, loser 80XP
- World Challenge: $5 book unlocks duel in World room, winner announced in all rooms
