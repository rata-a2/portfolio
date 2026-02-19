"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";
import ProjectCard, { type ProjectFlat } from "@/components/ui/ProjectCard";

type CategoryFilter = "all" | "webapp" | "desktop" | "extension";

const filters: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "all" },
  { key: "webapp", label: "webapp" },
  { key: "desktop", label: "desktop" },
  { key: "extension", label: "extension" },
];

export default function ProjectsSection({ projects }: { projects: ProjectFlat[] }) {
  const t = useTranslations("projects");
  const [active, setActive] = useState<CategoryFilter>("all");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const filtered =
    active === "all"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="relative py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-12"
        >
          <h2 className="text-xs tracking-[0.4em] uppercase text-white/30 mb-3">
            02
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t("heading")}
          </h3>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex gap-2 mb-10 flex-wrap"
        >
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={`text-xs tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-300 ${
                active === f.key
                  ? "border-white/30 text-white bg-white/5"
                  : "border-white/[0.06] text-white/30 hover:text-white/60 hover:border-white/15"
              }`}
            >
              {t(f.label)}
            </button>
          ))}
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-6"
        >
          {filtered.map((project) => (
            <motion.div key={project.id} variants={scaleIn} layout>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
