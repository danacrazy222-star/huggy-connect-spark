// Arabic & English profanity filter
const BLOCKED_WORDS_AR = [
  "كلب", "حمار", "غبي", "أحمق", "تفو", "زبالة", "حقير", "وسخ", "قذر",
  "كس", "طيز", "زب", "شرموط", "عرص", "منيوك", "قحبة", "لعن", "ابن الكلب",
  "يلعن", "خرا", "زق", "عاهرة", "فاجرة", "نجس", "واطي", "سافل", "خنزير",
  "بقرة", "تيس", "ديوث", "معرص", "متناك", "كسمك", "امك", "ابوك",
];

const BLOCKED_WORDS_EN = [
  "fuck", "shit", "bitch", "ass", "damn", "dick", "pussy", "bastard",
  "whore", "slut", "cunt", "nigger", "faggot", "retard", "idiot",
  "stupid", "dumb", "hell", "crap",
];

const ALL_BLOCKED = [...BLOCKED_WORDS_AR, ...BLOCKED_WORDS_EN];

// Build regex that matches whole words or embedded bad words
const pattern = new RegExp(
  ALL_BLOCKED.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
  "gi"
);

export function containsProfanity(text: string): boolean {
  return pattern.test(text);
}

export function censorMessage(text: string): string {
  return text.replace(pattern, (match) => "✸".repeat(match.length));
}
