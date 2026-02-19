"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("hero");
  const [typedName, setTypedName] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [phase, setPhase] = useState<"typing" | "done">("typing");
  const fullName = t("name");

  // Typewriter — variable speed for human feel
  useEffect(() => {
    let i = 0;
    let timeout: NodeJS.Timeout;

    const typeNext = () => {
      if (i < fullName.length) {
        setTypedName(fullName.slice(0, i + 1));
        i++;
        // Random delay 80-180ms for natural feel
        const delay = 80 + Math.random() * 100;
        timeout = setTimeout(typeNext, delay);
      } else {
        setPhase("done");
      }
    };

    // Initial delay before typing starts
    timeout = setTimeout(typeNext, 600);

    return () => clearTimeout(timeout);
  }, [fullName]);

  // Cursor blink
  useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(blink);
  }, []);

  // Hide cursor after done
  useEffect(() => {
    if (phase !== "done") return;
    const timer = setTimeout(() => setCursorVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [phase]);

  const isDone = phase === "done";

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <div className="relative z-10 text-center max-w-4xl">
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/30 text-xs md:text-sm tracking-[0.35em] uppercase mb-6 font-light"
        >
          {t("greeting")}
        </motion.p>

        {/* Name — big glitch text */}
        <div className="mb-8 relative">
          <h1
            className="text-7xl md:text-[8rem] lg:text-[10rem] font-bold tracking-[-0.04em] leading-none glitch-text select-none"
            data-text={typedName}
          >
            {typedName}
            {/* Cursor */}
            <span
              className={`inline-block w-[3px] md:w-[4px] h-[0.75em] bg-white ml-2 align-baseline transition-opacity duration-75 ${
                cursorVisible && phase !== "done" ? "opacity-100" : phase === "done" ? "opacity-0" : "opacity-0"
              }`}
              style={{ verticalAlign: "0.05em" }}
            />
          </h1>

          {/* Horizontal scan line that appears briefly after typing */}
          {isDone && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute left-0 right-0 h-px bg-white/40 top-1/2 origin-left"
            />
          )}
        </div>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: isDone ? 1 : 0, y: isDone ? 0 : 8 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/40 text-base md:text-lg tracking-[0.18em] font-light mb-6 uppercase"
        >
          {t("title")}
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: isDone ? 1 : 0, y: isDone ? 0 : 8 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/20 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-light"
        >
          {t("subtitle")}
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isDone ? 1 : 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] text-white/15 tracking-[0.5em] uppercase font-light">
          {t("scroll")}
        </span>
        <ChevronDown size={12} className="text-white/15 scroll-indicator" />
      </motion.div>
    </section>
  );
}
