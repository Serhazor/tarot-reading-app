import type { SupportedLocale } from "@/lib/tarot";

export function formatDateTime(value: string, locale: SupportedLocale) {
  try {
    return new Date(value).toLocaleString(
      locale === "ru" ? "ru-RU" : "en-US"
    );
  } catch {
    return value;
  }
}