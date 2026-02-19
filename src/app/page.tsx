import { getLocale } from "next-intl/server";
import ParticleField from "@/components/canvas/ParticleField";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import BlogSection from "@/components/sections/BlogSection";
import { getAllPosts } from "@/lib/blog";
import { getSiteConfig } from "@/lib/site-config";

export default async function Home() {
  const locale = await getLocale();
  const posts = getAllPosts(locale);
  const config = getSiteConfig();

  const l = locale as "ja" | "en";

  return (
    <>
      <ParticleField />
      <div className="relative z-10">
        <HeroSection
          greeting={config.hero.greeting[l]}
          name={config.hero.name[l]}
          title={config.hero.title}
          subtitle={config.hero.subtitle[l]}
        />
        <AboutSection
          description={config.about.description[l]}
          skills={config.about.skills}
        />
        <ProjectsSection
          projects={config.projects.map((p) => ({
            ...p,
            title: p.title[l],
            description: p.description[l],
          }))}
        />
        <BlogSection posts={posts} />
      </div>
    </>
  );
}
