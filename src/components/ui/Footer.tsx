"use client";

import { useTranslations } from "next-intl";
import { Github } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white/30 tracking-wide">
          {t("copyright")}
        </p>
        <a
          href="https://github.com/rata-a2"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/30 hover:text-white transition-colors duration-300"
          aria-label="GitHub"
        >
          <Github size={18} />
        </a>
      </div>
    </footer>
  );
}
