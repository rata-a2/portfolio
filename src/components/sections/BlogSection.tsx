"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { fadeInUp } from "@/lib/animations";
import { ArrowRight } from "lucide-react";
import BlogCard from "@/components/ui/BlogCard";
import type { BlogPostMeta } from "@/lib/blog";

export default function BlogSection({ posts }: { posts: BlogPostMeta[] }) {
  const t = useTranslations("blog");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="blog" className="relative py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-12"
        >
          <h2 className="text-xs tracking-[0.4em] uppercase text-white/30 mb-3">
            03
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t("heading")}
          </h3>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {posts.length > 0 ? (
            <>
              <div className="mb-8">
                {posts.slice(0, 3).map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white transition-colors group"
              >
                {t("viewAll")}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </>
          ) : (
            <p className="text-white/20 text-sm italic">{t("comingSoon")}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
