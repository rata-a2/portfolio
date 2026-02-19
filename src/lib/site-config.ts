import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "content", "site-config.json");

export interface SiteConfig {
  hero: {
    greeting: { ja: string; en: string };
    name: { ja: string; en: string };
    title: string;
    subtitle: { ja: string; en: string };
  };
  about: {
    description: { ja: string; en: string };
    skills: { name: string; level: number }[];
  };
  projects: {
    id: string;
    title: { ja: string; en: string };
    description: { ja: string; en: string };
    tech: string[];
    category: string;
    github: string;
    demo: string;
    featured: boolean;
  }[];
  footer: {
    copyright: { ja: string; en: string };
  };
}

export function getSiteConfig(): SiteConfig {
  const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
  return JSON.parse(raw);
}
