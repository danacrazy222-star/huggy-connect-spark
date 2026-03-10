import type { Language } from '@/store/useLanguageStore';

export type TranslationKeys = {
  // Navigation
  profile: string;
  home: string;
  shop: string;
  games: string;
  chat: string;
  crown: string;
  cards: string;
  // Home
  giftCard: string;
  promotionalDraw: string;
  dailySpin: string;
  oneFreeAttempt: string;
  nextSpinIn: string;
  hours: string;
  minutes: string;
  seconds: string;
  xpPoints: string;
  gameTickets: string;
  extraEntries: string;
  surpriseRewards: string;
  allRewardsPromotional: string;
  noCashValue: string;
  spinNow: string;
  spinning: string;
  comeBackTomorrow: string;
  youWon: string;
  maybeLater: string;
  // Spin segments
  extraChance: string;
  drawEntry: string;
  tryAgain: string;
  gameTicket: string;
  surpriseReward: string;
  // Shop
  selectBookExperience: string;
  inOur: string;
  bookPurchaseDraw: string;
  mostPopular: string;
  vipXP: string;
  tarotTicket: string;
  entry: string;
  value: string;
  purchasesProvideAccess: string;
  bonusFeatures: string;
  // Games
  availableGames: string;
  snakeAndLadder: string;
  classicBoardGame: string;
  tapFrenzy: string;
  tapAsFast: string;
  memoryMatch: string;
  matchHiddenCards: string;
  comingSoon: string;
  ticket: string;
  gameRules: string;
  entryTicket: string;
  betWithPoints: string;
  winnerGets: string;
  loserGets: string;
  noOpponentBot: string;
  findOpponent: string;
  noTickets: string;
  notEnoughPoints: string;
  setYourBet: string;
  yourPoints: string;
  entryCost: string;
  yourTickets: string;
  findingOpponent: string;
  botJoinsIn: string;
  searchingPlayers: string;
  yourTurn: string;
  botsTurn: string;
  roll: string;
  youWin: string;
  botWins: string;
  backToGames: string;
  rollTheDice: string;
  // Chat
  typeMessage: string;
  reachLevel: string;
  toUnlockRoom: string;
  yourCurrentLevel: string;
  room: string;
  // VIP
  eachDayJoin: string;
  closerToFew: string;
  mysteryReward: string;
  bronzeChest: string;
  silverChest: string;
  goldChest: string;
  level: string;
  elite: string;
  legend: string;
  // Tarot
  aiTarotReading: string;
  selectCardReveal: string;
  ticketsRemaining: string;
  readAgain: string;
  noTarotTickets: string;
  spinOrPurchase: string;
  card: string;
  // Language
  language: string;
  selectLanguage: string;
  // Draw
  drawProgress: string;
  drawActive: string;
  drawComplete: string;
  towardsDraw: string;
  participants: string;
  totalEntries: string;
  prize: string;
  howToEnter: string;
  buyBook: string;
  autoEntered: string;
  moreBooks: string;
  winnerSelected: string;
  recentEntries: string;
  pastWinners: string;
  enterDraw: string;
  drawWinner: string;
  wonPrize: string;
  congratulations: string;
  newDraw: string;
  drawDescription: string;
  draw: string;
  // Draw new keys
  drawExtended: string;
  drawExtendedMessage: string;
  nextDrawIn: string;
  fairDrawSystem: string;
  fairDrawDescription: string;
  winnerAnnounced: string;
  won: string;
  enterTheDraw: string;
  giftCardDraw: string;
  drawCloseInfo: string;
  getUniqueEntry: string;
  premiumTwoEntries: string;
  randomPicksWinner: string;
  yourEntries: string;
  // Draw Ideelz-style keys
  drawMainTitle: string;
  drawSubtitle: string;
  drawClosingCondition: string;
  buyAndEnter: string;
  howItWorks: string;
  howStep1: string;
  howStep2: string;
  howStep3: string;
  howStep4: string;
  moreInfo: string;
  moreInfo1: string;
  moreInfo2: string;
  moreInfo3: string;
  moreInfo4: string;
  yourCurrentEntries: string;
  // Auth
  login: string;
  signup: string;
  loginSubtitle: string;
  signupSubtitle: string;
  displayName: string;
  email: string;
  password: string;
  passwordMinLength: string;
  welcomeBack: string;
  accountCreated: string;
  logout: string;
  // Profile
  loginToViewProfile: string;
  inventory: string;
  settings: string;
  clearData: string;
  photoUpdated: string;
  nameUpdated: string;
  dataCleared: string;
  // Scratch Card
  scratchCard: string;
  scratchCardDesc: string;
  scratchToReveal: string;
  scratchArea: string;
  youRevealed: string;
  claimReward: string;
  tryAnotherCard: string;
  noReward: string;
  scratchCardCost: string;
  // Duel Challenge
  duelRPS: string;
  duelSearching: string;
  duelSendingInvites: string;
  duelFoundOpponent: string;
  duelChooseWinner: string;
  duelVoteBefore: string;
  duelYourVote: string;
  duelLiveVote: string;
  duelRound: string;
  duelChooseMove: string;
  duelVs: string;
  duelRockPaperScissors: string;
  duelDraw: string;
  duelWonRound: string;
  duelIsWinner: string;
  duelScore: string;
  duelVoteCorrect: string;
  duelVoteWrong: string;
  duelDidntVote: string;
  duelDone: string;
  duelRock: string;
  duelPaper: string;
  duelScissors: string;
  // World Challenge
  worldChallengeTitle: string;
  worldChallengeDesc: string;
  worldChallengePurchased: string;
  worldChallengeUnlockedMsg: string;
  worldBookExclusive: string;
  worldOneChallenge: string;
  worldNameShown: string;
  worldGameTicket: string;
  worldDrawEntry: string;
  worldPerBook: string;
  worldBuyBook: string;
  worldAfterChallenge: string;
  worldLockMsg: string;
  // System messages
  systemChampion: string;
  systemNewLegend: string;
  systemWhoChallenge: string;
  welcomeMsg: string;
  welcomeLitRoom: string;
  // Full i18n keys
  winlineDailySpin: string; winGiftCard: string; spinTheWheelBtn: string; comeBackSpin: string;
  dailySpinReward: string; nextFreeSpin: string; freeSpinAvailable: string;
  betterLuckNextTime: string; wonAmazingReward: string; addedToAccount: string;
  tryAgainTomorrow: string; awesomeBtn: string; comeBackTomorrowChance: string;
  shopHeroTitle: string; shopHeroSubtitle: string; chooseBookPack: string;
  basicPack: string; plusPack: string; premiumPack: string; bestValueTag: string;
  includesLabel: string; digitalBook: string; buyForPrice: string;
  shopDisclaimer2: string; purchasedToast: string;
  chooseGiftCardPrize: string; winBadge: string;
  confirmPurchaseTitle: string; youWillReceive: string; confirmPurchaseBtn: string;
  male: string; female: string; playerYou: string; botPlayer: string;
  needsExactRoll: string; revealRewardNow: string; scratchWinTypes: string;
  madamZaraTitle: string; mysteryReaderLabel: string; startTarotBtn: string;
  noTicketsTarot: string; selectCardsHeart: string; tapAnyCard: string;
  revealReadTarot: string; askMadamZara: string; liveLabel: string;
  bonusEntriesLabel: string;
  // SpinWheel segment labels
  seg_xp50: string; seg_tryAgain: string; seg_surprise: string; seg_gameTicket: string;
  seg_pointsXp: string; seg_xp100: string; seg_tarotTicket: string; seg_ticketCombo: string;
  // SpinWheel reward labels
  reward_xp50: string; reward_xp100: string; reward_gameTicket: string; reward_tarotTicket: string;
  reward_ticketCombo: string; reward_pointsXp: string; reward_surprise: string; reward_tryAgain: string;
  // Welcome popup
  welcomeTitle: string;
  welcomeMessage: string;
  welcomeButton: string;
  // XP Rain
  xpRainTitle: string;
  xpRainCollected: string;
  xpRainOver: string;
  xpRainYouGot: string;
  xpRainAddedToAccount: string;
  xpRainStarting: string;
  xpRainAnnounce: string;
  // Google Play compliance
  promotionRules: string;
  termsAndConditions: string;
  promotionalGiveaway: string;
  drawGiveawayNote: string;
  shopPackDisclaimer: string;
  promoRulesHowDrawWorks: string;
  promoRulesHowDrawWorksDesc: string;
  promoRulesWinnerSelection: string;
  promoRulesWinnerSelectionDesc: string;
  promoRulesDateConditions: string;
  promoRulesDateConditionsDesc: string;
  promoRulesRewardsNote: string;
  promoRulesRewardsNoteDesc: string;
  promoRulesDisclaimer: string;
  termsPromotionRules: string;
  termsPromotionRulesDesc: string;
  termsRewardExplanation: string;
  termsRewardExplanationDesc: string;
  termsRefundPolicy: string;
  termsRefundPolicyDesc: string;
  termsDisclaimer: string;
  termsDisclaimerDesc: string;
  termsLastUpdated: string;
};

