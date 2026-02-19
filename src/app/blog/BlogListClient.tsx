"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import BlogCard from "@/components/ui/BlogCard";
import type { BlogPostMeta } from "@/lib/blog";

export default function BlogListClient({ posts }: { posts: BlogPostMeta[] }) {
  const t = useTranslations("blog");

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t("heading")}
          </h1>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {posts.length > 0 ? (
            posts.map((post) => (
              <motion.div key={post.slug} variants={fadeInUp}>
                <BlogCard post={post} />
              </motion.div>
            ))
          ) : (
            <p className="text-white/20 text-sm italic">{t("comingSoon")}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
