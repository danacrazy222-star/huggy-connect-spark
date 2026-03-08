import type { Language } from '@/store/useLanguageStore';

export type TranslationKeys = {
  // Navigation
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
    winnerGets: "Winner gets +40 XP", loserGets: "Loser gets +5 XP max",
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
    winnerGets: "الفائز يحصل على +40 XP", loserGets: "الخاسر يحصل على +5 XP كحد أقصى",
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
    winnerGets: "Le gagnant reçoit +40 XP", loserGets: "Le perdant reçoit +5 XP max",
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
    winnerGets: "Ganador recibe +40 XP", loserGets: "Perdedor recibe +5 XP máx",
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
    winnerGets: "Kazanan +40 XP alır", loserGets: "Kaybeden maks +5 XP alır",
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
    winnerGets: "Gewinner erhält +40 XP", loserGets: "Verlierer erhält max +5 XP",
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
    winnerGets: "Il vincitore riceve +40 XP", loserGets: "Il perdente riceve max +5 XP",
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
    winnerGets: "Vencedor recebe +40 XP", loserGets: "Perdedor recebe máx +5 XP",
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
    winnerGets: "Победитель получает +40 XP", loserGets: "Проигравший получает макс +5 XP",
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
    winnerGets: "विजेता को +40 XP मिलता है", loserGets: "हारने वाले को अधिकतम +5 XP",
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
  },
};
