import { getLocale } from "next-intl/server";
import { getAllPosts } from "@/lib/blog";
import BlogListClient from "./BlogListClient";

export const metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const locale = await getLocale();
  const posts = getAllPosts(locale);

  return <BlogListClient posts={posts} />;
}
