"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { BlogPostMeta } from "@/lib/blog";

export default function BlogCard({ post }: { post: BlogPostMeta }) {
  const t = useTranslations("blog");

  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.article
        whileHover={{ x: 4 }}
        className="group py-6 border-b border-white/[0.04] flex items-start justify-between gap-4 cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <time className="text-[10px] text-white/20 font-mono tracking-wider">
              {post.date}
            </time>
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-white/25 border border-white/[0.06] px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <h4 className="text-base font-medium tracking-tight group-hover:text-white transition-colors text-white/80">
            {post.title}
          </h4>
          <p className="text-sm text-white/30 mt-1 line-clamp-1">
            {post.description}
          </p>
        </div>
        <ArrowUpRight
          size={16}
          className="text-white/10 group-hover:text-white/50 transition-colors mt-2 shrink-0"
        />
      </motion.article>
    </Link>
  );
}
