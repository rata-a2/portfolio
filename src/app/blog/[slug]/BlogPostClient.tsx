"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { fadeInUp } from "@/lib/animations";
import type { BlogPost } from "@/lib/blog";
import type { ReactNode } from "react";

export default function BlogPostClient({
  post,
  children,
}: {
  post: BlogPost;
  children: ReactNode;
}) {
  const t = useTranslations("blog");

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white transition-colors mb-10 group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            {t("backToList")}
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <time className="text-xs text-white/20 font-mono tracking-wider">
                {post.date}
              </time>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-white/25 border border-white/[0.06] px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              {post.title}
            </h1>
            {post.description && (
              <p className="text-white/40 mt-4 text-lg font-light">
                {post.description}
              </p>
            )}
          </header>

          {/* Content */}
          <article className="prose-custom">{children}</article>
        </motion.div>
      </div>
    </div>
  );
}
