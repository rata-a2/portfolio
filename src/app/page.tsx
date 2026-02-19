import { getLocale } from "next-intl/server";
import ParticleField from "@/components/canvas/ParticleField";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import BlogSection from "@/components/sections/BlogSection";
import { getAllPosts } from "@/lib/blog";

export default async function Home() {
  const locale = await getLocale();
  const posts = getAllPosts(locale);

  return (
    <>
      <ParticleField />
      <div className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <BlogSection posts={posts} />
      </div>
    </>
  );
}
