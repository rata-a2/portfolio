"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const skills = [
  { name: "TypeScript", level: 9 },
  { name: "React", level: 9 },
  { name: "Next.js", level: 8 },
  { name: "Node.js", level: 8 },
  { name: "Express", level: 8 },
  { name: "Electron", level: 7 },
  { name: "Tailwind CSS", level: 9 },
  { name: "PostgreSQL", level: 7 },
  { name: "SQLite", level: 7 },
  { name: "Docker", level: 6 },
  { name: "Python", level: 5 },
];

function DotMatrix({ level, index }: { level: number; index: number }) {
  const total = 10;
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: index * 0.06 + i * 0.03,
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`w-[6px] h-[6px] rounded-full ${
            i < level ? "bg-white" : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

export default function AboutSection() {
  const t = useTranslations("about");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section heading — offset to the left */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-16"
        >
          <h2 className="text-xs tracking-[0.4em] uppercase text-white/30 mb-3">
            01
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t("heading")}
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-16 md:gap-20">
          {/* Left: Description — takes 3 cols */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="md:col-span-3"
          >
            <p className="text-white/60 text-base md:text-lg leading-[1.9] font-light">
              {t("description")}
            </p>
          </motion.div>

          {/* Right: Skills dot matrix — takes 2 cols */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="md:col-span-2"
          >
            <h4 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-6">
              {t("skillsHeading")}
            </h4>
            <div className="space-y-3">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  variants={fadeInUp}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-xs text-white/50 font-mono w-24 shrink-0 tracking-wide">
                    {skill.name}
                  </span>
                  <DotMatrix level={skill.level} index={i} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
    </section>
  );
}
