const CDN = "https://cdn.jsdelivr.net/npm/tarot-card-img@0.1.0";

export interface TarotCard {
  id: number;
  name: string;
  nameAr: string;
  suit: string;
  emoji: string;
  imageUrl: string;
}

const majorArcana: TarotCard[] = [
  { id: 0, name: "The Fool", nameAr: "الأحمق", suit: "Major", emoji: "🃏", imageUrl: `${CDN}/major/0m.jpg` },
  { id: 1, name: "The Magician", nameAr: "الساحر", suit: "Major", emoji: "🎩", imageUrl: `${CDN}/major/1m.jpg` },
  { id: 2, name: "The High Priestess", nameAr: "الكاهنة", suit: "Major", emoji: "🌙", imageUrl: `${CDN}/major/2m.jpg` },
  { id: 3, name: "The Empress", nameAr: "الإمبراطورة", suit: "Major", emoji: "👑", imageUrl: `${CDN}/major/3m.jpg` },
  { id: 4, name: "The Emperor", nameAr: "الإمبراطور", suit: "Major", emoji: "🏛️", imageUrl: `${CDN}/major/4m.jpg` },
  { id: 5, name: "The Hierophant", nameAr: "الكاهن الأعلى", suit: "Major", emoji: "📿", imageUrl: `${CDN}/major/5m.jpg` },
  { id: 6, name: "The Lovers", nameAr: "العشاق", suit: "Major", emoji: "💕", imageUrl: `${CDN}/major/6m.jpg` },
  { id: 7, name: "The Chariot", nameAr: "العربة", suit: "Major", emoji: "🏇", imageUrl: `${CDN}/major/7m.jpg` },
  { id: 8, name: "Strength", nameAr: "القوة", suit: "Major", emoji: "🦁", imageUrl: `${CDN}/major/8m.jpg` },
  { id: 9, name: "The Hermit", nameAr: "الناسك", suit: "Major", emoji: "🏔️", imageUrl: `${CDN}/major/9m.jpg` },
  { id: 10, name: "Wheel of Fortune", nameAr: "عجلة الحظ", suit: "Major", emoji: "🎡", imageUrl: `${CDN}/major/10m.jpg` },
  { id: 11, name: "Justice", nameAr: "العدالة", suit: "Major", emoji: "⚖️", imageUrl: `${CDN}/major/11m.jpg` },
  { id: 12, name: "The Hanged Man", nameAr: "الرجل المعلق", suit: "Major", emoji: "🙃", imageUrl: `${CDN}/major/12m.jpg` },
  { id: 13, name: "Death", nameAr: "الموت", suit: "Major", emoji: "🦋", imageUrl: `${CDN}/major/13m.jpg` },
  { id: 14, name: "Temperance", nameAr: "الاعتدال", suit: "Major", emoji: "⏳", imageUrl: `${CDN}/major/14m.jpg` },
  { id: 15, name: "The Devil", nameAr: "الشيطان", suit: "Major", emoji: "🔥", imageUrl: `${CDN}/major/15m.jpg` },
  { id: 16, name: "The Tower", nameAr: "البرج", suit: "Major", emoji: "🗼", imageUrl: `${CDN}/major/16m.jpg` },
  { id: 17, name: "The Star", nameAr: "النجمة", suit: "Major", emoji: "⭐", imageUrl: `${CDN}/major/17m.jpg` },
  { id: 18, name: "The Moon", nameAr: "القمر", suit: "Major", emoji: "🌕", imageUrl: `${CDN}/major/18m.jpg` },
  { id: 19, name: "The Sun", nameAr: "الشمس", suit: "Major", emoji: "☀️", imageUrl: `${CDN}/major/19m.jpg` },
  { id: 20, name: "Judgement", nameAr: "الحكم", suit: "Major", emoji: "📯", imageUrl: `${CDN}/major/20m.jpg` },
  { id: 21, name: "The World", nameAr: "العالم", suit: "Major", emoji: "🌍", imageUrl: `${CDN}/major/21m.jpg` },
];

const suitCodes: Record<string, string> = {
  Wands: "w", Cups: "c", Swords: "s", Pentacles: "p"
};

const suitFolders: Record<string, string> = {
  Wands: "wands", Cups: "cups", Swords: "swords", Pentacles: "pentacles"
};

const suitNamesAr: Record<string, string> = {
  Wands: "الصولجانات", Cups: "الكؤوس", Swords: "السيوف", Pentacles: "النجوم الخماسية"
};

const suitEmojis: Record<string, string> = {
  Wands: "🪄", Cups: "🏆", Swords: "⚔️", Pentacles: "⭕"
};

const courtCards = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
const courtCardsAr = ["الآس", "الاثنان", "الثلاثة", "الأربعة", "الخمسة", "الستة", "السبعة", "الثمانية", "التسعة", "العشرة", "الغلام", "الفارس", "الملكة", "الملك"];
const courtCardCodes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "p", "n", "q", "k"];

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
      imageUrl: `${CDN}/${suitFolders[suit]}/${courtCardCodes[i]}${suitCodes[suit]}.jpg`,
    });
  }
}

export const fullTarotDeck: TarotCard[] = [...majorArcana, ...minorArcana];
