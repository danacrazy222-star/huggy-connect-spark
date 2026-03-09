export interface TarotCard {
  id: number;
  name: string;
  nameAr: string;
  suit: string;
  emoji: string;
}

const majorArcana: TarotCard[] = [
  { id: 0, name: "The Fool", nameAr: "الأحمق", suit: "Major", emoji: "🃏" },
  { id: 1, name: "The Magician", nameAr: "الساحر", suit: "Major", emoji: "🎩" },
  { id: 2, name: "The High Priestess", nameAr: "الكاهنة", suit: "Major", emoji: "🌙" },
  { id: 3, name: "The Empress", nameAr: "الإمبراطورة", suit: "Major", emoji: "👑" },
  { id: 4, name: "The Emperor", nameAr: "الإمبراطور", suit: "Major", emoji: "🏛️" },
  { id: 5, name: "The Hierophant", nameAr: "الكاهن الأعلى", suit: "Major", emoji: "📿" },
  { id: 6, name: "The Lovers", nameAr: "العشاق", suit: "Major", emoji: "💕" },
  { id: 7, name: "The Chariot", nameAr: "العربة", suit: "Major", emoji: "🏇" },
  { id: 8, name: "Strength", nameAr: "القوة", suit: "Major", emoji: "🦁" },
  { id: 9, name: "The Hermit", nameAr: "الناسك", suit: "Major", emoji: "🏔️" },
  { id: 10, name: "Wheel of Fortune", nameAr: "عجلة الحظ", suit: "Major", emoji: "🎡" },
  { id: 11, name: "Justice", nameAr: "العدالة", suit: "Major", emoji: "⚖️" },
  { id: 12, name: "The Hanged Man", nameAr: "الرجل المعلق", suit: "Major", emoji: "🙃" },
  { id: 13, name: "Death", nameAr: "الموت", suit: "Major", emoji: "🦋" },
  { id: 14, name: "Temperance", nameAr: "الاعتدال", suit: "Major", emoji: "⏳" },
  { id: 15, name: "The Devil", nameAr: "الشيطان", suit: "Major", emoji: "🔥" },
  { id: 16, name: "The Tower", nameAr: "البرج", suit: "Major", emoji: "🗼" },
  { id: 17, name: "The Star", nameAr: "النجمة", suit: "Major", emoji: "⭐" },
  { id: 18, name: "The Moon", nameAr: "القمر", suit: "Major", emoji: "🌕" },
  { id: 19, name: "The Sun", nameAr: "الشمس", suit: "Major", emoji: "☀️" },
  { id: 20, name: "Judgement", nameAr: "الحكم", suit: "Major", emoji: "📯" },
  { id: 21, name: "The World", nameAr: "العالم", suit: "Major", emoji: "🌍" },
];

const suitEmojis: Record<string, string> = {
  Wands: "🪄", Cups: "🏆", Swords: "⚔️", Pentacles: "⭕"
};

const suitNamesAr: Record<string, string> = {
  Wands: "الصولجانات", Cups: "الكؤوس", Swords: "السيوف", Pentacles: "النجوم الخماسية"
};

const courtCards = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
const courtCardsAr = ["الآس", "الاثنان", "الثلاثة", "الأربعة", "الخمسة", "الستة", "السبعة", "الثمانية", "التسعة", "العشرة", "الغلام", "الفارس", "الملكة", "الملك"];

const minorArcana: TarotCard[] = [];
let id = 22;
for (const suit of ["Wands", "Cups", "Swords", "Pentacles"]) {
  for (let i = 0; i < 14; i++) {
    minorArcana.push({
      id: id++,
      name: `${courtCards[i]} of ${suit}`,
      nameAr: `${courtCardsAr[i]} ${suitNamesAr[suit]}`,
      suit,
      emoji: suitEmojis[suit],
    });
  }
}

export const fullTarotDeck: TarotCard[] = [...majorArcana, ...minorArcana];
