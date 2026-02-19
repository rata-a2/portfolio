import fs from "fs";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface EditorBlock {
  id?: string;
  type: string;
  data: Record<string, unknown>;
}

export interface BlogPostData {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  locale: string;
  blocks: EditorBlock[];
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  locale: string;
}

function ensureBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
}

export function getAllPosts(locale?: string): BlogPostMeta[] {
  ensureBlogDir();

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".json"));

  const posts = files
    .map((filename) => {
      try {
        const filePath = path.join(BLOG_DIR, filename);
        const raw = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(raw);

        return {
          slug: filename.replace(/\.json$/, ""),
          title: data.title || "Untitled",
          description: data.description || "",
          date: data.date || new Date().toISOString().slice(0, 10),
          tags: data.tags || [],
          locale: data.locale || "ja",
        };
      } catch {
        return null;
      }
    })
    .filter((post): post is BlogPostMeta => post !== null)
    .filter((post) => !locale || post.locale === locale)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

export function getPostBySlug(slug: string): BlogPostData | null {
  ensureBlogDir();

  const filePath = path.join(BLOG_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    return {
      slug,
      title: data.title || "Untitled",
      description: data.description || "",
      date: data.date || new Date().toISOString().slice(0, 10),
      tags: data.tags || [],
      locale: data.locale || "ja",
      blocks: data.blocks || [],
    };
  } catch {
    return null;
  }
}

/** Render Editor.js blocks to HTML */
export function renderBlocks(blocks: EditorBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "header": {
          const level = (block.data.level as number) || 2;
          const text = block.data.text as string;
          return `<h${level}>${text}</h${level}>`;
        }
        case "paragraph": {
          const text = block.data.text as string;
          return `<p>${text}</p>`;
        }
        case "list": {
          const style = block.data.style as string;
          const items = block.data.items as string[];
          const tag = style === "ordered" ? "ol" : "ul";
          const lis = items.map((item) => `<li>${item}</li>`).join("");
          return `<${tag}>${lis}</${tag}>`;
        }
        case "code": {
          const code = block.data.code as string;
          return `<pre><code>${escapeHtml(code)}</code></pre>`;
        }
        case "quote": {
          const text = block.data.text as string;
          const caption = block.data.caption as string;
          return `<blockquote><p>${text}</p>${caption ? `<cite>${caption}</cite>` : ""}</blockquote>`;
        }
        case "delimiter":
          return `<hr />`;
        default:
          return "";
      }
    })
    .join("\n");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
