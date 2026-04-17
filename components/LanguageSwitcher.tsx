"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      <Link
        href={pathname}
        locale="en"
        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition ${
          locale === "en"
            ? "bg-white text-slate-950"
            : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
        }`}
      >
        EN
      </Link>
      <Link
        href={pathname}
        locale="ru"
        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition ${
          locale === "ru"
            ? "bg-white text-slate-950"
            : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
        }`}
      >
        RU
      </Link>
    </div>
  );
}