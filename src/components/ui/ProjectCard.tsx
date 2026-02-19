"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

export interface ProjectFlat {
  id: string;
  title: string;
  description: string;
  tech: string[];
  category: string;
  github: string;
  demo: string;
  featured: boolean;
}

export default function ProjectCard({ project }: { project: ProjectFlat }) {
  const t = useTranslations("projects");
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / rect.height) * -8;
    const rotateY = ((e.clientX - centerX) / rect.width) * 8;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transformStyle: "preserve-3d",
      }}
      className="group relative bg-white/[0.02] border border-white/[0.06] rounded-lg overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
    >
      {/* Project image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.02]">
        <div
          className="w-full h-full flex items-center justify-center text-white/10"
          dangerouslySetInnerHTML={{
            __html: generateProjectSVG(project.id, project.title),
          }}
        />
        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-4 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-white/70 hover:text-white border border-white/20 px-4 py-2 rounded-full transition-colors"
            >
              <Github size={14} />
              {t("viewCode")}
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-white/70 hover:text-white border border-white/20 px-4 py-2 rounded-full transition-colors"
            >
              <ExternalLink size={14} />
              {t("viewDemo")}
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h4 className="font-bold text-base mb-2 tracking-tight">
          {project.title}
        </h4>
        <p className="text-white/40 text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-[10px] text-white/30 border border-white/[0.08] px-2 py-0.5 rounded-full tracking-wide"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function generateProjectSVG(id: string, title: string): string {
  const colors: Record<string, string> = {
    devcheck: "#1a1a2e",
    "stock-battle-game": "#0a1628",
    "pubcom-viewer": "#1a0a28",
    "devlog-ai": "#0a2818",
    "truck-dispatch": "#28180a",
    "chatwork-enhanced-pro": "#0a1a28",
    "japanese-stock-pro": "#1a280a",
    "password-generator": "#280a1a",
  };

  const bg = colors[id] || "#111";

  return `<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <rect width="400" height="250" fill="${bg}"/>
    <rect x="20" y="20" width="360" height="210" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <circle cx="40" cy="36" r="4" fill="rgba(255,255,255,0.1)"/>
    <circle cx="54" cy="36" r="4" fill="rgba(255,255,255,0.1)"/>
    <circle cx="68" cy="36" r="4" fill="rgba(255,255,255,0.1)"/>
    <line x1="20" y1="48" x2="380" y2="48" stroke="rgba(255,255,255,0.05)"/>
    <rect x="36" y="64" width="80" height="8" rx="4" fill="rgba(255,255,255,0.12)"/>
    <rect x="36" y="84" width="140" height="6" rx="3" fill="rgba(255,255,255,0.06)"/>
    <rect x="36" y="100" width="120" height="6" rx="3" fill="rgba(255,255,255,0.04)"/>
    <rect x="36" y="124" width="100" height="80" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>
    <rect x="150" y="124" width="100" height="80" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>
    <rect x="264" y="124" width="100" height="80" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>
    <text x="200" y="170" text-anchor="middle" fill="rgba(255,255,255,0.08)" font-size="11" font-family="monospace">${title}</text>
  </svg>`;
}
