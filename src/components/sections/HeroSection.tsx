"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  greeting: string;
  name: string;
  title: string;
  subtitle: string;
}

// Characters used in the decode scramble
const CHARS = "アイウエオカキクケコ01サシスセソ_タチツテト-ナニヌネノ/ハヒフヘホ.マミムメモ:";

function useDecodeText(target: string, startDelay = 600) {
  const [display, setDisplay] = useState<string[]>(
    Array(target.length).fill("")
  );
  const [lockedCount, setLockedCount] = useState(0);
  const [done, setDone] = useState(false);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const lockedRef = useRef(0);

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      // Each character locks in after a staggered delay
      const lockInterval = 120; // ms between each character locking
      const scrambleSpeed = 40; // ms between scramble frames
      const newLocked = Math.min(
        target.length,
        Math.floor(elapsed / lockInterval)
      );

      if (newLocked !== lockedRef.current) {
        lockedRef.current = newLocked;
        setLockedCount(newLocked);
      }

      // Update display: locked chars show final, rest scramble
      if (elapsed % scrambleSpeed < 16) {
        setDisplay(
          Array.from({ length: target.length }, (_, i) => {
            if (i < lockedRef.current) return target[i];
            // Not yet visible — show random char
            if (i > lockedRef.current + 2) return "";
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
        );
      }

      if (lockedRef.current >= target.length) {
        setDisplay(target.split(""));
        setDone(true);
        return;
      }

      frameRef.current = requestAnimationFrame(animate);
    },
    [target]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      frameRef.current = requestAnimationFrame(animate);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frameRef.current);
    };
  }, [animate, startDelay]);

  return { display, lockedCount, done };
}

export default function HeroSection({
  greeting,
  name,
  title,
  subtitle,
}: HeroProps) {
  const t = useTranslations("hero");
  const { display, lockedCount, done } = useDecodeText(name, 600);
  const [hoverGlitch, setHoverGlitch] = useState(false);

  // Brief re-scramble on hover
  const [hoverDisplay, setHoverDisplay] = useState<string[] | null>(null);

  useEffect(() => {
    if (!hoverGlitch || !done) return;
    let frame = 0;
    const maxFrames = 6;
    const interval = setInterval(() => {
      if (frame >= maxFrames) {
        setHoverDisplay(null);
        setHoverGlitch(false);
        clearInterval(interval);
        return;
      }
      setHoverDisplay(
        name.split("").map((ch, i) => {
          // Randomly glitch some characters
          if (Math.random() > 0.6) {
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          return ch;
        })
      );
      frame++;
    }, 50);
    return () => clearInterval(interval);
  }, [hoverGlitch, done, name]);

  const shownChars = hoverDisplay || display;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <div className="relative z-10 text-center max-w-4xl">
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.1,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-white/30 text-xs md:text-sm tracking-[0.35em] uppercase mb-6 font-light"
        >
          {greeting}
        </motion.p>

        {/* Name — mechanical decode */}
        <div
          className="mb-8 relative"
          onMouseEnter={() => done && setHoverGlitch(true)}
        >
          <h1 className="text-7xl md:text-[8rem] lg:text-[10rem] font-bold tracking-[-0.04em] leading-none select-none">
            {shownChars.map((ch, i) => {
              const isLocked = !hoverDisplay && i < lockedCount;
              const justLocked = !hoverDisplay && i === lockedCount - 1;
              return (
                <span
                  key={i}
                  className="inline-block relative"
                  style={{
                    opacity: ch === "" ? 0 : isLocked ? 1 : 0.4,
                    color: isLocked ? "#fff" : "rgba(255,255,255,0.5)",
                    transition: "opacity 0.1s, color 0.15s",
                    textShadow: justLocked
                      ? "0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.3)"
                      : "none",
                  }}
                >
                  {ch || "\u00A0"}
                  {/* Flash on lock */}
                  {justLocked && (
                    <motion.span
                      initial={{ opacity: 0.9 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute inset-0 bg-white/20 blur-sm pointer-events-none"
                    />
                  )}
                </span>
              );
            })}
          </h1>

          {/* Underline scan after decode */}
          {done && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent origin-center"
            />
          )}

          {/* Corner brackets — mechanical framing */}
          {done && (
            <>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-4 h-4 md:w-5 md:h-5 border-t border-l border-white/10 pointer-events-none"
              />
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-4 h-4 md:w-5 md:h-5 border-t border-r border-white/10 pointer-events-none"
              />
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 w-4 h-4 md:w-5 md:h-5 border-b border-l border-white/10 pointer-events-none"
              />
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-4 h-4 md:w-5 md:h-5 border-b border-r border-white/10 pointer-events-none"
              />
            </>
          )}
        </div>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: done ? 1 : 0, y: done ? 0 : 8 }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-white/40 text-base md:text-lg tracking-[0.18em] font-light mb-6 uppercase"
        >
          {title}
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: done ? 1 : 0, y: done ? 0 : 8 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-white/20 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-light"
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0 }}
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