export const translations: Record<Language, TranslationKeys> = {
  en: {
    home: "Home", shop: "Shop", games: "Games", chat: "Chat", crown: "Crown", cards: "Cards",
    giftCard: "$500 Gift Card", promotionalDraw: "PROMOTIONAL DRAW", dailySpin: "DAILY SPIN",
    oneFreeAttempt: "You Have ONE FREE ATTEMPT Today!", nextSpinIn: "Your Next Free Spin Will Be Available In:",
    hours: "HOURS", minutes: "MINUTES", seconds: "SECONDS",
    xpPoints: "XP Points", gameTickets: "Game Tickets", extraEntries: "Extra Entries", surpriseRewards: "Surprise",
    allRewardsPromotional: "All Rewards Are Promotional", noCashValue: "No Cash Value",
    spinNow: "SPIN NOW", spinning: "SPINNING...", comeBackTomorrow: "COME BACK TOMORROW",
    youWon: "You won!", maybeLater: "MAYBE LATER",
    extraChance: "Extra Chance", drawEntry: "Draw Entry", tryAgain: "Try Again",
    gameTicket: "Game Ticket", surpriseReward: "Surprise Reward",
    selectBookExperience: "Select Your Book Experience", inOur: "in our",
    bookPurchaseDraw: "Book Purchase Draw", mostPopular: "MOST POPULAR",
    vipXP: "VIP XP", tarotTicket: "Tarot Ticket", entry: "ENTRY", value: "VALUE",
    purchasesProvideAccess: "Purchases provide access to digital books.",
    bonusFeatures: "Bonus features are promotional rewards included with purchases.",
    availableGames: "Available Games", snakeAndLadder: "Snake & Ladder",
    classicBoardGame: "Classic board game • PvP or vs Bot",
    tapFrenzy: "Tap Frenzy", tapAsFast: "Tap as fast as you can!",
    memoryMatch: "Memory Match", matchHiddenCards: "Match the hidden cards",
    comingSoon: "Coming Soon", ticket: "Ticket", gameRules: "Game Rules",
    entryTicket: "Entry: 1 Game Ticket per game", betWithPoints: "Bet with Points only (not XP)",
    winnerGets: "Winner gets +300 XP", loserGets: "Loser gets +80 XP",
    noOpponentBot: "No opponent in 60s? Bot joins automatically",
    findOpponent: "FIND OPPONENT", noTickets: "No Tickets!", notEnoughPoints: "Not Enough Points",
    setYourBet: "Set Your Bet (Points)", yourPoints: "Your Points",
    entryCost: "Entry Cost", yourTickets: "Your Tickets",
    findingOpponent: "Finding Opponent...", botJoinsIn: "Bot joins in",
    searchingPlayers: "Searching for players...", yourTurn: "Your turn", botsTurn: "Bot's turn...",
    roll: "ROLL", youWin: "YOU WIN! 🎉", botWins: "Bot Wins!",
    backToGames: "BACK TO GAMES", rollTheDice: "Roll the dice!",
    typeMessage: "Type a message...", reachLevel: "Reach",
    toUnlockRoom: "to unlock this room", yourCurrentLevel: "Your current level",
    room: "Room",
    eachDayJoin: "Each day you join brings you", closerToFew: "closer to where few can reach.",
    mysteryReward: "MYSTERY REWARD", bronzeChest: "Bronze Chest",
    silverChest: "Silver Chest", goldChest: "Gold Chest",
    level: "Level", elite: "Elite", legend: "Legend",
    aiTarotReading: "AI Tarot Reading", selectCardReveal: "Select a card to reveal your destiny",
    ticketsRemaining: "tickets remaining", readAgain: "Read Again",
    noTarotTickets: "No tarot tickets available.",
    spinOrPurchase: "Spin the wheel or purchase a book to earn tickets!",
    card: "Card", language: "Language", selectLanguage: "Select Language",
    drawProgress: "Draw Progress", drawActive: "Active", drawComplete: "Complete", towardsDraw: "towards the draw",
    participants: "Participants", totalEntries: "Total Entries", prize: "Prize", howToEnter: "How to Enter",
    buyBook: "Purchase any book package", autoEntered: "You're automatically entered in the draw",
    moreBooks: "More purchases = more chances to win", winnerSelected: "Winner selected automatically at 100%",
    recentEntries: "Recent Entries", pastWinners: "Past Winners", enterDraw: "ENTER THE DRAW",
    drawWinner: "Draw Winner", wonPrize: "Won the prize", congratulations: "Congratulations",
    newDraw: "START NEW DRAW", drawDescription: "Buy books to enter the $500 gift card draw!", draw: "Draw",
    login: "Login", signup: "Sign Up", loginSubtitle: "Welcome back to WINLINE", signupSubtitle: "Create your account", displayName: "Display Name", email: "Email", password: "Password", passwordMinLength: "Password must be at least 6 characters", welcomeBack: "Welcome back!", accountCreated: "Account created successfully!", logout: "Logout",
    scratchCard: "Scratch Card", scratchCardDesc: "Scratch to reveal your prize!", scratchToReveal: "Scratch the card to reveal your reward", scratchArea: "Scratch here!", youRevealed: "You revealed", claimReward: "CLAIM REWARD", tryAnotherCard: "TRY ANOTHER CARD", noReward: "Better luck next time!", scratchCardCost: "1 Game Ticket",
    profile: "Profile", loginToViewProfile: "Login to view your profile", inventory: "Inventory", settings: "Settings", clearData: "Clear Data", photoUpdated: "Photo updated!", nameUpdated: "Name updated!", dataCleared: "Data cleared!",
    drawExtended: "Draw Extended", drawExtendedMessage: "The draw has been extended due to high demand. All entries remain active.", nextDrawIn: "Next Draw In", fairDrawSystem: "Fair Draw System", fairDrawDescription: "Winner is selected randomly from all entries using a secure random generator. Every entry has an equal chance to win.", winnerAnnounced: "Winner Announced!", won: "Won", enterTheDraw: "Enter the $500 Draw", giftCardDraw: "$500 Gift Card Draw", drawCloseInfo: "The draw will close when progress reaches 100% or when the countdown timer ends.", getUniqueEntry: "Get a unique Entry #ID", premiumTwoEntries: "Premium Pack = 2 Entries!", randomPicksWinner: "Random number picks the winner!", yourEntries: "Your Entries",
    drawMainTitle: "Buy a Book & Enter the Draw to Win a $500 Gift Card", drawSubtitle: "Every qualifying purchase gives you a chance to enter the draw. Premium Pack gives you 2 entries.", drawClosingCondition: "The draw concludes when the qualifying batch is complete or when the campaign period ends, whichever comes first.", buyAndEnter: "Buy & Enter the Draw", howItWorks: "How It Works", howStep1: "Buy any book package", howStep2: "You get an entry chance", howStep3: "Premium = 2 entries", howStep4: "Winner is randomly selected when the draw closes", moreInfo: "More Information", moreInfo1: "The draw is promotional", moreInfo2: "Entries are granted based on the package purchased", moreInfo3: "Winner is selected through a fair draw system", moreInfo4: "Campaign is subject to terms & conditions", yourCurrentEntries: "Your Current Entries",
    duelRPS: "✊✋✌️ Rock Paper Scissors Challenge", duelSearching: "🔍 Searching for a player...", duelSendingInvites: "Sending invitations to available players", duelFoundOpponent: "⚡ Opponent found! Get ready... ⚡", duelChooseWinner: "🎯 Choose the winner!", duelVoteBefore: "Vote before the challenge starts", duelYourVote: "✓ Your vote", duelLiveVote: "📊 Live vote percentage", duelRound: "Round", duelChooseMove: "Choose your move!", duelVs: "vs", duelRockPaperScissors: "⚡ Rock... Paper... Scissors!", duelDraw: "🤝 Draw! Replaying round...", duelWonRound: "won the round!", duelIsWinner: "is the winner!", duelScore: "Score", duelVoteCorrect: "🎉 Your vote was correct!", duelVoteWrong: "😔 Your vote was wrong", duelDidntVote: "You didn't vote", duelDone: "Done ✓", duelRock: "Rock", duelPaper: "Paper", duelScissors: "Scissors",
    worldChallengeTitle: "⚔️ Challenge the World", worldChallengeDesc: "Buy the digital book to get one attempt and unlock an exclusive challenge in the World room!", worldChallengePurchased: "🎉 Purchase successful!", worldChallengeUnlockedMsg: "One challenge is now unlocked in the World room!", worldBookExclusive: "Exclusive digital book", worldOneChallenge: "One challenge per purchase in the World room", worldNameShown: "Your name appears as the challenge champion", worldGameTicket: "🎮 One game ticket", worldDrawEntry: "🎟️ One draw entry", worldPerBook: "/ digital book", worldBuyBook: "📖 Buy the book & unlock the challenge", worldAfterChallenge: "* After the challenge ends, it locks immediately and requires a new purchase to play again", worldLockMsg: "🔒 Buy the book to unlock the World challenge",
    systemChampion: "Champion", systemNewLegend: "New room legend! Who dares to challenge?", systemWhoChallenge: "won the challenge against", welcomeMsg: "Hello", welcomeLitRoom: "You lit up the room",
    winlineDailySpin: "WINLINE DAILY SPIN", winGiftCard: "Win a $500 Gift Card", spinTheWheelBtn: "🎰 SPIN THE WHEEL", comeBackSpin: "Come Back Tomorrow for Your Next Spin", dailySpinReward: "DAILY SPIN REWARD", nextFreeSpin: "NEXT FREE SPIN", freeSpinAvailable: "You have one free spin available!", betterLuckNextTime: "Better Luck Next Time!", wonAmazingReward: "You just won an amazing reward!", addedToAccount: "Added to your account", tryAgainTomorrow: "Try Again Tomorrow", awesomeBtn: "Awesome! 🎉", comeBackTomorrowChance: "Come back tomorrow for another chance!", shopHeroTitle: "Buy a Digital Book &\nEnter the $500 Gift Card Draw", shopHeroSubtitle: "Every purchase gives you game rewards and a chance to win a $500 Gift Card.", chooseBookPack: "Choose Your Book Pack", basicPack: "Basic Pack", plusPack: "Plus Pack", premiumPack: "Premium Pack", bestValueTag: "Best Value", includesLabel: "Includes:", digitalBook: "Digital Book", buyForPrice: "Buy for", shopDisclaimer2: "Game rewards and draw entries are promotional bonuses.", purchasedToast: "purchased!", chooseGiftCardPrize: "Choose Your Gift Card Prize", winBadge: "WIN $500", confirmPurchaseTitle: "Confirm Purchase", youWillReceive: "You will receive:", confirmPurchaseBtn: "Confirm Purchase", male: "Male", female: "Female", playerYou: "You", botPlayer: "Bot 🤖", needsExactRoll: "needs exact roll!", revealRewardNow: "Reveal reward now", scratchWinTypes: "Points, XP, Tickets", madamZaraTitle: "Madam Zara — Tarot", mysteryReaderLabel: "Mystery Reader", startTarotBtn: "Start Tarot Session", noTicketsTarot: "No tickets. Spin the wheel or buy from shop", selectCardsHeart: "Select cards from your heart", tapAnyCard: "Tap any card to select it", revealReadTarot: "Reveal Cards & Read Tarot", askMadamZara: "Ask Madam Zara...", liveLabel: "Live", bonusEntriesLabel: "Bonus Entries",
    seg_xp50: "50\nXP", seg_tryAgain: "Try\nAgain", seg_surprise: "Surprise\nGift", seg_gameTicket: "Game\nTicket", seg_pointsXp: "15 Pts\n+50 XP", seg_xp100: "100\nXP", seg_tarotTicket: "Tarot\nTicket", seg_ticketCombo: "Game &\nTarot",
    reward_xp50: "50 XP", reward_xp100: "100 XP", reward_gameTicket: "Game Ticket", reward_tarotTicket: "Tarot Ticket", reward_ticketCombo: "Game & Tarot Ticket", reward_pointsXp: "15 Points + 50 XP", reward_surprise: "Surprise Gift", reward_tryAgain: "Try Again",
    welcomeTitle: "Welcome to Winline! ✨", welcomeMessage: "I'm Madam Zara, your mystical guide. Spin the wheel, play games, and win amazing prizes. Let the magic begin!", welcomeButton: "Let's Go! 🎉",
    xpRainTitle: "XP RAIN", xpRainCollected: "Collected", xpRainOver: "XP Rain Over!", xpRainYouGot: "You collected", xpRainAddedToAccount: "Added to your XP!", xpRainStarting: "⚡ XP Rain starting in 3 seconds! Get ready to tap! ⚡", xpRainAnnounce: "collected",
    promotionRules: "Promotion Rules", termsAndConditions: "Terms & Conditions", promotionalGiveaway: "PROMOTIONAL GIVEAWAY", drawGiveawayNote: "This is a promotional giveaway. Purchasing does not guarantee winning.", shopPackDisclaimer: "Purchases provide access to digital books. XP, tickets, and draw entries are promotional bonus rewards.",
    promoRulesHowDrawWorks: "How the Draw Works", promoRulesHowDrawWorksDesc: "Users purchase digital book packages which include promotional bonus rewards such as XP, game tickets, and draw entries. Each qualifying purchase grants entry into the promotional giveaway draw.", promoRulesWinnerSelection: "Winner Selection", promoRulesWinnerSelectionDesc: "The winner is selected randomly from all eligible entries using a secure random number generator. Every entry has an equal chance of being selected. The selection process is fully automated and fair.", promoRulesDateConditions: "Draw Date & Conditions", promoRulesDateConditionsDesc: "The draw concludes when the qualifying batch is complete or when the campaign period ends, whichever comes first. All entries remain valid until the draw is completed. The draw may be extended if the qualifying threshold is not met.", promoRulesRewardsNote: "Rewards Are Promotional", promoRulesRewardsNoteDesc: "All rewards including XP, points, game tickets, tarot tickets, and draw entries are promotional bonuses provided as part of the digital book purchase. They have no cash value and cannot be exchanged for money.", promoRulesDisclaimer: "This promotion is a giveaway. Users purchase digital books and receive promotional bonuses such as XP, tickets, or draw entries. Purchasing does not guarantee winning.",
    termsPromotionRules: "Promotion Rules", termsPromotionRulesDesc: "This app features a promotional giveaway system. Users purchase digital books and receive promotional bonus rewards including XP, game tickets, tarot tickets, and draw entries. The draw is a promotional giveaway, not a lottery or gambling activity.", termsRewardExplanation: "Reward Explanation", termsRewardExplanationDesc: "XP (Experience Points): Track your progress and unlock VIP levels.\nPoints: In-app promotional currency for game participation.\nGame Tickets: Grant access to play promotional games.\nTarot Tickets: Grant access to AI tarot reading sessions.\nDraw Entries: Provide entry into the promotional gift card giveaway.\n\nAll rewards are promotional bonuses with no cash value.", termsRefundPolicy: "Refund Policy", termsRefundPolicyDesc: "All purchases are for digital books delivered instantly upon purchase. Refunds are handled through Google Play's refund policy. Promotional bonus rewards (XP, tickets, entries) are non-refundable and non-transferable. If a refund is issued for a book purchase, associated promotional rewards will be revoked.", termsDisclaimer: "Disclaimer", termsDisclaimerDesc: "All rewards, bonuses, and draw entries are promotional in nature and are provided as complimentary additions to digital book purchases. They have no monetary value and cannot be sold, traded, or exchanged for cash. This app does not involve gambling. The promotional giveaway draw is not a lottery.", termsLastUpdated: "Last updated: March 2026. Terms are subject to change."
  },
  ar: {
    home: "الرئيسية", shop: "المتجر", games: "الألعاب", chat: "الدردشة", crown: "التاج", cards: "البطاقات",
    giftCard: "بطاقة هدية $500", promotionalDraw: "سحب ترويجي", dailySpin: "الدوران اليومي",
    oneFreeAttempt: "لديك محاولة مجانية واحدة اليوم!", nextSpinIn: "دورانك المجاني القادم متاح خلال:",
    hours: "ساعات", minutes: "دقائق", seconds: "ثواني",
    xpPoints: "نقاط XP", gameTickets: "تذاكر اللعب", extraEntries: "فرص إضافية", surpriseRewards: "مفاجآت",
    allRewardsPromotional: "جميع المكافآت ترويجية", noCashValue: "لا قيمة نقدية",
    spinNow: "لف الآن", spinning: "جاري الدوران...", comeBackTomorrow: "عد غداً",
    youWon: "لقد ربحت!", maybeLater: "لاحقاً",
    extraChance: "فرصة إضافية", drawEntry: "دخول السحب", tryAgain: "حاول مجدداً",
    gameTicket: "تذكرة لعبة", surpriseReward: "مكافأة مفاجئة",
    selectBookExperience: "اختر تجربة كتابك", inOur: "في",
    bookPurchaseDraw: "سحب شراء الكتب", mostPopular: "الأكثر شعبية",
    vipXP: "نقاط VIP", tarotTicket: "تذكرة تاروت", entry: "دخول", value: "قيمة",
    purchasesProvideAccess: "المشتريات توفر وصولاً للكتب الرقمية.",
    bonusFeatures: "المزايا الإضافية هي مكافآت ترويجية مع المشتريات.",
    availableGames: "الألعاب المتاحة", snakeAndLadder: "الحية والسلم",
    classicBoardGame: "لعبة لوحية كلاسيكية • لاعب ضد لاعب أو بوت",
    tapFrenzy: "جنون النقر", tapAsFast: "انقر بأسرع ما يمكنك!",
    memoryMatch: "تطابق الذاكرة", matchHiddenCards: "طابق البطاقات المخفية",
    comingSoon: "قريباً", ticket: "تذكرة", gameRules: "قوانين اللعبة",
    entryTicket: "الدخول: تذكرة لعبة واحدة لكل لعبة", betWithPoints: "الرهان بالنقاط فقط (ليس XP)",
    winnerGets: "الفائز يحصل على +300 XP", loserGets: "الخاسر يحصل على +80 XP",
    noOpponentBot: "لا خصم خلال 60 ثانية؟ البوت ينضم تلقائياً",
    findOpponent: "ابحث عن خصم", noTickets: "لا تذاكر!", notEnoughPoints: "نقاط غير كافية",
    setYourBet: "حدد رهانك (نقاط)", yourPoints: "نقاطك",
    entryCost: "تكلفة الدخول", yourTickets: "تذاكرك",
    findingOpponent: "جاري البحث عن خصم...", botJoinsIn: "البوت ينضم خلال",
    searchingPlayers: "جاري البحث عن لاعبين...", yourTurn: "دورك", botsTurn: "دور البوت...",
    roll: "ارمِ", youWin: "لقد فزت! 🎉", botWins: "البوت فاز!",
    backToGames: "العودة للألعاب", rollTheDice: "ارمِ النرد!",
    typeMessage: "اكتب رسالة...", reachLevel: "اوصل",
    toUnlockRoom: "لفتح هذه الغرفة", yourCurrentLevel: "مستواك الحالي",
    room: "غرفة",
    eachDayJoin: "كل يوم تنضم يقربك", closerToFew: "إلى حيث لا يصل إلا القليل.",
    mysteryReward: "مكافأة غامضة", bronzeChest: "صندوق برونزي",
    silverChest: "صندوق فضي", goldChest: "صندوق ذهبي",
    level: "المستوى", elite: "النخبة", legend: "الأسطوري",
    aiTarotReading: "قراءة تاروت بالذكاء الاصطناعي", selectCardReveal: "اختر بطاقة لكشف مصيرك",
    ticketsRemaining: "تذاكر متبقية", readAgain: "اقرأ مجدداً",
    noTarotTickets: "لا تذاكر تاروت متاحة.",
    spinOrPurchase: "لف الدولاب أو اشترِ كتاباً لكسب التذاكر!",
    card: "بطاقة", language: "اللغة", selectLanguage: "اختر اللغة",
    drawProgress: "تقدم السحب", drawActive: "نشط", drawComplete: "مكتمل", towardsDraw: "نحو السحب",
    participants: "المشاركون", totalEntries: "إجمالي الإدخالات", prize: "الجائزة", howToEnter: "كيف تشارك",
    buyBook: "اشترِ أي باقة كتاب", autoEntered: "يتم إدخالك تلقائياً في السحب",
    moreBooks: "مشتريات أكثر = فرص أكبر للفوز", winnerSelected: "يتم اختيار الفائز تلقائياً عند 100%",
    recentEntries: "الإدخالات الأخيرة", pastWinners: "الفائزون السابقون", enterDraw: "ادخل السحب",
    drawWinner: "فائز السحب", wonPrize: "فاز بالجائزة", congratulations: "تهانينا",
    newDraw: "ابدأ سحباً جديداً", drawDescription: "اشترِ كتباً للدخول في سحب بطاقة هدية $500!", draw: "السحب",
    login: "تسجيل الدخول", signup: "إنشاء حساب", loginSubtitle: "مرحباً بعودتك إلى WINLINE", signupSubtitle: "أنشئ حسابك", displayName: "اسم العرض", email: "البريد الإلكتروني", password: "كلمة المرور", passwordMinLength: "كلمة المرور يجب أن تكون 6 أحرف على الأقل", welcomeBack: "مرحباً بعودتك!", accountCreated: "تم إنشاء الحساب بنجاح!", logout: "تسجيل الخروج",
    scratchCard: "بطاقة الحك", scratchCardDesc: "احك لتكشف جائزتك!", scratchToReveal: "احك البطاقة لكشف مكافأتك", scratchArea: "احك هنا!", youRevealed: "كشفت", claimReward: "اطلب المكافأة", tryAnotherCard: "جرب بطاقة أخرى", noReward: "حظ أوفر المرة القادمة!", scratchCardCost: "تذكرة لعبة واحدة",
    profile: "الملف الشخصي", loginToViewProfile: "سجّل دخولك لعرض ملفك الشخصي", inventory: "المخزون", settings: "الإعدادات", clearData: "مسح البيانات", photoUpdated: "تم تحديث الصورة!", nameUpdated: "تم تحديث الاسم!", dataCleared: "تم مسح البيانات!",
    drawExtended: "تم تمديد السحب", drawExtendedMessage: "تم تمديد السحب بسبب الإقبال الكبير. جميع الإدخالات تبقى فعّالة.", nextDrawIn: "السحب القادم خلال", fairDrawSystem: "نظام سحب عادل", fairDrawDescription: "يتم اختيار الفائز عشوائياً من جميع الإدخالات باستخدام مولّد عشوائي آمن. كل إدخال لديه فرصة متساوية للفوز.", winnerAnnounced: "تم إعلان الفائز!", won: "فاز بـ", enterTheDraw: "ادخل سحب الـ $500", giftCardDraw: "سحب بطاقة هدية $500", drawCloseInfo: "سيُغلق السحب عند وصول التقدم إلى 100% أو عند انتهاء العداد التنازلي.", getUniqueEntry: "احصل على رقم دخول فريد #ID", premiumTwoEntries: "الباقة المميزة = دخولان!", randomPicksWinner: "رقم عشوائي يختار الفائز!", yourEntries: "إدخالاتك",
    drawMainTitle: "اشترِ كتابًا وادخل السحب للفوز ببطاقة هدية بقيمة $500", drawSubtitle: "كل عملية شراء مؤهلة تمنحك فرصة دخول إلى السحب. الباقة المميزة تمنحك فرصتي دخول.", drawClosingCondition: "يُختتم السحب عند اكتمال الدفعة المؤهلة أو عند انتهاء مدة الحملة، أيهما أولًا.", buyAndEnter: "اشترِ وادخل السحب", howItWorks: "كيف تعمل", howStep1: "اشترِ أي باقة كتب", howStep2: "تحصل على فرصة دخول", howStep3: "الباقة المميزة = فرصتان", howStep4: "يتم اختيار الفائز عشوائيًا عند إغلاق السحب", moreInfo: "مزيد من المعلومات", moreInfo1: "السحب ترويجي", moreInfo2: "الإدخالات تُمنح حسب الباقة المشتراة", moreInfo3: "يتم اختيار الفائز وفق نظام سحب عادل", moreInfo4: "تخضع الحملة للشروط والأحكام", yourCurrentEntries: "قسائمك الحالية",
    duelRPS: "✊✋✌️ تحدي حجر ورقة مقص", duelSearching: "🔍 البحث عن لاعب...", duelSendingInvites: "جاري إرسال دعوات للاعبين المتاحين", duelFoundOpponent: "⚡ تم العثور على خصم! استعد... ⚡", duelChooseWinner: "🎯 اختر من الرابح!", duelVoteBefore: "صوّت قبل ما يبدأ التحدي", duelYourVote: "✓ صوتك", duelLiveVote: "📊 نسبة التصويت الحي", duelRound: "الجولة", duelChooseMove: "اختر حركتك!", duelVs: "ضد", duelRockPaperScissors: "⚡ حجر... ورقة... مقص!", duelDraw: "🤝 تعادل! إعادة الجولة...", duelWonRound: "فاز بالجولة!", duelIsWinner: "هو الفائز!", duelScore: "النتيجة", duelVoteCorrect: "🎉 صوتك صحيح!", duelVoteWrong: "😔 صوتك خاطئ", duelDidntVote: "لم تصوّت", duelDone: "تم ✓", duelRock: "حجر", duelPaper: "ورقة", duelScissors: "مقص",
    worldChallengeTitle: "⚔️ تحدي أمام العالم", worldChallengeDesc: "اشترِ الكتاب الرقمي لتحصل على محاولة واحدة وتفتح تحدي حصري في غرفة العالم!", worldChallengePurchased: "🎉 تم الشراء بنجاح!", worldChallengeUnlockedMsg: "انفتح لك تحدي واحد الآن في غرفة العالم!", worldBookExclusive: "كتاب رقمي حصري", worldOneChallenge: "تحدي واحد فقط في غرفة العالم لكل عملية شراء", worldNameShown: "اسمك يبين قدام الكل كبطل التحدي", worldGameTicket: "🎮 بطاقة لعبة واحدة", worldDrawEntry: "🎟️ قسيمة دخول سحب واحدة", worldPerBook: "/ كتاب رقمي", worldBuyBook: "📖 اشترِ الكتاب وافتح التحدي", worldAfterChallenge: "* بعد انتهاء التحدي، ينقفل فوراً وتحتاج شراء جديد للعب مرة ثانية", worldLockMsg: "🔒 اشترِ الكتاب لفتح التحدي أمام العالم",
    systemChampion: "البطل", systemNewLegend: "أسطورة الغرفة الجديدة! من يجرؤ على تحديه؟", systemWhoChallenge: "فاز بالتحدي ضد", welcomeMsg: "أهلاً", welcomeLitRoom: "نورت الغرفة",
    winlineDailySpin: "دولاب وينلاين اليومي", winGiftCard: "اربح بطاقة هدية $500", spinTheWheelBtn: "🎰 لف الدولاب", comeBackSpin: "عد غداً لدورتك القادمة", dailySpinReward: "مكافأة الدوران اليومي", nextFreeSpin: "الدوران المجاني القادم", freeSpinAvailable: "لديك دوران مجاني واحد!", betterLuckNextTime: "حظ أوفر المرة القادمة!", wonAmazingReward: "فزت بمكافأة رائعة!", addedToAccount: "أُضيفت لحسابك", tryAgainTomorrow: "حاول مجدداً غداً", awesomeBtn: "رائع! 🎉", comeBackTomorrowChance: "عد غداً لفرصة ثانية!", shopHeroTitle: "اشترِ كتاباً رقمياً وادخل\nسحب بطاقة هدية $500", shopHeroSubtitle: "كل شراء يمنحك مكافآت ألعاب وفرصة للفوز ببطاقة هدية $500.", chooseBookPack: "اختر باقة كتابك", basicPack: "الباقة الأساسية", plusPack: "باقة بلس", premiumPack: "الباقة المميزة", bestValueTag: "أفضل قيمة", includesLabel: "يشمل:", digitalBook: "كتاب رقمي", buyForPrice: "اشترِ بـ", shopDisclaimer2: "مكافآت الألعاب وقسائم السحب هي مكافآت ترويجية.", purchasedToast: "تم الشراء!", chooseGiftCardPrize: "اختر جائزة بطاقة الهدية", winBadge: "اربح $500", confirmPurchaseTitle: "تأكيد الشراء", youWillReceive: "ستحصل على:", confirmPurchaseBtn: "تأكيد الشراء", male: "ذكر", female: "أنثى", playerYou: "أنت", botPlayer: "بوت 🤖", needsExactRoll: "يحتاج رمية مضبوطة!", revealRewardNow: "اكشف المكافأة الآن", scratchWinTypes: "نقاط، XP، تذاكر", madamZaraTitle: "مدام زارا — التاروت", mysteryReaderLabel: "قارئة الأسرار", startTarotBtn: "ابدأ جلسة التاروت", noTicketsTarot: "لا تذاكر. أدر العجلة أو اشترِ من المتجر", selectCardsHeart: "اختر بطاقات من القلب", tapAnyCard: "انقر على أي بطاقة لاختيارها", revealReadTarot: "اكشف البطاقات واقرأ التاروت", askMadamZara: "اسأل مدام زارا...", liveLabel: "مباشر", bonusEntriesLabel: "فرص إضافية",
    seg_xp50: "50\nXP", seg_tryAgain: "حاول\nمجدداً", seg_surprise: "هدية\nمفاجئة", seg_gameTicket: "تذكرة\nلعبة", seg_pointsXp: "15 نقطة\n+50 XP", seg_xp100: "100\nXP", seg_tarotTicket: "تذكرة\nتاروت", seg_ticketCombo: "لعبة &\nتاروت",
    reward_xp50: "50 XP", reward_xp100: "100 XP", reward_gameTicket: "تذكرة لعبة", reward_tarotTicket: "تذكرة تاروت", reward_ticketCombo: "تذكرة لعبة & تاروت", reward_pointsXp: "15 نقطة + 50 XP", reward_surprise: "هدية مفاجئة", reward_tryAgain: "حاول مجدداً",
    welcomeTitle: "أهلاً بك في وينلاين! ✨", welcomeMessage: "أنا مدام زارا، مرشدتك السحرية. أدر العجلة، العب ألعاب، واربح جوائز مذهلة. لنبدأ السحر!", welcomeButton: "يلا نبدأ! 🎉",
    xpRainTitle: "مطر XP", xpRainCollected: "جمعت", xpRainOver: "انتهى مطر XP!", xpRainYouGot: "جمعت", xpRainAddedToAccount: "أُضيف لـ XP تبعك!", xpRainStarting: "⚡ مطر XP رح يبدأ بعد 3 ثواني! استعد للضغط! ⚡", xpRainAnnounce: "جمع",
    promotionRules: "قواعد العرض الترويجي", termsAndConditions: "الشروط والأحكام", promotionalGiveaway: "هدية ترويجية", drawGiveawayNote: "هذا عرض ترويجي. الشراء لا يضمن الفوز.", shopPackDisclaimer: "المشتريات توفر وصولاً للكتب الرقمية. نقاط XP والتذاكر وقسائم السحب هي مكافآت ترويجية إضافية.",
    promoRulesHowDrawWorks: "كيف يعمل السحب", promoRulesHowDrawWorksDesc: "يشتري المستخدمون حزم كتب رقمية تتضمن مكافآت ترويجية مثل XP وتذاكر ألعاب وقسائم سحب. كل عملية شراء مؤهلة تمنح دخولاً في سحب الهدية الترويجية.", promoRulesWinnerSelection: "اختيار الفائز", promoRulesWinnerSelectionDesc: "يتم اختيار الفائز عشوائياً من جميع القسائم المؤهلة باستخدام مولّد أرقام عشوائي آمن. كل قسيمة لها فرصة متساوية.", promoRulesDateConditions: "تاريخ وشروط السحب", promoRulesDateConditionsDesc: "يُختتم السحب عند اكتمال الدفعة المؤهلة أو عند انتهاء فترة الحملة. جميع القسائم تبقى صالحة حتى اكتمال السحب.", promoRulesRewardsNote: "المكافآت ترويجية", promoRulesRewardsNoteDesc: "جميع المكافآت بما فيها XP والنقاط وتذاكر الألعاب وتذاكر التاروت وقسائم السحب هي مكافآت ترويجية. ليس لها قيمة نقدية.", promoRulesDisclaimer: "هذا العرض هو هدية ترويجية. يشتري المستخدمون كتباً رقمية ويحصلون على مكافآت ترويجية. الشراء لا يضمن الفوز.",
    termsPromotionRules: "قواعد العرض", termsPromotionRulesDesc: "يتضمن هذا التطبيق نظام هدايا ترويجية. يشتري المستخدمون كتباً رقمية ويحصلون على مكافآت ترويجية. السحب هو هدية ترويجية وليس يانصيب أو قمار.", termsRewardExplanation: "شرح المكافآت", termsRewardExplanationDesc: "XP: تتبع تقدمك وافتح مستويات VIP.\nالنقاط: عملة ترويجية داخل التطبيق.\nتذاكر الألعاب: توفر الوصول للألعاب الترويجية.\nتذاكر التاروت: توفر الوصول لجلسات قراءة التاروت.\nقسائم السحب: توفر الدخول في سحب بطاقة الهدية.\n\nجميع المكافآت ترويجية وليس لها قيمة نقدية.", termsRefundPolicy: "سياسة الاسترداد", termsRefundPolicyDesc: "جميع المشتريات هي كتب رقمية تُسلّم فوراً. يتم التعامل مع المبالغ المستردة عبر سياسة Google Play. المكافآت الترويجية غير قابلة للاسترداد.", termsDisclaimer: "إخلاء المسؤولية", termsDisclaimerDesc: "جميع المكافآت والمكافآت الإضافية وقسائم السحب ترويجية بطبيعتها. ليس لها قيمة نقدية. هذا التطبيق لا يتضمن قماراً. السحب الترويجي ليس يانصيب.", termsLastUpdated: "آخر تحديث: مارس 2026. الشروط قابلة للتغيير."
  },
  fr: {
    home: "Accueil", shop: "Boutique", games: "Jeux", chat: "Discussion", crown: "Couronne", cards: "Cartes",
    giftCard: "Carte cadeau $500", promotionalDraw: "TIRAGE PROMOTIONNEL", dailySpin: "ROTATION QUOTIDIENNE",
    oneFreeAttempt: "Vous avez UN ESSAI GRATUIT aujourd'hui !", nextSpinIn: "Votre prochain tour gratuit dans :",
    hours: "HEURES", minutes: "MINUTES", seconds: "SECONDES",
    xpPoints: "Points XP", gameTickets: "Tickets de jeu", extraEntries: "Entrées bonus", surpriseRewards: "Surprises",
    allRewardsPromotional: "Toutes les récompenses sont promotionnelles", noCashValue: "Pas de valeur monétaire",
    spinNow: "TOURNER", spinning: "EN COURS...", comeBackTomorrow: "REVENEZ DEMAIN",
    youWon: "Vous avez gagné !", maybeLater: "PLUS TARD",
    extraChance: "Chance supplémentaire", drawEntry: "Entrée au tirage", tryAgain: "Réessayer",
    gameTicket: "Ticket de jeu", surpriseReward: "Récompense surprise",
    selectBookExperience: "Choisissez votre expérience livre", inOur: "dans notre",
    bookPurchaseDraw: "Tirage d'achat de livres", mostPopular: "PLUS POPULAIRE",
    vipXP: "XP VIP", tarotTicket: "Ticket Tarot", entry: "ENTRÉE", value: "VALEUR",
    purchasesProvideAccess: "Les achats donnent accès aux livres numériques.",
    bonusFeatures: "Les bonus sont des récompenses promotionnelles incluses.",
    availableGames: "Jeux disponibles", snakeAndLadder: "Serpent et Échelle",
    classicBoardGame: "Jeu de plateau classique • JcJ ou vs Bot",
    tapFrenzy: "Tap Frenzy", tapAsFast: "Tapez le plus vite possible !",
    memoryMatch: "Memory Match", matchHiddenCards: "Trouvez les paires",
    comingSoon: "Bientôt", ticket: "Ticket", gameRules: "Règles du jeu",
    entryTicket: "Entrée : 1 ticket par partie", betWithPoints: "Pariez avec des Points uniquement",
    winnerGets: "Le gagnant reçoit +300 XP", loserGets: "Le perdant reçoit +80 XP",
    noOpponentBot: "Pas d'adversaire en 60s ? Le bot rejoint",
    findOpponent: "TROUVER UN ADVERSAIRE", noTickets: "Pas de tickets !", notEnoughPoints: "Pas assez de points",
    setYourBet: "Définir votre mise (Points)", yourPoints: "Vos Points",
    entryCost: "Coût d'entrée", yourTickets: "Vos Tickets",
    findingOpponent: "Recherche d'adversaire...", botJoinsIn: "Le bot rejoint dans",
    searchingPlayers: "Recherche de joueurs...", yourTurn: "Votre tour", botsTurn: "Tour du bot...",
    roll: "LANCER", youWin: "VOUS GAGNEZ ! 🎉", botWins: "Le bot gagne !",
    backToGames: "RETOUR AUX JEUX", rollTheDice: "Lancez le dé !",
    typeMessage: "Écrire un message...", reachLevel: "Atteignez",
    toUnlockRoom: "pour débloquer cette salle", yourCurrentLevel: "Votre niveau actuel",
    room: "Salle",
    eachDayJoin: "Chaque jour vous rapproche", closerToFew: "de là où peu arrivent.",
    mysteryReward: "RÉCOMPENSE MYSTÈRE", bronzeChest: "Coffre Bronze",
    silverChest: "Coffre Argent", goldChest: "Coffre Or",
    level: "Niveau", elite: "Élite", legend: "Légende",
    aiTarotReading: "Lecture Tarot IA", selectCardReveal: "Choisissez une carte pour révéler votre destin",
    ticketsRemaining: "tickets restants", readAgain: "Relire",
    noTarotTickets: "Aucun ticket tarot disponible.",
    spinOrPurchase: "Tournez la roue ou achetez un livre !",
    card: "Carte", language: "Langue", selectLanguage: "Choisir la langue",
    drawProgress: "Progression", drawActive: "Actif", drawComplete: "Terminé", towardsDraw: "vers le tirage",
    participants: "Participants", totalEntries: "Entrées totales", prize: "Prix", howToEnter: "Comment participer",
    buyBook: "Achetez un livre", autoEntered: "Vous êtes automatiquement inscrit",
    moreBooks: "Plus d'achats = plus de chances", winnerSelected: "Gagnant sélectionné à 100%",
    recentEntries: "Entrées récentes", pastWinners: "Anciens gagnants", enterDraw: "PARTICIPER",
    drawWinner: "Gagnant", wonPrize: "A gagné le prix", congratulations: "Félicitations",
    newDraw: "NOUVEAU TIRAGE", drawDescription: "Achetez des livres pour le tirage de $500!", draw: "Tirage",
    login: "Connexion", signup: "Inscription", loginSubtitle: "Bienvenue sur WINLINE", signupSubtitle: "Créez votre compte", displayName: "Nom d'affichage", email: "Email", password: "Mot de passe", passwordMinLength: "Le mot de passe doit contenir au moins 6 caractères", welcomeBack: "Bon retour !", accountCreated: "Compte créé avec succès !", logout: "Déconnexion",
    scratchCard: "Carte à gratter", scratchCardDesc: "Grattez pour révéler votre prix !", scratchToReveal: "Grattez la carte", scratchArea: "Grattez ici !", youRevealed: "Vous avez révélé", claimReward: "RÉCLAMER", tryAnotherCard: "AUTRE CARTE", noReward: "Plus de chance la prochaine fois !", scratchCardCost: "1 Ticket de jeu",
    profile: "Profil", loginToViewProfile: "Connectez-vous pour voir votre profil", inventory: "Inventaire", settings: "Paramètres", clearData: "Effacer les données", photoUpdated: "Photo mise à jour !", nameUpdated: "Nom mis à jour !", dataCleared: "Données effacées !",
    drawExtended: "Tirage prolongé", drawExtendedMessage: "Le tirage a été prolongé en raison de la forte demande. Toutes les participations restent actives.", nextDrawIn: "Prochain tirage dans", fairDrawSystem: "Système de tirage équitable", fairDrawDescription: "Le gagnant est sélectionné aléatoirement parmi toutes les participations. Chaque participation a une chance égale de gagner.", winnerAnnounced: "Gagnant annoncé !", won: "A gagné", enterTheDraw: "Participer au tirage $500", giftCardDraw: "Tirage carte cadeau $500", drawCloseInfo: "Le tirage se terminera lorsque la progression atteindra 100% ou à la fin du compte à rebours.", getUniqueEntry: "Obtenez un numéro d'entrée unique #ID", premiumTwoEntries: "Pack Premium = 2 Participations !", randomPicksWinner: "Un numéro aléatoire désigne le gagnant !", yourEntries: "Vos participations",
    drawMainTitle: "Achetez un livre et participez au tirage pour gagner une carte cadeau de $500", drawSubtitle: "Chaque achat éligible vous donne une chance de participer au tirage. Le Pack Premium vous donne 2 participations.", drawClosingCondition: "Le tirage se termine lorsque le lot éligible est complet ou à la fin de la période de campagne.", buyAndEnter: "Achetez et participez", howItWorks: "Comment ça marche", howStep1: "Achetez n'importe quel pack de livres", howStep2: "Vous obtenez une chance de participation", howStep3: "Premium = 2 participations", howStep4: "Le gagnant est sélectionné aléatoirement à la clôture du tirage", moreInfo: "Plus d'informations", moreInfo1: "Le tirage est promotionnel", moreInfo2: "Les participations sont accordées selon le pack acheté", moreInfo3: "Le gagnant est sélectionné via un système de tirage équitable", moreInfo4: "La campagne est soumise aux conditions générales", yourCurrentEntries: "Vos participations actuelles",
    duelRPS: "✊✋✌️ Défi Pierre Feuille Ciseaux", duelSearching: "🔍 Recherche d'un joueur...", duelSendingInvites: "Envoi d'invitations aux joueurs disponibles", duelFoundOpponent: "⚡ Adversaire trouvé ! Préparez-vous... ⚡", duelChooseWinner: "🎯 Choisissez le gagnant !", duelVoteBefore: "Votez avant le début du défi", duelYourVote: "✓ Votre vote", duelLiveVote: "📊 Pourcentage de vote en direct", duelRound: "Manche", duelChooseMove: "Choisissez votre coup !", duelVs: "contre", duelRockPaperScissors: "⚡ Pierre... Feuille... Ciseaux !", duelDraw: "🤝 Égalité ! Nouvelle manche...", duelWonRound: "a gagné la manche !", duelIsWinner: "est le gagnant !", duelScore: "Score", duelVoteCorrect: "🎉 Votre vote était correct !", duelVoteWrong: "😔 Votre vote était incorrect", duelDidntVote: "Vous n'avez pas voté", duelDone: "Terminé ✓", duelRock: "Pierre", duelPaper: "Feuille", duelScissors: "Ciseaux",
    worldChallengeTitle: "⚔️ Défi Mondial", worldChallengeDesc: "Achetez le livre numérique pour obtenir une tentative et débloquer un défi exclusif dans la salle Monde !", worldChallengePurchased: "🎉 Achat réussi !", worldChallengeUnlockedMsg: "Un défi est maintenant débloqué dans la salle Monde !", worldBookExclusive: "Livre numérique exclusif", worldOneChallenge: "Un seul défi par achat dans la salle Monde", worldNameShown: "Votre nom apparaît comme champion du défi", worldGameTicket: "🎮 Un ticket de jeu", worldDrawEntry: "🎟️ Une participation au tirage", worldPerBook: "/ livre numérique", worldBuyBook: "📖 Achetez le livre et débloquez le défi", worldAfterChallenge: "* Après le défi, il se verrouille immédiatement et nécessite un nouvel achat", worldLockMsg: "🔒 Achetez le livre pour débloquer le défi Mondial",
    systemChampion: "Champion", systemNewLegend: "Nouvelle légende de la salle ! Qui ose le défier ?", systemWhoChallenge: "a gagné le défi contre", welcomeMsg: "Bonjour", welcomeLitRoom: "Vous illuminez la salle",
    winlineDailySpin: "ROTATION QUOTIDIENNE WINLINE", winGiftCard: "Gagnez une carte cadeau de $500", spinTheWheelBtn: "🎰 TOURNER LA ROUE", comeBackSpin: "Revenez demain pour votre prochain tour", dailySpinReward: "RÉCOMPENSE DU JOUR", nextFreeSpin: "PROCHAIN TOUR GRATUIT", freeSpinAvailable: "Vous avez un tour gratuit !", betterLuckNextTime: "Plus de chance la prochaine fois !", wonAmazingReward: "Vous venez de gagner une super récompense !", addedToAccount: "Ajouté à votre compte", tryAgainTomorrow: "Réessayez demain", awesomeBtn: "Génial ! 🎉", comeBackTomorrowChance: "Revenez demain pour une autre chance !", shopHeroTitle: "Achetez un livre numérique et\nparticipez au tirage de $500", shopHeroSubtitle: "Chaque achat vous donne des récompenses et une chance de gagner $500.", chooseBookPack: "Choisissez votre pack", basicPack: "Pack Basique", plusPack: "Pack Plus", premiumPack: "Pack Premium", bestValueTag: "Meilleure valeur", includesLabel: "Inclut :", digitalBook: "Livre numérique", buyForPrice: "Acheter pour", shopDisclaimer2: "Les récompenses et entrées au tirage sont des bonus promotionnels.", purchasedToast: "acheté !", chooseGiftCardPrize: "Choisissez votre carte cadeau", winBadge: "GAGNER $500", confirmPurchaseTitle: "Confirmer l'achat", youWillReceive: "Vous recevrez :", confirmPurchaseBtn: "Confirmer l'achat", male: "Homme", female: "Femme", playerYou: "Vous", botPlayer: "Bot 🤖", needsExactRoll: "lancer exact requis !", revealRewardNow: "Révéler maintenant", scratchWinTypes: "Points, XP, Tickets", madamZaraTitle: "Madam Zara — Tarot", mysteryReaderLabel: "Lectrice mystère", startTarotBtn: "Commencer la session Tarot", noTicketsTarot: "Pas de tickets. Tournez la roue ou achetez en boutique", selectCardsHeart: "Sélectionnez des cartes avec votre cœur", tapAnyCard: "Appuyez sur une carte pour la sélectionner", revealReadTarot: "Révéler et lire le Tarot", askMadamZara: "Demandez à Madam Zara...", liveLabel: "En direct", bonusEntriesLabel: "Entrées bonus",
    seg_xp50: "50\nXP", seg_tryAgain: "Réessayer", seg_surprise: "Cadeau\nSurprise", seg_gameTicket: "Ticket\nJeu", seg_pointsXp: "15 Pts\n+50 XP", seg_xp100: "100\nXP", seg_tarotTicket: "Ticket\nTarot", seg_ticketCombo: "Jeu &\nTarot",
    reward_xp50: "50 XP", reward_xp100: "100 XP", reward_gameTicket: "Ticket de jeu", reward_tarotTicket: "Ticket Tarot", reward_ticketCombo: "Ticket Jeu & Tarot", reward_pointsXp: "15 Points + 50 XP", reward_surprise: "Cadeau Surprise", reward_tryAgain: "Réessayer",
    welcomeTitle: "Bienvenue sur Winline ! ✨", welcomeMessage: "Je suis Madam Zara, votre guide mystique. Tournez la roue, jouez et gagnez des prix incroyables. Que la magie commence !", welcomeButton: "C'est parti ! 🎉",
    xpRainTitle: "PLUIE D'XP", xpRainCollected: "Collecté", xpRainOver: "Pluie d'XP terminée !", xpRainYouGot: "Vous avez collecté", xpRainAddedToAccount: "Ajouté à vos XP !", xpRainStarting: "⚡ Pluie d'XP dans 3 secondes ! Préparez-vous ! ⚡", xpRainAnnounce: "a collecté"
  },
  es: {
    home: "Inicio", shop: "Tienda", games: "Juegos", chat: "Chat", crown: "Corona", cards: "Cartas",
    giftCard: "Tarjeta regalo $500", promotionalDraw: "SORTEO PROMOCIONAL", dailySpin: "GIRO DIARIO",
    oneFreeAttempt: "¡Tienes UN INTENTO GRATIS hoy!", nextSpinIn: "Tu próximo giro gratis estará disponible en:",
    hours: "HORAS", minutes: "MINUTOS", seconds: "SEGUNDOS",
    xpPoints: "Puntos XP", gameTickets: "Boletos de juego", extraEntries: "Entradas extra", surpriseRewards: "Sorpresas",
    allRewardsPromotional: "Todas las recompensas son promocionales", noCashValue: "Sin valor monetario",
    spinNow: "¡GIRAR!", spinning: "GIRANDO...", comeBackTomorrow: "VUELVE MAÑANA",
    youWon: "¡Ganaste!", maybeLater: "QUIZÁS DESPUÉS",
    extraChance: "Oportunidad extra", drawEntry: "Entrada al sorteo", tryAgain: "Intentar de nuevo",
    gameTicket: "Boleto de juego", surpriseReward: "Recompensa sorpresa",
    selectBookExperience: "Elige tu experiencia de libro", inOur: "en nuestro",
    bookPurchaseDraw: "Sorteo de compra de libros", mostPopular: "MÁS POPULAR",
    vipXP: "XP VIP", tarotTicket: "Boleto Tarot", entry: "ENTRADA", value: "VALOR",
    purchasesProvideAccess: "Las compras dan acceso a libros digitales.",
    bonusFeatures: "Los bonos son recompensas promocionales incluidas.",
    availableGames: "Juegos disponibles", snakeAndLadder: "Serpientes y Escaleras",
    classicBoardGame: "Juego de mesa clásico • JcJ o vs Bot",
    tapFrenzy: "Tap Frenzy", tapAsFast: "¡Toca lo más rápido posible!",
    memoryMatch: "Memory Match", matchHiddenCards: "Encuentra los pares",
    comingSoon: "Próximamente", ticket: "Boleto", gameRules: "Reglas del juego",
    entryTicket: "Entrada: 1 boleto por partida", betWithPoints: "Apuesta solo con Puntos",
    winnerGets: "Ganador recibe +300 XP", loserGets: "Perdedor recibe +80 XP",
    noOpponentBot: "¿Sin oponente en 60s? El bot se une",
    findOpponent: "BUSCAR OPONENTE", noTickets: "¡Sin boletos!", notEnoughPoints: "Puntos insuficientes",
    setYourBet: "Define tu apuesta (Puntos)", yourPoints: "Tus Puntos",
    entryCost: "Costo de entrada", yourTickets: "Tus Boletos",
    findingOpponent: "Buscando oponente...", botJoinsIn: "El bot se une en",
    searchingPlayers: "Buscando jugadores...", yourTurn: "Tu turno", botsTurn: "Turno del bot...",
    roll: "LANZAR", youWin: "¡GANASTE! 🎉", botWins: "¡El bot gana!",
    backToGames: "VOLVER A JUEGOS", rollTheDice: "¡Lanza el dado!",
    typeMessage: "Escribe un mensaje...", reachLevel: "Alcanza",
    toUnlockRoom: "para desbloquear esta sala", yourCurrentLevel: "Tu nivel actual",
    room: "Sala",
    eachDayJoin: "Cada día que te unes te acerca", closerToFew: "a donde pocos llegan.",
    mysteryReward: "RECOMPENSA MISTERIOSA", bronzeChest: "Cofre Bronce",
    silverChest: "Cofre Plata", goldChest: "Cofre Oro",
    level: "Nivel", elite: "Élite", legend: "Leyenda",
    aiTarotReading: "Lectura Tarot IA", selectCardReveal: "Elige una carta para revelar tu destino",
    ticketsRemaining: "boletos restantes", readAgain: "Leer de nuevo",
    noTarotTickets: "Sin boletos de tarot.",
    spinOrPurchase: "¡Gira la rueda o compra un libro!",
    card: "Carta", language: "Idioma", selectLanguage: "Seleccionar idioma",
    drawProgress: "Progreso", drawActive: "Activo", drawComplete: "Completo", towardsDraw: "hacia el sorteo",
    participants: "Participantes", totalEntries: "Entradas totales", prize: "Premio", howToEnter: "Cómo participar",
    buyBook: "Compra cualquier libro", autoEntered: "Entras automáticamente",
    moreBooks: "Más compras = más oportunidades", winnerSelected: "Ganador seleccionado al 100%",
    recentEntries: "Entradas recientes", pastWinners: "Ganadores anteriores", enterDraw: "PARTICIPAR",
    drawWinner: "Ganador", wonPrize: "Ganó el premio", congratulations: "Felicidades",
    newDraw: "NUEVO SORTEO", drawDescription: "¡Compra libros para el sorteo de $500!", draw: "Sorteo",
    login: "Iniciar sesión", signup: "Registrarse", loginSubtitle: "Bienvenido a WINLINE", signupSubtitle: "Crea tu cuenta", displayName: "Nombre", email: "Correo", password: "Contraseña", passwordMinLength: "La contraseña debe tener al menos 6 caracteres", welcomeBack: "¡Bienvenido de vuelta!", accountCreated: "¡Cuenta creada!", logout: "Cerrar sesión",
    scratchCard: "Rasca y Gana", scratchCardDesc: "¡Rasca para revelar tu premio!", scratchToReveal: "Rasca la tarjeta", scratchArea: "¡Rasca aquí!", youRevealed: "Revelaste", claimReward: "RECLAMAR", tryAnotherCard: "OTRA TARJETA", noReward: "¡Mejor suerte la próxima!", scratchCardCost: "1 Boleto de juego",
    profile: "Perfil", loginToViewProfile: "Inicia sesión para ver tu perfil", inventory: "Inventario", settings: "Ajustes", clearData: "Borrar datos", photoUpdated: "¡Foto actualizada!", nameUpdated: "¡Nombre actualizado!", dataCleared: "¡Datos borrados!",
    drawExtended: "Sorteo extendido", drawExtendedMessage: "El sorteo ha sido extendido debido a la alta demanda. Todas las participaciones siguen activas.", nextDrawIn: "Próximo sorteo en", fairDrawSystem: "Sistema de sorteo justo", fairDrawDescription: "El ganador se selecciona aleatoriamente entre todas las participaciones. Cada participación tiene la misma probabilidad de ganar.", winnerAnnounced: "¡Ganador anunciado!", won: "Ganó", enterTheDraw: "Participar en el sorteo de $500", giftCardDraw: "Sorteo tarjeta regalo $500", drawCloseInfo: "El sorteo se cerrará cuando el progreso llegue al 100% o cuando termine la cuenta regresiva.", getUniqueEntry: "Obtén un número de entrada único #ID", premiumTwoEntries: "¡Pack Premium = 2 Entradas!", randomPicksWinner: "¡Un número aleatorio elige al ganador!", yourEntries: "Tus participaciones",
    drawMainTitle: "Compra un libro y participa en el sorteo para ganar una tarjeta regalo de $500", drawSubtitle: "Cada compra elegible te da una oportunidad de participar en el sorteo. El Pack Premium te da 2 entradas.", drawClosingCondition: "El sorteo concluye cuando el lote elegible se completa o cuando el período de campaña finaliza.", buyAndEnter: "Compra y participa", howItWorks: "Cómo funciona", howStep1: "Compra cualquier paquete de libros", howStep2: "Obtienes una oportunidad de entrada", howStep3: "Premium = 2 entradas", howStep4: "El ganador se selecciona aleatoriamente al cerrar el sorteo", moreInfo: "Más información", moreInfo1: "El sorteo es promocional", moreInfo2: "Las entradas se otorgan según el paquete comprado", moreInfo3: "El ganador se selecciona mediante un sistema de sorteo justo", moreInfo4: "La campaña está sujeta a términos y condiciones", yourCurrentEntries: "Tus entradas actuales",
    duelRPS: "✊✋✌️ Desafío Piedra Papel Tijera", duelSearching: "🔍 Buscando jugador...", duelSendingInvites: "Enviando invitaciones a jugadores disponibles", duelFoundOpponent: "⚡ ¡Oponente encontrado! Prepárate... ⚡", duelChooseWinner: "🎯 ¡Elige al ganador!", duelVoteBefore: "Vota antes de que empiece el desafío", duelYourVote: "✓ Tu voto", duelLiveVote: "📊 Porcentaje de voto en vivo", duelRound: "Ronda", duelChooseMove: "¡Elige tu movimiento!", duelVs: "contra", duelRockPaperScissors: "⚡ ¡Piedra... Papel... Tijera!", duelDraw: "🤝 ¡Empate! Repitiendo ronda...", duelWonRound: "¡ganó la ronda!", duelIsWinner: "¡es el ganador!", duelScore: "Puntuación", duelVoteCorrect: "🎉 ¡Tu voto fue correcto!", duelVoteWrong: "😔 Tu voto fue incorrecto", duelDidntVote: "No votaste", duelDone: "Hecho ✓", duelRock: "Piedra", duelPaper: "Papel", duelScissors: "Tijera",
    worldChallengeTitle: "⚔️ Desafío Mundial", worldChallengeDesc: "¡Compra el libro digital para obtener un intento y desbloquear un desafío exclusivo en la sala Mundo!", worldChallengePurchased: "🎉 ¡Compra exitosa!", worldChallengeUnlockedMsg: "¡Un desafío está desbloqueado en la sala Mundo!", worldBookExclusive: "Libro digital exclusivo", worldOneChallenge: "Un solo desafío por compra en la sala Mundo", worldNameShown: "Tu nombre aparece como campeón del desafío", worldGameTicket: "🎮 Un boleto de juego", worldDrawEntry: "🎟️ Una entrada al sorteo", worldPerBook: "/ libro digital", worldBuyBook: "📖 Compra el libro y desbloquea el desafío", worldAfterChallenge: "* Después del desafío, se bloquea inmediatamente y requiere una nueva compra", worldLockMsg: "🔒 Compra el libro para desbloquear el desafío Mundial",
    systemChampion: "Campeón", systemNewLegend: "¡Nueva leyenda de la sala! ¿Quién se atreve a desafiarlo?", systemWhoChallenge: "ganó el desafío contra", welcomeMsg: "¡Hola", welcomeLitRoom: "Iluminaste la sala",
    winlineDailySpin: "GIRO DIARIO WINLINE", winGiftCard: "Gana una tarjeta regalo de $500", spinTheWheelBtn: "🎰 GIRAR LA RUEDA", comeBackSpin: "Vuelve mañana para tu próximo giro", dailySpinReward: "RECOMPENSA DIARIA", nextFreeSpin: "PRÓXIMO GIRO GRATIS", freeSpinAvailable: "¡Tienes un giro gratis!", betterLuckNextTime: "¡Mejor suerte la próxima!", wonAmazingReward: "¡Ganaste una recompensa increíble!", addedToAccount: "Añadido a tu cuenta", tryAgainTomorrow: "Inténtalo mañana", awesomeBtn: "¡Genial! 🎉", comeBackTomorrowChance: "¡Vuelve mañana para otra oportunidad!", shopHeroTitle: "Compra un libro digital y\nparticipa en el sorteo de $500", shopHeroSubtitle: "Cada compra te da recompensas y una chance de ganar $500.", chooseBookPack: "Elige tu paquete", basicPack: "Paquete Básico", plusPack: "Paquete Plus", premiumPack: "Paquete Premium", bestValueTag: "Mejor valor", includesLabel: "Incluye:", digitalBook: "Libro digital", buyForPrice: "Comprar por", shopDisclaimer2: "Las recompensas y entradas al sorteo son bonificaciones promocionales.", purchasedToast: "¡comprado!", chooseGiftCardPrize: "Elige tu tarjeta regalo", winBadge: "GANA $500", confirmPurchaseTitle: "Confirmar compra", youWillReceive: "Recibirás:", confirmPurchaseBtn: "Confirmar compra", male: "Hombre", female: "Mujer", playerYou: "Tú", botPlayer: "Bot 🤖", needsExactRoll: "¡necesita tiro exacto!", revealRewardNow: "Revelar ahora", scratchWinTypes: "Puntos, XP, Boletos", madamZaraTitle: "Madam Zara — Tarot", mysteryReaderLabel: "Lectora mística", startTarotBtn: "Iniciar sesión de Tarot", noTicketsTarot: "Sin boletos. Gira la rueda o compra en la tienda", selectCardsHeart: "Selecciona cartas con el corazón", tapAnyCard: "Toca cualquier carta para seleccionarla", revealReadTarot: "Revelar y leer Tarot", askMadamZara: "Pregunta a Madam Zara...", liveLabel: "En vivo", bonusEntriesLabel: "Entradas extra",
    seg_xp50: "50\nXP", seg_tryAgain: "Inténtalo\nde nuevo", seg_surprise: "Regalo\nSorpresa", seg_gameTicket: "Boleto\nJuego", seg_pointsXp: "15 Pts\n+50 XP", seg_xp100: "100\nXP", seg_tarotTicket: "Boleto\nTarot", seg_ticketCombo: "Juego &\nTarot",
    reward_xp50: "50 XP", reward_xp100: "100 XP", reward_gameTicket: "Boleto de Juego", reward_tarotTicket: "Boleto Tarot", reward_ticketCombo: "Boleto Juego & Tarot", reward_pointsXp: "15 Puntos + 50 XP", reward_surprise: "Regalo Sorpresa", reward_tryAgain: "Inténtalo de nuevo",
    welcomeTitle: "¡Bienvenido a Winline! ✨", welcomeMessage: "Soy Madam Zara, tu guía mística. Gira la rueda, juega y gana premios increíbles. ¡Que comience la magia!", welcomeButton: "¡Vamos! 🎉",
    xpRainTitle: "LLUVIA DE XP", xpRainCollected: "Recolectado", xpRainOver: "¡Lluvia de XP terminada!", xpRainYouGot: "Recolectaste", xpRainAddedToAccount: "¡Añadido a tu XP!", xpRainStarting: "⚡ ¡Lluvia de XP en 3 segundos! ¡Prepárate! ⚡", xpRainAnnounce: "recolectó"
  },
  tr: {
    home: "Ana Sayfa", shop: "Mağaza", games: "Oyunlar", chat: "Sohbet", crown: "Taç", cards: "Kartlar",
    giftCard: "$500 Hediye Kartı", promotionalDraw: "PROMOSYON ÇEKİLİŞİ", dailySpin: "GÜNLÜK DÖNDÜRME",
    oneFreeAttempt: "Bugün BİR ÜCRETSİZ HAKKINIZ var!", nextSpinIn: "Sonraki ücretsiz dönüşünüz:",
    hours: "SAAT", minutes: "DAKİKA", seconds: "SANİYE",
    xpPoints: "XP Puanları", gameTickets: "Oyun Biletleri", extraEntries: "Ekstra Giriş", surpriseRewards: "Sürprizler",
    allRewardsPromotional: "Tüm ödüller promosyondur", noCashValue: "Nakit değeri yoktur",
    spinNow: "DÖNDÜR", spinning: "DÖNÜYOR...", comeBackTomorrow: "YARIN GELİN",
    youWon: "Kazandınız!", maybeLater: "BELKI SONRA",
    extraChance: "Ekstra Şans", drawEntry: "Çekiliş Girişi", tryAgain: "Tekrar Dene",
    gameTicket: "Oyun Bileti", surpriseReward: "Sürpriz Ödül",
    selectBookExperience: "Kitap Deneyiminizi Seçin", inOur: "bizim",
    bookPurchaseDraw: "Kitap Satın Alma Çekilişi", mostPopular: "EN POPÜLER",
    vipXP: "VIP XP", tarotTicket: "Tarot Bileti", entry: "GİRİŞ", value: "DEĞER",
    purchasesProvideAccess: "Satın almalar dijital kitaplara erişim sağlar.",
    bonusFeatures: "Bonus özellikler satın alma ile dahil edilen promosyon ödülleridir.",
    availableGames: "Mevcut Oyunlar", snakeAndLadder: "Yılan ve Merdiven",
    classicBoardGame: "Klasik masa oyunu • PvP veya Bot'a karşı",
    tapFrenzy: "Tap Frenzy", tapAsFast: "Olabildiğince hızlı dokun!",
    memoryMatch: "Hafıza Eşleştirme", matchHiddenCards: "Gizli kartları eşleştir",
    comingSoon: "Yakında", ticket: "Bilet", gameRules: "Oyun Kuralları",
    entryTicket: "Giriş: oyun başına 1 bilet", betWithPoints: "Sadece Puanlarla bahis yap",
    winnerGets: "Kazanan +300 XP alır", loserGets: "Kaybeden +80 XP alır",
    noOpponentBot: "60s içinde rakip yok mu? Bot otomatik katılır",
    findOpponent: "RAKİP BUL", noTickets: "Bilet yok!", notEnoughPoints: "Yetersiz Puan",
    setYourBet: "Bahsinizi Belirleyin (Puan)", yourPoints: "Puanlarınız",
    entryCost: "Giriş Ücreti", yourTickets: "Biletleriniz",
    findingOpponent: "Rakip aranıyor...", botJoinsIn: "Bot katılıyor",
    searchingPlayers: "Oyuncu aranıyor...", yourTurn: "Sıranız", botsTurn: "Botun sırası...",
    roll: "AT", youWin: "KAZANDINIZ! 🎉", botWins: "Bot Kazandı!",
    backToGames: "OYUNLARA DÖN", rollTheDice: "Zarı at!",
    typeMessage: "Mesaj yaz...", reachLevel: "Ulaş",
    toUnlockRoom: "bu odayı açmak için", yourCurrentLevel: "Mevcut seviyeniz",
    room: "Oda",
    eachDayJoin: "Her gün katıldığınızda sizi yaklaştırır", closerToFew: "çok azının ulaşabildiği yere.",
    mysteryReward: "GİZEMLİ ÖDÜL", bronzeChest: "Bronz Sandık",
    silverChest: "Gümüş Sandık", goldChest: "Altın Sandık",
    level: "Seviye", elite: "Elit", legend: "Efsane",
    aiTarotReading: "AI Tarot Okuma", selectCardReveal: "Kaderinizi ortaya çıkarmak için bir kart seçin",
    ticketsRemaining: "bilet kaldı", readAgain: "Tekrar Oku",
    noTarotTickets: "Tarot bileti yok.",
    spinOrPurchase: "Çarkı çevirin veya bilet kazanmak için kitap satın alın!",
    card: "Kart", language: "Dil", selectLanguage: "Dil Seçin",
    drawProgress: "Çekiliş İlerlemesi", drawActive: "Aktif", drawComplete: "Tamamlandı", towardsDraw: "çekilişe doğru",
    participants: "Katılımcılar", totalEntries: "Toplam Giriş", prize: "Ödül", howToEnter: "Nasıl Katılınır",
    buyBook: "Herhangi bir kitap paketi satın alın", autoEntered: "Otomatik olarak kaydedilirsiniz",
    moreBooks: "Daha fazla alım = daha fazla şans", winnerSelected: "%100'de kazanan seçilir",
    recentEntries: "Son Girişler", pastWinners: "Geçmiş Kazananlar", enterDraw: "ÇEKİLİŞE KATIL",
    drawWinner: "Kazanan", wonPrize: "Ödülü kazandı", congratulations: "Tebrikler",
    newDraw: "YENİ ÇEKİLİŞ", drawDescription: "$500 hediye kartı çekilişi için kitap satın alın!", draw: "Çekiliş",
    login: "Giriş Yap", signup: "Kayıt Ol", loginSubtitle: "WINLINE'a hoş geldiniz", signupSubtitle: "Hesabınızı oluşturun", displayName: "Görünen Ad", email: "E-posta", password: "Şifre", passwordMinLength: "Şifre en az 6 karakter olmalıdır", welcomeBack: "Tekrar hoş geldiniz!", accountCreated: "Hesap başarıyla oluşturuldu!", logout: "Çıkış",
    scratchCard: "Kazı Kazan", scratchCardDesc: "Ödülünüzü kazıyarak öğrenin!", scratchToReveal: "Kartı kazıyın", scratchArea: "Burayı kazıyın!", youRevealed: "Ortaya çıkardınız", claimReward: "ÖDÜLÜ AL", tryAnotherCard: "BAŞKA KART", noReward: "Bir dahaki sefere!", scratchCardCost: "1 Oyun Bileti",
    profile: "Profil", loginToViewProfile: "Profilinizi görmek için giriş yapın", inventory: "Envanter", settings: "Ayarlar", clearData: "Verileri Temizle", photoUpdated: "Fotoğraf güncellendi!", nameUpdated: "İsim güncellendi!", dataCleared: "Veriler temizlendi!",
    drawExtended: "Çekiliş Uzatıldı", drawExtendedMessage: "Yüksek talep nedeniyle çekiliş uzatıldı. Tüm katılımlar geçerli kalmaya devam ediyor.", nextDrawIn: "Sonraki çekiliş", fairDrawSystem: "Adil Çekiliş Sistemi", fairDrawDescription: "Kazanan, güvenli bir rastgele oluşturucu kullanılarak tüm katılımlar arasından rastgele seçilir. Her katılımın kazanma şansı eşittir.", winnerAnnounced: "Kazanan Açıklandı!", won: "Kazandı", enterTheDraw: "$500 Çekilişe Katıl", giftCardDraw: "$500 Hediye Kartı Çekilişi", drawCloseInfo: "Çekiliş, ilerleme %100'e ulaştığında veya geri sayım sona erdiğinde kapanacaktır.", getUniqueEntry: "Benzersiz bir Giriş #ID alın", premiumTwoEntries: "Premium Paket = 2 Giriş!", randomPicksWinner: "Rastgele numara kazananı seçer!", yourEntries: "Girişleriniz",
    drawMainTitle: "Bir kitap satın alın ve $500 hediye kartı kazanmak için çekilişe katılın", drawSubtitle: "Her uygun satın alma size çekilişe katılma şansı verir. Premium Paket 2 giriş hakkı verir.", drawClosingCondition: "Çekiliş, uygun parti tamamlandığında veya kampanya süresi sona erdiğinde kapanır.", buyAndEnter: "Satın Al ve Çekilişe Katıl", howItWorks: "Nasıl Çalışır", howStep1: "Herhangi bir kitap paketi satın alın", howStep2: "Bir giriş şansı elde edersiniz", howStep3: "Premium = 2 giriş", howStep4: "Çekiliş kapandığında kazanan rastgele seçilir", moreInfo: "Daha Fazla Bilgi", moreInfo1: "Çekiliş promosyondur", moreInfo2: "Girişler satın alınan pakete göre verilir", moreInfo3: "Kazanan adil çekiliş sistemiyle seçilir", moreInfo4: "Kampanya şartlar ve koşullara tabidir", yourCurrentEntries: "Mevcut Girişleriniz",
    duelRPS: "✊✋✌️ Taş Kağıt Makas Düellosu", duelSearching: "🔍 Oyuncu aranıyor...", duelSendingInvites: "Mevcut oyunculara davetiye gönderiliyor", duelFoundOpponent: "⚡ Rakip bulundu! Hazırlan... ⚡", duelChooseWinner: "🎯 Kazananı seç!", duelVoteBefore: "Düello başlamadan oy ver", duelYourVote: "✓ Oyun", duelLiveVote: "📊 Canlı oy yüzdesi", duelRound: "Tur", duelChooseMove: "Hamlenizi seçin!", duelVs: "karşı", duelRockPaperScissors: "⚡ Taş... Kağıt... Makas!", duelDraw: "🤝 Berabere! Tur tekrarlanıyor...", duelWonRound: "turu kazandı!", duelIsWinner: "kazanan!", duelScore: "Skor", duelVoteCorrect: "🎉 Oyunuz doğruydu!", duelVoteWrong: "😔 Oyunuz yanlıştı", duelDidntVote: "Oy vermediniz", duelDone: "Tamam ✓", duelRock: "Taş", duelPaper: "Kağıt", duelScissors: "Makas",
    worldChallengeTitle: "⚔️ Dünya Düellosu", worldChallengeDesc: "Dijital kitabı satın alarak bir deneme hakkı kazanın ve Dünya odasında özel bir düello açın!", worldChallengePurchased: "🎉 Satın alma başarılı!", worldChallengeUnlockedMsg: "Dünya odasında bir düello açıldı!", worldBookExclusive: "Özel dijital kitap", worldOneChallenge: "Dünya odasında satın alma başına bir düello", worldNameShown: "Adınız düello şampiyonu olarak görünür", worldGameTicket: "🎮 Bir oyun bileti", worldDrawEntry: "🎟️ Bir çekiliş girişi", worldPerBook: "/ dijital kitap", worldBuyBook: "📖 Kitabı satın al ve düelloyu aç", worldAfterChallenge: "* Düello bittikten sonra hemen kilitlenir ve yeni satın alma gerektirir", worldLockMsg: "🔒 Dünya düellosunu açmak için kitabı satın alın",
    systemChampion: "Şampiyon", systemNewLegend: "Odanın yeni efsanesi! Kim meydan okumaya cesaret eder?", systemWhoChallenge: "düelloyu kazandı", welcomeMsg: "Merhaba", welcomeLitRoom: "Odayı aydınlattınız",
    winlineDailySpin: "WINLINE GÜNLÜK ÇEVİRME", winGiftCard: "$500 Hediye Kartı Kazanın", spinTheWheelBtn: "🎰 ÇARKI ÇEVİR", comeBackSpin: "Sonraki dönüşünüz için yarın gelin", dailySpinReward: "GÜNLÜK ÇEVİRME ÖDÜLÜ", nextFreeSpin: "SONRAKİ ÜCRETSİZ DÖNDÜRME", freeSpinAvailable: "Bir ücretsiz dönüşünüz var!", betterLuckNextTime: "Bir dahaki sefere!", wonAmazingReward: "Harika bir ödül kazandınız!", addedToAccount: "Hesabınıza eklendi", tryAgainTomorrow: "Yarın tekrar deneyin", awesomeBtn: "Harika! 🎉", comeBackTomorrowChance: "Başka bir şans için yarın gelin!", shopHeroTitle: "Dijital kitap satın alın ve\n$500 çekilişine katılın", shopHeroSubtitle: "Her satın alma size ödüller ve $500 hediye kartı kazanma şansı verir.", chooseBookPack: "Kitap Paketinizi Seçin", basicPack: "Temel Paket", plusPack: "Plus Paket", premiumPack: "Premium Paket", bestValueTag: "En İyi Değer", includesLabel: "İçerir:", digitalBook: "Dijital Kitap", buyForPrice: "Satın al", shopDisclaimer2: "Oyun ödülleri ve çekiliş girişleri promosyon bonuslarıdır.", purchasedToast: "satın alındı!", chooseGiftCardPrize: "Hediye Kartınızı Seçin", winBadge: "KAZAN $500", confirmPurchaseTitle: "Satın Almayı Onayla", youWillReceive: "Alacaksınız:", confirmPurchaseBtn: "Satın Almayı Onayla", male: "Erkek", female: "Kadın", playerYou: "Sen", botPlayer: "Bot 🤖", needsExactRoll: "tam atış gerekli!", revealRewardNow: "Şimdi göster", scratchWinTypes: "Puanlar, XP, Biletler", madamZaraTitle: "Madam Zara — Tarot", mysteryReaderLabel: "Gizemli Okuyucu", startTarotBtn: "Tarot Seansını Başlat", noTicketsTarot: "Bilet yok. Çarkı çevirin veya mağazadan alın", selectCardsHeart: "Kalbinizle kartları seçin", tapAnyCard: "Seçmek için karta dokunun", revealReadTarot: "Kartları Aç ve Tarot Oku", askMadamZara: "Madam Zara'ya sorun...", liveLabel: "Canlı", bonusEntriesLabel: "Ekstra Giriş",
    seg_xp50: "50\nXP", seg_tryAgain: "Tekrar\nDene", seg_surprise: "Sürpriz\nHediye", seg_gameTicket: "Oyun\nBileti", seg_pointsXp: "15 Puan\n+50 XP", seg_xp100: "100\nXP", seg_tarotTicket: "Tarot\nBileti", seg_ticketCombo: "Oyun &\nTarot",
    reward_xp50: "50 XP", reward_xp100: "100 XP", reward_gameTicket: "Oyun Bileti", reward_tarotTicket: "Tarot Bileti", reward_ticketCombo: "Oyun & Tarot Bileti", reward_pointsXp: "15 Puan + 50 XP", reward_surprise: "Sürpriz Hediye", reward_tryAgain: "Tekrar Dene",
    welcomeTitle: "Winline'a Hoş Geldiniz! ✨", welcomeMessage: "Ben Madam Zara, mistik rehberiniz. Çarkı çevirin, oynayın ve harika ödüller kazanın. Sihir başlasın!", welcomeButton: "Hadi Başlayalım! 🎉",
    xpRainTitle: "XP YAĞMURU", xpRainCollected: "Toplanan", xpRainOver: "XP Yağmuru Bitti!", xpRainYouGot: "Topladınız", xpRainAddedToAccount: "XP'nize eklendi!", xpRainStarting: "⚡ XP Yağmuru 3 saniye içinde başlıyor! Hazır olun! ⚡", xpRainAnnounce: "topladı"
  },
  de: {
    home: "Startseite", shop: "Shop", games: "Spiele", chat: "Chat", crown: "Krone", cards: "Karten",
    giftCard: "$500 Geschenkkarte", promotionalDraw: "WERBEZIEHUNG", dailySpin: "TÄGLICHES DREHEN",
    oneFreeAttempt: "Sie haben EINEN GRATIS VERSUCH heute!", nextSpinIn: "Nächster Gratis-Dreh verfügbar in:",
    hours: "STUNDEN", minutes: "MINUTEN", seconds: "SEKUNDEN",
    xpPoints: "XP Punkte", gameTickets: "Spieltickets", extraEntries: "Extralose", surpriseRewards: "Überraschungen",
    allRewardsPromotional: "Alle Belohnungen sind Werbeaktionen", noCashValue: "Kein Geldwert",
    spinNow: "DREHEN", spinning: "DREHT...", comeBackTomorrow: "KOMMEN SIE MORGEN WIEDER",
    youWon: "Sie haben gewonnen!", maybeLater: "VIELLEICHT SPÄTER",
    extraChance: "Extrachance", drawEntry: "Loseingang", tryAgain: "Nochmal",
    gameTicket: "Spielticket", surpriseReward: "Überraschungsbelohnung",
    selectBookExperience: "Wählen Sie Ihr Bucherlebnis", inOur: "in unserem",
    bookPurchaseDraw: "Buchkauf-Ziehung", mostPopular: "BELIEBTESTE",
    vipXP: "VIP XP", tarotTicket: "Tarot-Ticket", entry: "EINTRITT", value: "WERT",
    purchasesProvideAccess: "Käufe bieten Zugang zu digitalen Büchern.",
    bonusFeatures: "Bonusfunktionen sind Werbebelohnungen.",
    availableGames: "Verfügbare Spiele", snakeAndLadder: "Schlangen und Leitern",
    classicBoardGame: "Klassisches Brettspiel • PvP oder vs Bot",
    tapFrenzy: "Tap Frenzy", tapAsFast: "Tippen Sie so schnell wie möglich!",
    memoryMatch: "Memory Match", matchHiddenCards: "Finden Sie die Paare",
    comingSoon: "Bald verfügbar", ticket: "Ticket", gameRules: "Spielregeln",
    entryTicket: "Eintritt: 1 Ticket pro Spiel", betWithPoints: "Nur mit Punkten wetten",
    winnerGets: "Gewinner erhält +300 XP", loserGets: "Verlierer erhält +80 XP",
    noOpponentBot: "Kein Gegner in 60s? Bot tritt bei",
    findOpponent: "GEGNER FINDEN", noTickets: "Keine Tickets!", notEnoughPoints: "Nicht genug Punkte",
    setYourBet: "Einsatz festlegen (Punkte)", yourPoints: "Ihre Punkte",
    entryCost: "Eintrittskosten", yourTickets: "Ihre Tickets",
    findingOpponent: "Gegner wird gesucht...", botJoinsIn: "Bot tritt bei in",
    searchingPlayers: "Spieler werden gesucht...", yourTurn: "Ihr Zug", botsTurn: "Bot ist dran...",
    roll: "WÜRFELN", youWin: "SIE GEWINNEN! 🎉", botWins: "Bot gewinnt!",
    backToGames: "ZURÜCK ZU SPIELEN", rollTheDice: "Würfeln Sie!",
    typeMessage: "Nachricht schreiben...", reachLevel: "Erreichen Sie",
    toUnlockRoom: "um diesen Raum freizuschalten", yourCurrentLevel: "Ihr aktuelles Level",
    room: "Raum",
    eachDayJoin: "Jeder Tag bringt Sie näher", closerToFew: "dorthin, wo nur wenige gelangen.",
    mysteryReward: "MYSTERY-BELOHNUNG", bronzeChest: "Bronze-Truhe",
    silverChest: "Silber-Truhe", goldChest: "Gold-Truhe",
    level: "Level", elite: "Elite", legend: "Legende",
    aiTarotReading: "KI-Tarot-Lesung", selectCardReveal: "Wählen Sie eine Karte",
    ticketsRemaining: "Tickets übrig", readAgain: "Nochmal lesen",
    noTarotTickets: "Keine Tarot-Tickets verfügbar.",
    spinOrPurchase: "Drehen Sie das Rad oder kaufen Sie ein Buch!",
    card: "Karte", language: "Sprache", selectLanguage: "Sprache wählen",
    drawProgress: "Fortschritt", drawActive: "Aktiv", drawComplete: "Abgeschlossen", towardsDraw: "zur Ziehung",
    participants: "Teilnehmer", totalEntries: "Gesamteinträge", prize: "Preis", howToEnter: "Wie teilnehmen",
    buyBook: "Kaufen Sie ein Buchpaket", autoEntered: "Sie werden automatisch eingetragen",
    moreBooks: "Mehr Käufe = mehr Chancen", winnerSelected: "Gewinner wird bei 100% ausgewählt",
    recentEntries: "Letzte Einträge", pastWinners: "Frühere Gewinner", enterDraw: "TEILNEHMEN",
    drawWinner: "Gewinner", wonPrize: "Hat gewonnen", congratulations: "Herzlichen Glückwunsch",
    newDraw: "NEUE ZIEHUNG", drawDescription: "Kaufen Sie Bücher für die $500 Geschenkkarte!", draw: "Ziehung",
    login: "Anmelden", signup: "Registrieren", loginSubtitle: "Willkommen bei WINLINE", signupSubtitle: "Erstellen Sie Ihr Konto", displayName: "Anzeigename", email: "E-Mail", password: "Passwort", passwordMinLength: "Passwort muss mindestens 6 Zeichen haben", welcomeBack: "Willkommen zurück!", accountCreated: "Konto erfolgreich erstellt!", logout: "Abmelden",
    scratchCard: "Rubbelkarte", scratchCardDesc: "Rubbeln Sie Ihren Preis frei!", scratchToReveal: "Rubbeln Sie die Karte", scratchArea: "Hier rubbeln!", youRevealed: "Sie haben enthüllt", claimReward: "EINLÖSEN", tryAnotherCard: "NEUE KARTE", noReward: "Nächstes Mal mehr Glück!", scratchCardCost: "1 Spielticket",
    profile: "Profil", loginToViewProfile: "Melden Sie sich an, um Ihr Profil zu sehen", inventory: "Inventar", settings: "Einstellungen", clearData: "Daten löschen", photoUpdated: "Foto aktualisiert!", nameUpdated: "Name aktualisiert!", dataCleared: "Daten gelöscht!",
    drawExtended: "Ziehung verlängert", drawExtendedMessage: "Die Ziehung wurde aufgrund hoher Nachfrage verlängert. Alle Teilnahmen bleiben gültig.", nextDrawIn: "Nächste Ziehung in", fairDrawSystem: "Faires Ziehungssystem", fairDrawDescription: "Der Gewinner wird zufällig aus allen Teilnahmen ausgewählt. Jede Teilnahme hat die gleiche Gewinnchance.", winnerAnnounced: "Gewinner bekannt gegeben!", won: "Gewonnen", enterTheDraw: "An der $500 Ziehung teilnehmen", giftCardDraw: "$500 Geschenkkarten-Ziehung", drawCloseInfo: "Die Ziehung endet, wenn der Fortschritt 100% erreicht oder der Countdown abläuft.", getUniqueEntry: "Erhalten Sie eine einzigartige Eintrags-#ID", premiumTwoEntries: "Premium-Paket = 2 Einträge!", randomPicksWinner: "Eine Zufallszahl wählt den Gewinner!", yourEntries: "Ihre Einträge",
    drawMainTitle: "Kaufen Sie ein Buch und nehmen Sie an der Ziehung teil, um eine $500 Geschenkkarte zu gewinnen", drawSubtitle: "Jeder qualifizierende Kauf gibt Ihnen eine Chance zur Teilnahme. Das Premium-Paket gibt Ihnen 2 Einträge.", drawClosingCondition: "Die Ziehung endet, wenn die qualifizierende Charge abgeschlossen ist oder der Kampagnenzeitraum endet.", buyAndEnter: "Kaufen und teilnehmen", howItWorks: "So funktioniert's", howStep1: "Kaufen Sie ein beliebiges Buchpaket", howStep2: "Sie erhalten eine Teilnahmechance", howStep3: "Premium = 2 Einträge", howStep4: "Der Gewinner wird bei Schließung der Ziehung zufällig ausgewählt", moreInfo: "Weitere Informationen", moreInfo1: "Die Ziehung ist eine Werbeaktion", moreInfo2: "Einträge werden basierend auf dem gekauften Paket vergeben", moreInfo3: "Der Gewinner wird durch ein faires Ziehungssystem ausgewählt", moreInfo4: "Die Kampagne unterliegt den AGB", yourCurrentEntries: "Ihre aktuellen Einträge",
    duelRPS: "✊✋✌️ Schere Stein Papier Duell", duelSearching: "🔍 Spieler wird gesucht...", duelSendingInvites: "Einladungen werden an verfügbare Spieler gesendet", duelFoundOpponent: "⚡ Gegner gefunden! Mach dich bereit... ⚡", duelChooseWinner: "🎯 Wähle den Gewinner!", duelVoteBefore: "Stimme ab, bevor das Duell beginnt", duelYourVote: "✓ Deine Stimme", duelLiveVote: "📊 Live-Abstimmung", duelRound: "Runde", duelChooseMove: "Wähle deinen Zug!", duelVs: "gegen", duelRockPaperScissors: "⚡ Schere... Stein... Papier!", duelDraw: "🤝 Unentschieden! Runde wird wiederholt...", duelWonRound: "hat die Runde gewonnen!", duelIsWinner: "ist der Gewinner!", duelScore: "Ergebnis", duelVoteCorrect: "🎉 Deine Stimme war richtig!", duelVoteWrong: "😔 Deine Stimme war falsch", duelDidntVote: "Du hast nicht abgestimmt", duelDone: "Fertig ✓", duelRock: "Stein", duelPaper: "Papier", duelScissors: "Schere",
    worldChallengeTitle: "⚔️ Welt-Duell", worldChallengeDesc: "Kaufen Sie das digitale Buch für einen Versuch und schalten Sie ein exklusives Duell im Weltraum frei!", worldChallengePurchased: "🎉 Kauf erfolgreich!", worldChallengeUnlockedMsg: "Ein Duell ist jetzt im Weltraum freigeschaltet!", worldBookExclusive: "Exklusives digitales Buch", worldOneChallenge: "Ein Duell pro Kauf im Weltraum", worldNameShown: "Ihr Name erscheint als Duell-Champion", worldGameTicket: "🎮 Ein Spielticket", worldDrawEntry: "🎟️ Ein Ziehungseintrag", worldPerBook: "/ digitales Buch", worldBuyBook: "📖 Buch kaufen und Duell freischalten", worldAfterChallenge: "* Nach dem Duell wird es sofort gesperrt und erfordert einen neuen Kauf", worldLockMsg: "🔒 Kaufen Sie das Buch, um das Welt-Duell freizuschalten",
    systemChampion: "Champion", systemNewLegend: "Neue Legende des Raums! Wer wagt es, ihn herauszufordern?", systemWhoChallenge: "hat das Duell gewonnen gegen", welcomeMsg: "Hallo", welcomeLitRoom: "Du hast den Raum erhellt",
    winlineDailySpin: "WINLINE TÄGLICHES DREHEN", winGiftCard: "Gewinnen Sie $500 Geschenkkarte", spinTheWheelBtn: "🎰 RAD DREHEN", comeBackSpin: "Kommen Sie morgen für Ihren nächsten Dreh", dailySpinReward: "TÄGLICHE DREHBELOHNUNG", nextFreeSpin: "NÄCHSTER GRATIS-DREH", freeSpinAvailable: "Sie haben einen Gratis-Dreh!", betterLuckNextTime: "Mehr Glück beim nächsten Mal!", wonAmazingReward: "Sie haben eine tolle Belohnung gewonnen!", addedToAccount: "Ihrem Konto hinzugefügt", tryAgainTomorrow: "Morgen erneut versuchen", awesomeBtn: "Toll! 🎉", comeBackTomorrowChance: "Kommen Sie morgen für eine weitere Chance!", shopHeroTitle: "Kaufen Sie ein digitales Buch und\nnehmen Sie an der $500 Ziehung teil", shopHeroSubtitle: "Jeder Kauf gibt Ihnen Belohnungen und eine Chance auf $500.", chooseBookPack: "Wählen Sie Ihr Buchpaket", basicPack: "Basis-Paket", plusPack: "Plus-Paket", premiumPack: "Premium-Paket", bestValueTag: "Bester Wert", includesLabel: "Enthält:", digitalBook: "Digitales Buch", buyForPrice: "Kaufen für", shopDisclaimer2: "Spielbelohnungen und Ziehungseinträge sind Werbeboni.", purchasedToast: "gekauft!", chooseGiftCardPrize: "Wählen Sie Ihre Geschenkkarte", winBadge: "GEWINNEN $500", confirmPurchaseTitle: "Kauf bestätigen", youWillReceive: "Sie erhalten:", confirmPurchaseBtn: "Kauf bestätigen", male: "Männlich", female: "Weiblich", playerYou: "Du", botPlayer: "Bot 🤖", needsExactRoll: "braucht exakten Wurf!", revealRewardNow: "Jetzt enthüllen", scratchWinTypes: "Punkte, XP, Tickets", madamZaraTitle: "Madam Zara — Tarot", mysteryReaderLabel: "Mysteriöse Leserin", startTarotBtn: "Tarot-Sitzung starten", noTicketsTarot: "Keine Tickets. Drehen Sie das Rad oder kaufen Sie im Shop", selectCardsHeart: "Wählen Sie Karten aus dem Herzen", tapAnyCard: "Tippen Sie auf eine Karte zum Auswählen", revealReadTarot: "Karten aufdecken und Tarot lesen", askMadamZara: "Fragen Sie Madam Zara...", liveLabel: "Live", bonusEntriesLabel: "Extralose",
    seg_xp50: "50\nXP", seg_tryAgain: "Nochmal\nversuchen", seg_surprise: "Überraschungs-\ngeschenk", seg_gameTicket: "Spiel-\nTicket", seg_pointsXp: "15 Pkt\n+50 XP", seg_xp100: "100\nXP", seg_tarotTicket: "Tarot-\nTicket", seg_ticketCombo: "Spiel &\nTarot",
    reward_xp50: "50 XP", reward_xp100: "100 XP", reward_gameTicket: "Spiel-Ticket", reward_tarotTicket: "Tarot-Ticket", reward_ticketCombo: "Spiel & Tarot Ticket", reward_pointsXp: "15 Punkte + 50 XP", reward_surprise: "Überraschungsgeschenk", reward_tryAgain: "Nochmal versuchen",
    welcomeTitle: "Willkommen bei Winline! ✨", welcomeMessage: "Ich bin Madam Zara, Ihre mystische Führerin. Drehen Sie das Rad, spielen Sie und gewinnen Sie tolle Preise. Lassen Sie die Magie beginnen!", welcomeButton: "Los geht's! 🎉",
    xpRainTitle: "XP-REGEN", xpRainCollected: "Gesammelt", xpRainOver: "XP-Regen vorbei!", xpRainYouGot: "Sie sammelten", xpRainAddedToAccount: "Zu Ihren XP hinzugefügt!", xpRainStarting: "⚡ XP-Regen startet in 3 Sekunden! Bereit machen! ⚡", xpRainAnnounce: "sammelte"
  },
  it: {
    home: "Home", shop: "Negozio", games: "Giochi", chat: "Chat", crown: "Corona", cards: "Carte",
    giftCard: "Carta regalo $500", promotionalDraw: "ESTRAZIONE PROMOZIONALE", dailySpin: "GIRO GIORNALIERO",
    oneFreeAttempt: "Hai UN TENTATIVO GRATIS oggi!", nextSpinIn: "Il prossimo giro gratis disponibile tra:",
    hours: "ORE", minutes: "MINUTI", seconds: "SECONDI",
    xpPoints: "Punti XP", gameTickets: "Biglietti gioco", extraEntries: "Ingressi extra", surpriseRewards: "Sorprese",
    allRewardsPromotional: "Tutti i premi sono promozionali", noCashValue: "Nessun valore monetario",
    spinNow: "GIRA ORA", spinning: "GIRANDO...", comeBackTomorrow: "TORNA DOMANI",
    youWon: "Hai vinto!", maybeLater: "FORSE DOPO",
    extraChance: "Chance extra", drawEntry: "Ingresso estrazione", tryAgain: "Riprova",
    gameTicket: "Biglietto gioco", surpriseReward: "Premio sorpresa",
    selectBookExperience: "Scegli la tua esperienza libro", inOur: "nella nostra",
    bookPurchaseDraw: "Estrazione acquisto libri", mostPopular: "PIÙ POPOLARE",
    vipXP: "XP VIP", tarotTicket: "Biglietto Tarocchi", entry: "INGRESSO", value: "VALORE",
    purchasesProvideAccess: "Gli acquisti forniscono accesso ai libri digitali.",
    bonusFeatures: "I bonus sono premi promozionali inclusi.",
    availableGames: "Giochi disponibili", snakeAndLadder: "Serpenti e Scale",
    classicBoardGame: "Gioco da tavolo classico • PvP o vs Bot",
    tapFrenzy: "Tap Frenzy", tapAsFast: "Tocca più veloce che puoi!",
    memoryMatch: "Memory Match", matchHiddenCards: "Trova le coppie",
    comingSoon: "Prossimamente", ticket: "Biglietto", gameRules: "Regole del gioco",
    entryTicket: "Ingresso: 1 biglietto per partita", betWithPoints: "Scommetti solo con Punti",
    winnerGets: "Il vincitore riceve +300 XP", loserGets: "Il perdente riceve +80 XP",
    noOpponentBot: "Nessun avversario in 60s? Il bot si unisce",
    findOpponent: "TROVA AVVERSARIO", noTickets: "Nessun biglietto!", notEnoughPoints: "Punti insufficienti",
    setYourBet: "Imposta la tua scommessa (Punti)", yourPoints: "I tuoi Punti",
    entryCost: "Costo d'ingresso", yourTickets: "I tuoi Biglietti",
    findingOpponent: "Ricerca avversario...", botJoinsIn: "Il bot si unisce tra",
    searchingPlayers: "Ricerca giocatori...", yourTurn: "Il tuo turno", botsTurn: "Turno del bot...",
    roll: "LANCIA", youWin: "HAI VINTO! 🎉", botWins: "Il bot vince!",
    backToGames: "TORNA AI GIOCHI", rollTheDice: "Lancia il dado!",
    typeMessage: "Scrivi un messaggio...", reachLevel: "Raggiungi",
    toUnlockRoom: "per sbloccare questa stanza", yourCurrentLevel: "Il tuo livello attuale",
    room: "Stanza",
    eachDayJoin: "Ogni giorno ti avvicina", closerToFew: "a dove pochi arrivano.",
    mysteryReward: "PREMIO MISTERIOSO", bronzeChest: "Forziere Bronzo",
    silverChest: "Forziere Argento", goldChest: "Forziere Oro",
    level: "Livello", elite: "Élite", legend: "Leggenda",
    aiTarotReading: "Lettura Tarocchi IA", selectCardReveal: "Scegli una carta per rivelare il tuo destino",
    ticketsRemaining: "biglietti rimasti", readAgain: "Leggi di nuovo",
    noTarotTickets: "Nessun biglietto tarocchi.",
    spinOrPurchase: "Gira la ruota o acquista un libro!",
    card: "Carta", language: "Lingua", selectLanguage: "Seleziona lingua",
    drawProgress: "Progresso", drawActive: "Attivo", drawComplete: "Completato", towardsDraw: "verso l'estrazione",
    participants: "Partecipanti", totalEntries: "Ingressi totali", prize: "Premio", howToEnter: "Come partecipare",
    buyBook: "Acquista un pacchetto libro", autoEntered: "Sei automaticamente iscritto",
    moreBooks: "Più acquisti = più possibilità", winnerSelected: "Vincitore selezionato al 100%",
    recentEntries: "Ingressi recenti", pastWinners: "Vincitori passati", enterDraw: "PARTECIPA",
    drawWinner: "Vincitore", wonPrize: "Ha vinto il premio", congratulations: "Congratulazioni",
    newDraw: "NUOVA ESTRAZIONE", drawDescription: "Acquista libri per l'estrazione da $500!", draw: "Estrazione",
    login: "Accedi", signup: "Registrati", loginSubtitle: "Bentornato su WINLINE", signupSubtitle: "Crea il tuo account", displayName: "Nome visualizzato", email: "Email", password: "Password", passwordMinLength: "La password deve avere almeno 6 caratteri", welcomeBack: "Bentornato!", accountCreated: "Account creato con successo!", logout: "Esci",
    scratchCard: "Gratta e Vinci", scratchCardDesc: "Gratta per rivelare il premio!", scratchToReveal: "Gratta la carta", scratchArea: "Gratta qui!", youRevealed: "Hai rivelato", claimReward: "RISCUOTI", tryAnotherCard: "ALTRA CARTA", noReward: "Più fortuna la prossima volta!", scratchCardCost: "1 Biglietto gioco",
    profile: "Profilo", loginToViewProfile: "Accedi per vedere il tuo profilo", inventory: "Inventario", settings: "Impostazioni", clearData: "Cancella dati", photoUpdated: "Foto aggiornata!", nameUpdated: "Nome aggiornato!", dataCleared: "Dati cancellati!",
    drawExtended: "Estrazione prolungata", drawExtendedMessage: "L'estrazione è stata prolungata a causa dell'elevata richiesta. Tutte le partecipazioni restano valide.", nextDrawIn: "Prossima estrazione tra", fairDrawSystem: "Sistema di estrazione equo", fairDrawDescription: "Il vincitore viene selezionato casualmente tra tutte le partecipazioni. Ogni partecipazione ha le stesse probabilità di vincere.", winnerAnnounced: "Vincitore annunciato!", won: "Ha vinto", enterTheDraw: "Partecipa all'estrazione da $500", giftCardDraw: "Estrazione carta regalo $500", drawCloseInfo: "L'estrazione si chiuderà quando il progresso raggiunge il 100% o allo scadere del conto alla rovescia.", getUniqueEntry: "Ottieni un numero di ingresso unico #ID", premiumTwoEntries: "Pack Premium = 2 Ingressi!", randomPicksWinner: "Un numero casuale sceglie il vincitore!", yourEntries: "Le tue partecipazioni",
    drawMainTitle: "Acquista un libro e partecipa all'estrazione per vincere una carta regalo da $500", drawSubtitle: "Ogni acquisto idoneo ti dà una possibilità di partecipare all'estrazione. Il Pack Premium ti dà 2 ingressi.", drawClosingCondition: "L'estrazione si conclude quando il lotto idoneo è completo o alla fine del periodo della campagna.", buyAndEnter: "Acquista e partecipa", howItWorks: "Come funziona", howStep1: "Acquista qualsiasi pacchetto di libri", howStep2: "Ottieni una possibilità di ingresso", howStep3: "Premium = 2 ingressi", howStep4: "Il vincitore viene selezionato casualmente alla chiusura dell'estrazione", moreInfo: "Maggiori informazioni", moreInfo1: "L'estrazione è promozionale", moreInfo2: "Gli ingressi vengono concessi in base al pacchetto acquistato", moreInfo3: "Il vincitore viene selezionato tramite un sistema di estrazione equo", moreInfo4: "La campagna è soggetta a termini e condizioni", yourCurrentEntries: "Le tue partecipazioni attuali",
    duelRPS: "✊✋✌️ Sfida Sasso Carta Forbice", duelSearching: "🔍 Ricerca giocatore...", duelSendingInvites: "Invio inviti ai giocatori disponibili", duelFoundOpponent: "⚡ Avversario trovato! Preparati... ⚡", duelChooseWinner: "🎯 Scegli il vincitore!", duelVoteBefore: "Vota prima che inizi la sfida", duelYourVote: "✓ Il tuo voto", duelLiveVote: "📊 Percentuale voto dal vivo", duelRound: "Turno", duelChooseMove: "Scegli la tua mossa!", duelVs: "contro", duelRockPaperScissors: "⚡ Sasso... Carta... Forbice!", duelDraw: "🤝 Pareggio! Ripetizione turno...", duelWonRound: "ha vinto il turno!", duelIsWinner: "è il vincitore!", duelScore: "Punteggio", duelVoteCorrect: "🎉 Il tuo voto era corretto!", duelVoteWrong: "😔 Il tuo voto era sbagliato", duelDidntVote: "Non hai votato", duelDone: "Fatto ✓", duelRock: "Sasso", duelPaper: "Carta", duelScissors: "Forbice",
    worldChallengeTitle: "⚔️ Sfida Mondiale", worldChallengeDesc: "Acquista il libro digitale per un tentativo e sblocca una sfida esclusiva nella sala Mondo!", worldChallengePurchased: "🎉 Acquisto riuscito!", worldChallengeUnlockedMsg: "Una sfida è ora sbloccata nella sala Mondo!", worldBookExclusive: "Libro digitale esclusivo", worldOneChallenge: "Una sfida per acquisto nella sala Mondo", worldNameShown: "Il tuo nome appare come campione della sfida", worldGameTicket: "🎮 Un biglietto gioco", worldDrawEntry: "🎟️ Un ingresso all'estrazione", worldPerBook: "/ libro digitale", worldBuyBook: "📖 Acquista il libro e sblocca la sfida", worldAfterChallenge: "* Dopo la sfida, si blocca immediatamente e richiede un nuovo acquisto", worldLockMsg: "🔒 Acquista il libro per sbloccare la sfida Mondiale",
    systemChampion: "Campione", systemNewLegend: "Nuova leggenda della stanza! Chi osa sfidarlo?", systemWhoChallenge: "ha vinto la sfida contro", welcomeMsg: "Ciao", welcomeLitRoom: "Hai illuminato la stanza",
    winlineDailySpin: "GIRO GIORNALIERO WINLINE", winGiftCard: "Vinci una carta regalo da $500", spinTheWheelBtn: "🎰 GIRA LA RUOTA", comeBackSpin: "Torna domani per il prossimo giro", dailySpinReward: "PREMIO GIRO GIORNALIERO", nextFreeSpin: "PROSSIMO GIRO GRATIS", freeSpinAvailable: "Hai un giro gratis!", betterLuckNextTime: "Più fortuna la prossima!", wonAmazingReward: "Hai vinto un premio fantastico!", addedToAccount: "Aggiunto al tuo account", tryAgainTomorrow: "Riprova domani", awesomeBtn: "Fantastico! 🎉", comeBackTomorrowChance: "Torna domani per un'altra possibilità!", shopHeroTitle: "Acquista un libro digitale e\npartecipa all'estrazione da $500", shopHeroSubtitle: "Ogni acquisto ti dà premi e una possibilità di vincere $500.", chooseBookPack: "Scegli il tuo pacchetto", basicPack: "Pacchetto Base", plusPack: "Pacchetto Plus", premiumPack: "Pacchetto Premium", bestValueTag: "Miglior valore", includesLabel: "Include:", digitalBook: "Libro digitale", buyForPrice: "Acquista per", shopDisclaimer2: "I premi e le entrate all'estrazione sono bonus promozionali.", purchasedToast: "acquistato!", chooseGiftCardPrize: "Scegli la tua carta regalo", winBadge: "VINCI $500", confirmPurchaseTitle: "Conferma acquisto", youWillReceive: "Riceverai:", confirmPurchaseBtn: "Conferma acquisto", male: "Maschio", female: "Femmina", playerYou: "Tu", botPlayer: "Bot 🤖", needsExactRoll: "serve lancio esatto!", revealRewardNow: "Rivela ora", scratchWinTypes: "Punti, XP, Biglietti", madamZaraTitle: "Madam Zara — Tarocchi", mysteryReaderLabel: "Lettrice mistica", startTarotBtn: "Inizia sessione Tarocchi", noTicketsTarot: "Nessun biglietto. Gira la ruota o acquista in negozio", selectCardsHeart: "Scegli le carte con il cuore", tapAnyCard: "Tocca una carta per selezionarla", revealReadTarot: "Rivela e leggi i Tarocchi", askMadamZara: "Chiedi a Madam Zara...", liveLabel: "In diretta", bonusEntriesLabel: "Ingressi extra",
    seg_xp50: "50\nXP", seg_tryAgain: "Riprova", seg_surprise: "Regalo\nSorpresa", seg_gameTicket: "Biglietto\nGioco", seg_pointsXp: "15 Pts\n+50 XP", seg_xp100: "100\nXP", seg_tarotTicket: "Biglietto\nTarocchi", seg_ticketCombo: "Gioco &\nTarocchi",
    reward_xp50: "50 XP", reward_xp100: "100 XP", reward_gameTicket: "Biglietto Gioco", reward_tarotTicket: "Biglietto Tarocchi", reward_ticketCombo: "Biglietto Gioco & Tarocchi", reward_pointsXp: "15 Punti + 50 XP", reward_surprise: "Regalo Sorpresa", reward_tryAgain: "Riprova",
    welcomeTitle: "Benvenuto su Winline! ✨", welcomeMessage: "Sono Madam Zara, la tua guida mistica. Gira la ruota, gioca e vinci premi incredibili. Che la magia abbia inizio!", welcomeButton: "Andiamo! 🎉",
    xpRainTitle: "PIOGGIA DI XP", xpRainCollected: "Raccolti", xpRainOver: "Pioggia di XP finita!", xpRainYouGot: "Hai raccolto", xpRainAddedToAccount: "Aggiunto ai tuoi XP!", xpRainStarting: "⚡ Pioggia di XP tra 3 secondi! Preparati! ⚡", xpRainAnnounce: "ha raccolto"
  },
  pt: {
    home: "Início", shop: "Loja", games: "Jogos", chat: "Chat", crown: "Coroa", cards: "Cartas",
    giftCard: "Cartão presente $500", promotionalDraw: "SORTEIO PROMOCIONAL", dailySpin: "GIRO DIÁRIO",
    oneFreeAttempt: "Você tem UMA TENTATIVA GRÁTIS hoje!", nextSpinIn: "Seu próximo giro grátis disponível em:",
    hours: "HORAS", minutes: "MINUTOS", seconds: "SEGUNDOS",
    xpPoints: "Pontos XP", gameTickets: "Ingressos de jogo", extraEntries: "Entradas extras", surpriseRewards: "Surpresas",
    allRewardsPromotional: "Todas as recompensas são promocionais", noCashValue: "Sem valor monetário",
    spinNow: "GIRAR AGORA", spinning: "GIRANDO...", comeBackTomorrow: "VOLTE AMANHÃ",
    youWon: "Você ganhou!", maybeLater: "TALVEZ DEPOIS",
    extraChance: "Chance extra", drawEntry: "Entrada no sorteio", tryAgain: "Tentar novamente",
    gameTicket: "Ingresso de jogo", surpriseReward: "Recompensa surpresa",
    selectBookExperience: "Escolha sua experiência de livro", inOur: "em nosso",
    bookPurchaseDraw: "Sorteio de compra de livros", mostPopular: "MAIS POPULAR",
    vipXP: "XP VIP", tarotTicket: "Ingresso Tarot", entry: "ENTRADA", value: "VALOR",
    purchasesProvideAccess: "Compras fornecem acesso a livros digitais.",
    bonusFeatures: "Bônus são recompensas promocionais incluídas.",
    availableGames: "Jogos disponíveis", snakeAndLadder: "Cobra e Escada",
    classicBoardGame: "Jogo de tabuleiro clássico • PvP ou vs Bot",
    tapFrenzy: "Tap Frenzy", tapAsFast: "Toque o mais rápido possível!",
    memoryMatch: "Memory Match", matchHiddenCards: "Encontre os pares",
    comingSoon: "Em breve", ticket: "Ingresso", gameRules: "Regras do jogo",
    entryTicket: "Entrada: 1 ingresso por jogo", betWithPoints: "Aposte apenas com Pontos",
    winnerGets: "Vencedor recebe +300 XP", loserGets: "Perdedor recebe +80 XP",
    noOpponentBot: "Sem oponente em 60s? Bot entra automaticamente",
    findOpponent: "ENCONTRAR OPONENTE", noTickets: "Sem ingressos!", notEnoughPoints: "Pontos insuficientes",
    setYourBet: "Defina sua aposta (Pontos)", yourPoints: "Seus Pontos",
    entryCost: "Custo de entrada", yourTickets: "Seus Ingressos",
    findingOpponent: "Procurando oponente...", botJoinsIn: "Bot entra em",
    searchingPlayers: "Procurando jogadores...", yourTurn: "Sua vez", botsTurn: "Vez do bot...",
    roll: "JOGAR", youWin: "VOCÊ GANHOU! 🎉", botWins: "Bot venceu!",
    backToGames: "VOLTAR AOS JOGOS", rollTheDice: "Jogue o dado!",
    typeMessage: "Digite uma mensagem...", reachLevel: "Alcance",
    toUnlockRoom: "para desbloquear esta sala", yourCurrentLevel: "Seu nível atual",
    room: "Sala",
    eachDayJoin: "Cada dia te aproxima", closerToFew: "de onde poucos chegam.",
    mysteryReward: "RECOMPENSA MISTERIOSA", bronzeChest: "Baú de Bronze",
    silverChest: "Baú de Prata", goldChest: "Baú de Ouro",
    level: "Nível", elite: "Elite", legend: "Lenda",
    aiTarotReading: "Leitura Tarot IA", selectCardReveal: "Escolha uma carta para revelar seu destino",
    ticketsRemaining: "ingressos restantes", readAgain: "Ler novamente",
    noTarotTickets: "Sem ingressos de tarot.",
    spinOrPurchase: "Gire a roda ou compre um livro!",
    card: "Carta", language: "Idioma", selectLanguage: "Selecionar idioma",
    drawProgress: "Progresso", drawActive: "Ativo", drawComplete: "Completo", towardsDraw: "para o sorteio",
    participants: "Participantes", totalEntries: "Total de entradas", prize: "Prêmio", howToEnter: "Como participar",
    buyBook: "Compre qualquer pacote de livro", autoEntered: "Você é inscrito automaticamente",
    moreBooks: "Mais compras = mais chances", winnerSelected: "Vencedor selecionado em 100%",
    recentEntries: "Entradas recentes", pastWinners: "Vencedores anteriores", enterDraw: "PARTICIPAR",
    drawWinner: "Vencedor", wonPrize: "Ganhou o prêmio", congratulations: "Parabéns",
    newDraw: "NOVO SORTEIO", drawDescription: "Compre livros para o sorteio de $500!", draw: "Sorteio",
    login: "Entrar", signup: "Cadastrar", loginSubtitle: "Bem-vindo ao WINLINE", signupSubtitle: "Crie sua conta", displayName: "Nome de exibição", email: "Email", password: "Senha", passwordMinLength: "A senha deve ter pelo menos 6 caracteres", welcomeBack: "Bem-vindo de volta!", accountCreated: "Conta criada com sucesso!", logout: "Sair",
    scratchCard: "Raspadinha", scratchCardDesc: "Raspe para revelar seu prêmio!", scratchToReveal: "Raspe o cartão", scratchArea: "Raspe aqui!", youRevealed: "Você revelou", claimReward: "RESGATAR", tryAnotherCard: "OUTRO CARTÃO", noReward: "Mais sorte na próxima!", scratchCardCost: "1 Ingresso de jogo",
    profile: "Perfil", loginToViewProfile: "Entre para ver seu perfil", inventory: "Inventário", settings: "Configurações", clearData: "Limpar dados", photoUpdated: "Foto atualizada!", nameUpdated: "Nome atualizado!", dataCleared: "Dados limpos!",
    drawExtended: "Sorteio estendido", drawExtendedMessage: "O sorteio foi estendido devido à alta demanda. Todas as participações permanecem ativas.", nextDrawIn: "Próximo sorteio em", fairDrawSystem: "Sistema de sorteio justo", fairDrawDescription: "O vencedor é selecionado aleatoriamente entre todas as participações. Cada participação tem a mesma chance de ganhar.", winnerAnnounced: "Vencedor anunciado!", won: "Ganhou", enterTheDraw: "Participar do sorteio de $500", giftCardDraw: "Sorteio cartão presente $500", drawCloseInfo: "O sorteio será encerrado quando o progresso atingir 100% ou quando a contagem regressiva terminar.", getUniqueEntry: "Receba um número de entrada único #ID", premiumTwoEntries: "Pacote Premium = 2 Entradas!", randomPicksWinner: "Um número aleatório escolhe o vencedor!", yourEntries: "Suas participações",
    drawMainTitle: "Compre um livro e participe do sorteio para ganhar um cartão presente de $500", drawSubtitle: "Cada compra elegível dá uma chance de participar do sorteio. O Pacote Premium dá 2 entradas.", drawClosingCondition: "O sorteio se encerra quando o lote elegível é completado ou quando o período da campanha termina.", buyAndEnter: "Compre e participe", howItWorks: "Como funciona", howStep1: "Compre qualquer pacote de livros", howStep2: "Você recebe uma chance de entrada", howStep3: "Premium = 2 entradas", howStep4: "O vencedor é selecionado aleatoriamente ao encerrar o sorteio", moreInfo: "Mais informações", moreInfo1: "O sorteio é promocional", moreInfo2: "As entradas são concedidas com base no pacote comprado", moreInfo3: "O vencedor é selecionado por um sistema de sorteio justo", moreInfo4: "A campanha está sujeita a termos e condições", yourCurrentEntries: "Suas entradas atuais",
    duelRPS: "✊✋✌️ Desafio Pedra Papel Tesoura", duelSearching: "🔍 Procurando jogador...", duelSendingInvites: "Enviando convites para jogadores disponíveis", duelFoundOpponent: "⚡ Oponente encontrado! Prepare-se... ⚡", duelChooseWinner: "🎯 Escolha o vencedor!", duelVoteBefore: "Vote antes do desafio começar", duelYourVote: "✓ Seu voto", duelLiveVote: "📊 Porcentagem de voto ao vivo", duelRound: "Rodada", duelChooseMove: "Escolha seu movimento!", duelVs: "contra", duelRockPaperScissors: "⚡ Pedra... Papel... Tesoura!", duelDraw: "🤝 Empate! Repetindo rodada...", duelWonRound: "ganhou a rodada!", duelIsWinner: "é o vencedor!", duelScore: "Placar", duelVoteCorrect: "🎉 Seu voto estava certo!", duelVoteWrong: "😔 Seu voto estava errado", duelDidntVote: "Você não votou", duelDone: "Feito ✓", duelRock: "Pedra", duelPaper: "Papel", duelScissors: "Tesoura",
    worldChallengeTitle: "⚔️ Desafio Mundial", worldChallengeDesc: "Compre o livro digital para uma tentativa e desbloqueie um desafio exclusivo na sala Mundo!", worldChallengePurchased: "🎉 Compra realizada!", worldChallengeUnlockedMsg: "Um desafio está desbloqueado na sala Mundo!", worldBookExclusive: "Livro digital exclusivo", worldOneChallenge: "Um desafio por compra na sala Mundo", worldNameShown: "Seu nome aparece como campeão do desafio", worldGameTicket: "🎮 Um ingresso de jogo", worldDrawEntry: "🎟️ Uma entrada no sorteio", worldPerBook: "/ livro digital", worldBuyBook: "📖 Compre o livro e desbloqueie o desafio", worldAfterChallenge: "* Após o desafio, ele bloqueia imediatamente e requer uma nova compra", worldLockMsg: "🔒 Compre o livro para desbloquear o desafio Mundial",
    systemChampion: "Campeão", systemNewLegend: "Nova lenda da sala! Quem ousa desafiá-lo?", systemWhoChallenge: "ganhou o desafio contra", welcomeMsg: "Olá", welcomeLitRoom: "Você iluminou a sala",
    winlineDailySpin: "GIRO DIÁRIO WINLINE", winGiftCard: "Ganhe um cartão presente de $500", spinTheWheelBtn: "🎰 GIRAR A RODA", comeBackSpin: "Volte amanhã para seu próximo giro", dailySpinReward: "PRÊMIO DO GIRO DIÁRIO", nextFreeSpin: "PRÓXIMO GIRO GRÁTIS", freeSpinAvailable: "Você tem um giro grátis!", betterLuckNextTime: "Mais sorte na próxima!", wonAmazingReward: "Você ganhou uma recompensa incrível!", addedToAccount: "Adicionado à sua conta", tryAgainTomorrow: "Tente novamente amanhã", awesomeBtn: "Incrível! 🎉", comeBackTomorrowChance: "Volte amanhã para outra chance!", shopHeroTitle: "Compre um livro digital e\nparticipe do sorteio de $500", shopHeroSubtitle: "Cada compra dá recompensas e uma chance de ganhar $500.", chooseBookPack: "Escolha seu pacote", basicPack: "Pacote Básico", plusPack: "Pacote Plus", premiumPack: "Pacote Premium", bestValueTag: "Melhor valor", includesLabel: "Inclui:", digitalBook: "Livro digital", buyForPrice: "Comprar por", shopDisclaimer2: "Recompensas e entradas no sorteio são bônus promocionais.", purchasedToast: "comprado!", chooseGiftCardPrize: "Escolha seu cartão presente", winBadge: "GANHE $500", confirmPurchaseTitle: "Confirmar compra", youWillReceive: "Você receberá:", confirmPurchaseBtn: "Confirmar compra", male: "Masculino", female: "Feminino", playerYou: "Você", botPlayer: "Bot 🤖", needsExactRoll: "precisa de lançamento exato!", revealRewardNow: "Revelar agora", scratchWinTypes: "Pontos, XP, Ingressos", madamZaraTitle: "Madam Zara — Tarot", mysteryReaderLabel: "Leitora mística", startTarotBtn: "Iniciar sessão de Tarot", noTicketsTarot: "Sem ingressos. Gire a roda ou compre na loja", selectCardsHeart: "Selecione cartas do coração", tapAnyCard: "Toque em qualquer carta para selecioná-la", revealReadTarot: "Revelar e ler Tarot", askMadamZara: "Pergunte à Madam Zara...", liveLabel: "Ao vivo", bonusEntriesLabel: "Entradas extras",
    seg_xp50: "50\nXP", seg_tryAgain: "Tente\nnovamente", seg_surprise: "Presente\nSurpresa", seg_gameTicket: "Ingresso\nJogo", seg_pointsXp: "15 Pts\n+50 XP", seg_xp100: "100\nXP", seg_tarotTicket: "Ingresso\nTarot", seg_ticketCombo: "Jogo &\nTarot",
    reward_xp50: "50 XP", reward_xp100: "100 XP", reward_gameTicket: "Ingresso Jogo", reward_tarotTicket: "Ingresso Tarot", reward_ticketCombo: "Ingresso Jogo & Tarot", reward_pointsXp: "15 Pontos + 50 XP", reward_surprise: "Presente Surpresa", reward_tryAgain: "Tente novamente",
    welcomeTitle: "Bem-vindo ao Winline! ✨", welcomeMessage: "Sou Madam Zara, sua guia mística. Gire a roda, jogue e ganhe prêmios incríveis. Que a magia comece!", welcomeButton: "Vamos lá! 🎉",
    xpRainTitle: "CHUVA DE XP", xpRainCollected: "Coletado", xpRainOver: "Chuva de XP acabou!", xpRainYouGot: "Você coletou", xpRainAddedToAccount: "Adicionado aos seus XP!", xpRainStarting: "⚡ Chuva de XP em 3 segundos! Prepare-se! ⚡", xpRainAnnounce: "coletou"
  },
  ru: {
    home: "Главная", shop: "Магазин", games: "Игры", chat: "Чат", crown: "Корона", cards: "Карты",
    giftCard: "Подарочная карта $500", promotionalDraw: "ПРОМО РОЗЫГРЫШ", dailySpin: "ЕЖЕДНЕВНОЕ ВРАЩЕНИЕ",
    oneFreeAttempt: "У вас ОДНА БЕСПЛАТНАЯ ПОПЫТКА сегодня!", nextSpinIn: "Следующее бесплатное вращение через:",
    hours: "ЧАСЫ", minutes: "МИНУТЫ", seconds: "СЕКУНДЫ",
    xpPoints: "Очки XP", gameTickets: "Игровые билеты", extraEntries: "Доп. входы", surpriseRewards: "Сюрпризы",
    allRewardsPromotional: "Все награды являются промо", noCashValue: "Без денежной стоимости",
    spinNow: "КРУТИТЬ", spinning: "ВРАЩЕНИЕ...", comeBackTomorrow: "ПРИХОДИТЕ ЗАВТРА",
    youWon: "Вы выиграли!", maybeLater: "МОЖЕТ ПОЗЖЕ",
    extraChance: "Доп. шанс", drawEntry: "Вход в розыгрыш", tryAgain: "Попробовать снова",
    gameTicket: "Игровой билет", surpriseReward: "Сюрприз",
    selectBookExperience: "Выберите книгу", inOur: "в нашем",
    bookPurchaseDraw: "Розыгрыш при покупке книг", mostPopular: "САМЫЙ ПОПУЛЯРНЫЙ",
    vipXP: "VIP XP", tarotTicket: "Билет Таро", entry: "ВХОД", value: "ЦЕННОСТЬ",
    purchasesProvideAccess: "Покупки дают доступ к цифровым книгам.",
    bonusFeatures: "Бонусы — промо награды в комплекте.",
    availableGames: "Доступные игры", snakeAndLadder: "Змеи и Лестницы",
    classicBoardGame: "Классическая настольная игра • PvP или vs Бот",
    tapFrenzy: "Tap Frenzy", tapAsFast: "Нажимайте как можно быстрее!",
    memoryMatch: "Memory Match", matchHiddenCards: "Найдите пары",
    comingSoon: "Скоро", ticket: "Билет", gameRules: "Правила игры",
    entryTicket: "Вход: 1 билет за игру", betWithPoints: "Ставки только Очками",
    winnerGets: "Победитель получает +300 XP", loserGets: "Проигравший получает +80 XP",
    noOpponentBot: "Нет соперника за 60с? Бот присоединится",
    findOpponent: "НАЙТИ СОПЕРНИКА", noTickets: "Нет билетов!", notEnoughPoints: "Недостаточно очков",
    setYourBet: "Установите ставку (Очки)", yourPoints: "Ваши Очки",
    entryCost: "Стоимость входа", yourTickets: "Ваши Билеты",
    findingOpponent: "Поиск соперника...", botJoinsIn: "Бот присоединится через",
    searchingPlayers: "Поиск игроков...", yourTurn: "Ваш ход", botsTurn: "Ход бота...",
    roll: "БРОСИТЬ", youWin: "ВЫ ВЫИГРАЛИ! 🎉", botWins: "Бот победил!",
    backToGames: "НАЗАД К ИГРАМ", rollTheDice: "Бросьте кости!",
    typeMessage: "Введите сообщение...", reachLevel: "Достигните",
    toUnlockRoom: "чтобы открыть эту комнату", yourCurrentLevel: "Ваш текущий уровень",
    room: "Комната",
    eachDayJoin: "Каждый день приближает вас", closerToFew: "туда, куда доходят немногие.",
    mysteryReward: "ТАЙНАЯ НАГРАДА", bronzeChest: "Бронзовый сундук",
    silverChest: "Серебряный сундук", goldChest: "Золотой сундук",
    level: "Уровень", elite: "Элита", legend: "Легенда",
    aiTarotReading: "ИИ Таро", selectCardReveal: "Выберите карту, чтобы узнать судьбу",
    ticketsRemaining: "билетов осталось", readAgain: "Читать снова",
    noTarotTickets: "Нет билетов Таро.",
    spinOrPurchase: "Крутите колесо или купите книгу!",
    card: "Карта", language: "Язык", selectLanguage: "Выберите язык",
    drawProgress: "Прогресс", drawActive: "Активен", drawComplete: "Завершен", towardsDraw: "к розыгрышу",
    participants: "Участники", totalEntries: "Всего записей", prize: "Приз", howToEnter: "Как участвовать",
    buyBook: "Купите любой пакет книг", autoEntered: "Вы автоматически участвуете",
    moreBooks: "Больше покупок = больше шансов", winnerSelected: "Победитель выбирается при 100%",
    recentEntries: "Последние записи", pastWinners: "Прошлые победители", enterDraw: "УЧАСТВОВАТЬ",
    drawWinner: "Победитель", wonPrize: "Выиграл приз", congratulations: "Поздравляем",
    newDraw: "НОВЫЙ РОЗЫГРЫШ", drawDescription: "Покупайте книги для розыгрыша $500!", draw: "Розыгрыш",
    login: "Войти", signup: "Регистрация", loginSubtitle: "Добро пожаловать в WINLINE", signupSubtitle: "Создайте аккаунт", displayName: "Имя", email: "Эл. почта", password: "Пароль", passwordMinLength: "Пароль должен быть не менее 6 символов", welcomeBack: "С возвращением!", accountCreated: "Аккаунт создан!", logout: "Выйти",
    scratchCard: "Скретч-карта", scratchCardDesc: "Сотрите, чтобы узнать приз!", scratchToReveal: "Сотрите карту", scratchArea: "Сотрите здесь!", youRevealed: "Вы открыли", claimReward: "ПОЛУЧИТЬ", tryAnotherCard: "ДРУГАЯ КАРТА", noReward: "Повезёт в следующий раз!", scratchCardCost: "1 Игровой билет",
    profile: "Профиль", loginToViewProfile: "Войдите, чтобы увидеть профиль", inventory: "Инвентарь", settings: "Настройки", clearData: "Очистить данные", photoUpdated: "Фото обновлено!", nameUpdated: "Имя обновлено!", dataCleared: "Данные очищены!",
    drawExtended: "Розыгрыш продлён", drawExtendedMessage: "Розыгрыш был продлён из-за высокого спроса. Все участия остаются действительными.", nextDrawIn: "Следующий розыгрыш через", fairDrawSystem: "Честная система розыгрыша", fairDrawDescription: "Победитель выбирается случайным образом из всех участий. Каждое участие имеет равные шансы на выигрыш.", winnerAnnounced: "Победитель объявлен!", won: "Выиграл", enterTheDraw: "Участвовать в розыгрыше $500", giftCardDraw: "Розыгрыш подарочной карты $500", drawCloseInfo: "Розыгрыш завершится, когда прогресс достигнет 100% или когда истечёт обратный отсчёт.", getUniqueEntry: "Получите уникальный номер входа #ID", premiumTwoEntries: "Премиум пакет = 2 Входа!", randomPicksWinner: "Случайное число выбирает победителя!", yourEntries: "Ваши участия",
    drawMainTitle: "Купите книгу и участвуйте в розыгрыше подарочной карты на $500", drawSubtitle: "Каждая подходящая покупка даёт вам шанс участвовать в розыгрыше. Премиум пакет даёт 2 входа.", drawClosingCondition: "Розыгрыш завершается, когда набирается нужное количество участий или по окончании кампании.", buyAndEnter: "Купить и участвовать", howItWorks: "Как это работает", howStep1: "Купите любой пакет книг", howStep2: "Вы получаете шанс на вход", howStep3: "Премиум = 2 входа", howStep4: "Победитель выбирается случайно при закрытии розыгрыша", moreInfo: "Подробнее", moreInfo1: "Розыгрыш является рекламной акцией", moreInfo2: "Входы предоставляются в зависимости от купленного пакета", moreInfo3: "Победитель выбирается через честную систему розыгрыша", moreInfo4: "Кампания подлежит условиям и положениям", yourCurrentEntries: "Ваши текущие участия",
    duelRPS: "✊✋✌️ Дуэль Камень Ножницы Бумага", duelSearching: "🔍 Поиск игрока...", duelSendingInvites: "Отправка приглашений доступным игрокам", duelFoundOpponent: "⚡ Противник найден! Готовься... ⚡", duelChooseWinner: "🎯 Выбери победителя!", duelVoteBefore: "Проголосуй до начала дуэли", duelYourVote: "✓ Твой голос", duelLiveVote: "📊 Процент голосов в реальном времени", duelRound: "Раунд", duelChooseMove: "Выбери свой ход!", duelVs: "против", duelRockPaperScissors: "⚡ Камень... Ножницы... Бумага!", duelDraw: "🤝 Ничья! Повтор раунда...", duelWonRound: "выиграл раунд!", duelIsWinner: "победитель!", duelScore: "Счёт", duelVoteCorrect: "🎉 Твой голос был правильным!", duelVoteWrong: "😔 Твой голос был неправильным", duelDidntVote: "Ты не проголосовал", duelDone: "Готово ✓", duelRock: "Камень", duelPaper: "Бумага", duelScissors: "Ножницы",
    worldChallengeTitle: "⚔️ Мировой дуэль", worldChallengeDesc: "Купите цифровую книгу для одной попытки и разблокируйте эксклюзивный дуэль в комнате Мир!", worldChallengePurchased: "🎉 Покупка успешна!", worldChallengeUnlockedMsg: "Один дуэль разблокирован в комнате Мир!", worldBookExclusive: "Эксклюзивная цифровая книга", worldOneChallenge: "Один дуэль за покупку в комнате Мир", worldNameShown: "Ваше имя отображается как чемпион дуэли", worldGameTicket: "🎮 Один игровой билет", worldDrawEntry: "🎟️ Один вход в розыгрыш", worldPerBook: "/ цифровая книга", worldBuyBook: "📖 Купить книгу и разблокировать дуэль", worldAfterChallenge: "* После дуэли он сразу блокируется и требует новой покупки", worldLockMsg: "🔒 Купите книгу, чтобы разблокировать Мировой дуэль",
    systemChampion: "Чемпион", systemNewLegend: "Новая легенда комнаты! Кто осмелится бросить вызов?", systemWhoChallenge: "выиграл дуэль против", welcomeMsg: "Привет", welcomeLitRoom: "Вы осветили комнату",
    winlineDailySpin: "ЕЖЕДНЕВНОЕ ВРАЩЕНИЕ WINLINE", winGiftCard: "Выиграйте подарочную карту $500", spinTheWheelBtn: "🎰 КРУТИТЬ КОЛЕСО", comeBackSpin: "Приходите завтра за следующим вращением", dailySpinReward: "ЕЖЕДНЕВНАЯ НАГРАДА", nextFreeSpin: "СЛЕДУЮЩЕЕ БЕСПЛАТНОЕ ВРАЩЕНИЕ", freeSpinAvailable: "У вас есть одно бесплатное вращение!", betterLuckNextTime: "Повезёт в следующий раз!", wonAmazingReward: "Вы выиграли потрясающую награду!", addedToAccount: "Добавлено на ваш счёт", tryAgainTomorrow: "Попробуйте завтра", awesomeBtn: "Круто! 🎉", comeBackTomorrowChance: "Приходите завтра за новой попыткой!", shopHeroTitle: "Купите цифровую книгу и\nучаствуйте в розыгрыше $500", shopHeroSubtitle: "Каждая покупка даёт награды и шанс выиграть $500.", chooseBookPack: "Выберите пакет книг", basicPack: "Базовый пакет", plusPack: "Пакет Плюс", premiumPack: "Премиум пакет", bestValueTag: "Лучшая цена", includesLabel: "Включает:", digitalBook: "Цифровая книга", buyForPrice: "Купить за", shopDisclaimer2: "Игровые награды и записи — промо бонусы.", purchasedToast: "куплено!", chooseGiftCardPrize: "Выберите подарочную карту", winBadge: "ВЫИГРАТЬ $500", confirmPurchaseTitle: "Подтвердить покупку", youWillReceive: "Вы получите:", confirmPurchaseBtn: "Подтвердить покупку", male: "Мужской", female: "Женский", playerYou: "Вы", botPlayer: "Бот 🤖", needsExactRoll: "нужен точный бросок!", revealRewardNow: "Показать сейчас", scratchWinTypes: "Очки, XP, Билеты", madamZaraTitle: "Мадам Зара — Таро", mysteryReaderLabel: "Таинственная читательница", startTarotBtn: "Начать сеанс Таро", noTicketsTarot: "Нет билетов. Крутите колесо или купите в магазине", selectCardsHeart: "Выберите карты сердцем", tapAnyCard: "Нажмите на карту для выбора", revealReadTarot: "Открыть и читать Таро", askMadamZara: "Спросите Мадам Зару...", liveLabel: "Прямой эфир", bonusEntriesLabel: "Доп. входы",
    seg_xp50: "50\nXP", seg_tryAgain: "Ещё\nраз", seg_surprise: "Сюрприз", seg_gameTicket: "Билет\nИгры", seg_pointsXp: "15 Очк\n+50 XP", seg_xp100: "100\nXP", seg_tarotTicket: "Билет\nТаро", seg_ticketCombo: "Игра &\nТаро",
    reward_xp50: "50 XP", reward_xp100: "100 XP", reward_gameTicket: "Билет Игры", reward_tarotTicket: "Билет Таро", reward_ticketCombo: "Билет Игры & Таро", reward_pointsXp: "15 Очков + 50 XP", reward_surprise: "Сюрприз", reward_tryAgain: "Ещё раз",
    welcomeTitle: "Добро пожаловать в Winline! ✨", welcomeMessage: "Я Мадам Зара, ваш мистический проводник. Крутите колесо, играйте и выигрывайте потрясающие призы. Пусть начнётся магия!", welcomeButton: "Поехали! 🎉",
    xpRainTitle: "ДОЖДЬ XP", xpRainCollected: "Собрано", xpRainOver: "Дождь XP окончен!", xpRainYouGot: "Вы собрали", xpRainAddedToAccount: "Добавлено к вашим XP!", xpRainStarting: "⚡ Дождь XP через 3 секунды! Приготовьтесь! ⚡", xpRainAnnounce: "собрал"
  },
  hi: {
    home: "होम", shop: "दुकान", games: "खेल", chat: "चैट", crown: "क्राउन", cards: "कार्ड्स",
    giftCard: "$500 गिफ्ट कार्ड", promotionalDraw: "प्रमोशनल ड्रॉ", dailySpin: "दैनिक स्पिन",
    oneFreeAttempt: "आज आपके पास एक मुफ्त प्रयास है!", nextSpinIn: "अगला मुफ्त स्पिन उपलब्ध होगा:",
    hours: "घंटे", minutes: "मिनट", seconds: "सेकंड",
    xpPoints: "XP अंक", gameTickets: "गेम टिकट", extraEntries: "अतिरिक्त प्रवेश", surpriseRewards: "सरप्राइज़",
    allRewardsPromotional: "सभी पुरस्कार प्रमोशनल हैं", noCashValue: "कोई नकद मूल्य नहीं",
    spinNow: "स्पिन करें", spinning: "घूम रहा है...", comeBackTomorrow: "कल वापस आएं",
    youWon: "आपने जीता!", maybeLater: "बाद में",
    extraChance: "अतिरिक्त मौका", drawEntry: "ड्रॉ प्रवेश", tryAgain: "पुनः प्रयास",
    gameTicket: "गेम टिकट", surpriseReward: "सरप्राइज़ पुरस्कार",
    selectBookExperience: "अपना पुस्तक अनुभव चुनें", inOur: "हमारे",
    bookPurchaseDraw: "पुस्तक खरीद ड्रॉ", mostPopular: "सबसे लोकप्रिय",
    vipXP: "VIP XP", tarotTicket: "टैरो टिकट", entry: "प्रवेश", value: "मूल्य",
    purchasesProvideAccess: "खरीदारी डिजिटल पुस्तकों तक पहुंच प्रदान करती है।",
    bonusFeatures: "बोनस सुविधाएं प्रचार पुरस्कार हैं।",
    availableGames: "उपलब्ध खेल", snakeAndLadder: "सांप और सीढ़ी",
    classicBoardGame: "क्लासिक बोर्ड गेम • PvP या बॉट के खिलाफ",
    tapFrenzy: "टैप फ्रेंज़ी", tapAsFast: "जितनी तेज़ हो सके टैप करें!",
    memoryMatch: "मेमोरी मैच", matchHiddenCards: "छुपे कार्ड मिलाएं",
    comingSoon: "जल्द आ रहा है", ticket: "टिकट", gameRules: "खेल के नियम",
    entryTicket: "प्रवेश: प्रति गेम 1 टिकट", betWithPoints: "केवल अंकों से दांव लगाएं",
    winnerGets: "विजेता को +300 XP मिलता है", loserGets: "हारने वाले को +80 XP",
    noOpponentBot: "60s में कोई प्रतिद्वंद्वी नहीं? बॉट आता है",
    findOpponent: "प्रतिद्वंद्वी खोजें", noTickets: "कोई टिकट नहीं!", notEnoughPoints: "अपर्याप्त अंक",
    setYourBet: "अपना दांव सेट करें (अंक)", yourPoints: "आपके अंक",
    entryCost: "प्रवेश लागत", yourTickets: "आपके टिकट",
    findingOpponent: "प्रतिद्वंद्वी खोज रहे हैं...", botJoinsIn: "बॉट शामिल होगा",
    searchingPlayers: "खिलाड़ी खोज रहे हैं...", yourTurn: "आपकी बारी", botsTurn: "बॉट की बारी...",
    roll: "फेंकें", youWin: "आप जीते! 🎉", botWins: "बॉट जीता!",
    backToGames: "खेलों पर वापस", rollTheDice: "पासा फेंकें!",
    typeMessage: "संदेश लिखें...", reachLevel: "पहुंचें",
    toUnlockRoom: "इस कमरे को खोलने के लिए", yourCurrentLevel: "आपका वर्तमान स्तर",
    room: "कमरा",
    eachDayJoin: "हर दिन आपको करीब लाता है", closerToFew: "जहां कुछ ही पहुंचते हैं।",
    mysteryReward: "रहस्य पुरस्कार", bronzeChest: "कांस्य संदूक",
    silverChest: "रजत संदूक", goldChest: "स्वर्ण संदूक",
    level: "स्तर", elite: "एलीट", legend: "लीजेंड",
    aiTarotReading: "AI टैरो रीडिंग", selectCardReveal: "अपना भाग्य जानने के लिए कार्ड चुनें",
    ticketsRemaining: "टिकट शेष", readAgain: "फिर से पढ़ें",
    noTarotTickets: "कोई टैरो टिकट उपलब्ध नहीं।",
    spinOrPurchase: "व्हील घुमाएं या टिकट कमाने के लिए पुस्तक खरीदें!",
    card: "कार्ड", language: "भाषा", selectLanguage: "भाषा चुनें",
    drawProgress: "ड्रॉ प्रगति", drawActive: "सक्रिय", drawComplete: "पूर्ण", towardsDraw: "ड्रॉ की ओर",
    participants: "प्रतिभागी", totalEntries: "कुल प्रविष्टियाँ", prize: "पुरस्कार", howToEnter: "कैसे भाग लें",
    buyBook: "कोई भी पुस्तक पैकेज खरीदें", autoEntered: "आप स्वचालित रूप से दर्ज हो जाते हैं",
    moreBooks: "अधिक खरीद = अधिक मौके", winnerSelected: "100% पर विजेता चुना जाता है",
    recentEntries: "हाल की प्रविष्टियाँ", pastWinners: "पिछले विजेता", enterDraw: "ड्रॉ में भाग लें",
    drawWinner: "विजेता", wonPrize: "पुरस्कार जीता", congratulations: "बधाई",
    newDraw: "नया ड्रॉ", drawDescription: "$500 गिफ्ट कार्ड ड्रॉ के लिए पुस्तकें खरीदें!", draw: "ड्रॉ",
    login: "लॉगिन", signup: "साइन अप", loginSubtitle: "WINLINE में आपका स्वागत है", signupSubtitle: "अपना खाता बनाएं", displayName: "प्रदर्शन नाम", email: "ईमेल", password: "पासवर्ड", passwordMinLength: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए", welcomeBack: "वापस स्वागत है!", accountCreated: "खाता सफलतापूर्वक बनाया गया!", logout: "लॉगआउट",
    scratchCard: "स्क्रैच कार्ड", scratchCardDesc: "इनाम जानने के लिए खरोंचें!", scratchToReveal: "कार्ड खरोंचें", scratchArea: "यहाँ खरोंचें!", youRevealed: "आपने पाया", claimReward: "इनाम लें", tryAnotherCard: "दूसरा कार्ड", noReward: "अगली बार किस्मत आज़माएं!", scratchCardCost: "1 गेम टिकट",
    profile: "प्रोफ़ाइल", loginToViewProfile: "अपना प्रोफ़ाइल देखने के लिए लॉगिन करें", inventory: "सामग्री", settings: "सेटिंग्स", clearData: "डेटा साफ़ करें", photoUpdated: "फ़ोटो अपडेट हुई!", nameUpdated: "नाम अपडेट हुआ!", dataCleared: "डेटा साफ़ हुआ!",
    drawExtended: "ड्रॉ बढ़ाया गया", drawExtendedMessage: "उच्च मांग के कारण ड्रॉ बढ़ा दिया गया है। सभी प्रविष्टियाँ सक्रिय रहती हैं।", nextDrawIn: "अगला ड्रॉ", fairDrawSystem: "निष्पक्ष ड्रॉ प्रणाली", fairDrawDescription: "विजेता को सुरक्षित यादृच्छिक जनरेटर का उपयोग करके सभी प्रविष्टियों में से यादृच्छिक रूप से चुना जाता है। हर प्रविष्टि को जीतने का समान मौका है।", winnerAnnounced: "विजेता की घोषणा!", won: "जीता", enterTheDraw: "$500 ड्रॉ में भाग लें", giftCardDraw: "$500 गिफ्ट कार्ड ड्रॉ", drawCloseInfo: "ड्रॉ तब बंद होगा जब प्रगति 100% तक पहुंच जाए या काउंटडाउन समाप्त हो जाए।", getUniqueEntry: "एक अद्वितीय प्रवेश #ID प्राप्त करें", premiumTwoEntries: "प्रीमियम पैक = 2 प्रवेश!", randomPicksWinner: "यादृच्छिक संख्या विजेता चुनती है!", yourEntries: "आपकी प्रविष्टियाँ",
    drawMainTitle: "एक किताब खरीदें और $500 गिफ्ट कार्ड जीतने के लिए ड्रॉ में भाग लें", drawSubtitle: "हर योग्य खरीदारी आपको ड्रॉ में भाग लेने का मौका देती है। प्रीमियम पैक आपको 2 प्रवेश देता है।", drawClosingCondition: "ड्रॉ तब समाप्त होता है जब योग्य बैच पूरा हो जाता है या अभियान की अवधि समाप्त हो जाती है।", buyAndEnter: "खरीदें और भाग लें", howItWorks: "यह कैसे काम करता है", howStep1: "कोई भी किताब पैकेज खरीदें", howStep2: "आपको एक प्रवेश का मौका मिलता है", howStep3: "प्रीमियम = 2 प्रवेश", howStep4: "ड्रॉ बंद होने पर विजेता यादृच्छिक रूप से चुना जाता है", moreInfo: "अधिक जानकारी", moreInfo1: "ड्रॉ प्रमोशनल है", moreInfo2: "प्रवेश खरीदे गए पैकेज के अनुसार दिए जाते हैं", moreInfo3: "विजेता निष्पक्ष ड्रॉ प्रणाली के माध्यम से चुना जाता है", moreInfo4: "अभियान नियम और शर्तों के अधीन है", yourCurrentEntries: "आपकी वर्तमान प्रविष्टियाँ",
    duelRPS: "✊✋✌️ पत्थर कागज कैंची चुनौती", duelSearching: "🔍 खिलाड़ी खोज रहे हैं...", duelSendingInvites: "उपलब्ध खिलाड़ियों को निमंत्रण भेज रहे हैं", duelFoundOpponent: "⚡ प्रतिद्वंद्वी मिल गया! तैयार हो जाओ... ⚡", duelChooseWinner: "🎯 विजेता चुनो!", duelVoteBefore: "चुनौती शुरू होने से पहले वोट करो", duelYourVote: "✓ आपका वोट", duelLiveVote: "📊 लाइव वोट प्रतिशत", duelRound: "राउंड", duelChooseMove: "अपनी चाल चुनो!", duelVs: "बनाम", duelRockPaperScissors: "⚡ पत्थर... कागज... कैंची!", duelDraw: "🤝 बराबरी! राउंड दोहराया जा रहा है...", duelWonRound: "ने राउंड जीता!", duelIsWinner: "विजेता है!", duelScore: "स्कोर", duelVoteCorrect: "🎉 आपका वोट सही था!", duelVoteWrong: "😔 आपका वोट गलत था", duelDidntVote: "आपने वोट नहीं किया", duelDone: "हो गया ✓", duelRock: "पत्थर", duelPaper: "कागज", duelScissors: "कैंची",
    worldChallengeTitle: "⚔️ विश्व चुनौती", worldChallengeDesc: "एक प्रयास के लिए डिजिटल किताब खरीदें और विश्व कक्ष में एक विशेष चुनौती अनलॉक करें!", worldChallengePurchased: "🎉 खरीदारी सफल!", worldChallengeUnlockedMsg: "विश्व कक्ष में एक चुनौती अनलॉक हो गई!", worldBookExclusive: "विशेष डिजिटल किताब", worldOneChallenge: "विश्व कक्ष में प्रति खरीद एक चुनौती", worldNameShown: "आपका नाम चुनौती चैंपियन के रूप में दिखाई देता है", worldGameTicket: "🎮 एक गेम टिकट", worldDrawEntry: "🎟️ एक ड्रॉ प्रवेश", worldPerBook: "/ डिजिटल किताब", worldBuyBook: "📖 किताब खरीदें और चुनौती अनलॉक करें", worldAfterChallenge: "* चुनौती के बाद, यह तुरंत लॉक हो जाता है और नई खरीदारी की आवश्यकता होती है", worldLockMsg: "🔒 विश्व चुनौती अनलॉक करने के लिए किताब खरीदें",
    systemChampion: "चैंपियन", systemNewLegend: "कमरे की नई किंवदंती! कौन चुनौती देने की हिम्मत करता है?", systemWhoChallenge: "ने चुनौती जीती", welcomeMsg: "नमस्ते", welcomeLitRoom: "आपने कमरा रोशन कर दिया",
    winlineDailySpin: "WINLINE दैनिक स्पिन", winGiftCard: "$500 गिफ्ट कार्ड जीतें", spinTheWheelBtn: "🎰 व्हील घुमाएं", comeBackSpin: "अगले स्पिन के लिए कल आएं", dailySpinReward: "दैनिक स्पिन पुरस्कार", nextFreeSpin: "अगला मुफ्त स्पिन", freeSpinAvailable: "आपके पास एक मुफ्त स्पिन है!", betterLuckNextTime: "अगली बार किस्मत आज़माएं!", wonAmazingReward: "आपने एक शानदार पुरस्कार जीता!", addedToAccount: "आपके खाते में जोड़ा गया", tryAgainTomorrow: "कल फिर से प्रयास करें", awesomeBtn: "बढ़िया! 🎉", comeBackTomorrowChance: "दूसरे मौके के लिए कल आएं!", shopHeroTitle: "एक डिजिटल किताब खरीदें और\n$500 ड्रॉ में भाग लें", shopHeroSubtitle: "हर खरीदारी आपको पुरस्कार और $500 जीतने का मौका देती है।", chooseBookPack: "अपना पैकेज चुनें", basicPack: "बेसिक पैक", plusPack: "प्लस पैक", premiumPack: "प्रीमियम पैक", bestValueTag: "सर्वोत्तम मूल्य", includesLabel: "शामिल है:", digitalBook: "डिजिटल किताब", buyForPrice: "खरीदें", shopDisclaimer2: "गेम पुरस्कार और ड्रॉ प्रविष्टियाँ प्रमोशनल बोनस हैं।", purchasedToast: "खरीदा गया!", chooseGiftCardPrize: "अपना गिफ्ट कार्ड चुनें", winBadge: "जीतें $500", confirmPurchaseTitle: "खरीदारी पुष्टि करें", youWillReceive: "आपको मिलेगा:", confirmPurchaseBtn: "खरीदारी पुष्टि करें", male: "पुरुष", female: "महिला", playerYou: "आप", botPlayer: "बॉट 🤖", needsExactRoll: "सटीक रोल चाहिए!", revealRewardNow: "अभी खोलें", scratchWinTypes: "अंक, XP, टिकट", madamZaraTitle: "मैडम ज़ारा — टैरो", mysteryReaderLabel: "रहस्यमय पाठक", startTarotBtn: "टैरो सत्र शुरू करें", noTicketsTarot: "कोई टिकट नहीं। व्हील घुमाएं या दुकान से खरीदें", selectCardsHeart: "दिल से कार्ड चुनें", tapAnyCard: "चुनने के लिए कार्ड पर टैप करें", revealReadTarot: "कार्ड खोलें और टैरो पढ़ें", askMadamZara: "मैडम ज़ारा से पूछें...", liveLabel: "लाइव", bonusEntriesLabel: "अतिरिक्त प्रवेश",
    seg_xp50: "50\nXP", seg_tryAgain: "फिर\nकोशिश", seg_surprise: "सरप्राइज़\nगिफ्ट", seg_gameTicket: "गेम\nटिकट", seg_pointsXp: "15 अंक\n+50 XP", seg_xp100: "100\nXP", seg_tarotTicket: "टैरो\nटिकट", seg_ticketCombo: "गेम &\nटैरो",
    reward_xp50: "50 XP", reward_xp100: "100 XP", reward_gameTicket: "गेम टिकट", reward_tarotTicket: "टैरो टिकट", reward_ticketCombo: "गेम & टैरो टिकट", reward_pointsXp: "15 अंक + 50 XP", reward_surprise: "सरप्राइज़ गिफ्ट", reward_tryAgain: "फिर कोशिश करें",
    welcomeTitle: "Winline में आपका स्वागत है! ✨", welcomeMessage: "मैं मैडम ज़ारा हूँ, आपकी रहस्यमयी मार्गदर्शिका। व्हील घुमाएं, खेलें और अद्भुत पुरस्कार जीतें। जादू शुरू हो!", welcomeButton: "चलो शुरू करें! 🎉",
    xpRainTitle: "XP बारिश", xpRainCollected: "इकट्ठा किया", xpRainOver: "XP बारिश खत्म!", xpRainYouGot: "आपने इकट्ठा किया", xpRainAddedToAccount: "आपके XP में जोड़ा गया!", xpRainStarting: "⚡ XP बारिश 3 सेकंड में शुरू! तैयार हो जाओ! ⚡", xpRainAnnounce: "ने इकट्ठा किया"
  },
};
