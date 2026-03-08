import { useLanguageStore, type Language } from '@/store/useLanguageStore';
import { translations } from '@/i18n/translations';

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const isRTL = useLanguageStore((s) => s.isRTL)();

  const t = (key: string): string => {
    const lang = language as Language;
    return (translations as any)[lang]?.[key] ?? (translations as any).en?.[key] ?? key;
  };

  return { t, isRTL, language };
}
