"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";

export default function LanguageToggle() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const next = locale === "ja" ? "en" : "ja";
    startTransition(() => {
      document.cookie = `locale=${next};path=/;max-age=31536000`;
      window.location.reload();
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="text-xs tracking-widest text-white/40 hover:text-white transition-colors duration-300 border border-white/10 px-3 py-1.5 rounded-full hover:border-white/30"
    >
      {locale === "ja" ? "EN" : "JA"}
    </button>
  );
}
