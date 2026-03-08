import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'ar' | 'fr' | 'es' | 'tr' | 'de' | 'it' | 'pt' | 'ru' | 'hi';

export const LANGUAGES: { code: Language; name: string; nativeName: string; rtl: boolean }[] = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
  { code: 'fr', name: 'French', nativeName: 'Français', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', rtl: false },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false },
];

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: () => boolean;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => {
        set({ language: lang });
        const rtl = LANGUAGES.find(l => l.code === lang)?.rtl ?? false;
        document.documentElement.dir = rtl ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
      },
      isRTL: () => {
        const { language } = get();
        return LANGUAGES.find(l => l.code === language)?.rtl ?? false;
      },
    }),
    { name: 'winline-language' }
  )
);
