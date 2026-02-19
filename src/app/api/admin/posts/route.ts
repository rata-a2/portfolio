import { NextRequest, NextResponse } from "next/server";
import {
  listBlogFiles,
  getBlogFile,
  saveBlogFile,
  deleteBlogFile,
} from "@/lib/github";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  if (!auth) return false;
  const token = auth.replace("Bearer ", "");
  return token === ADMIN_PASSWORD;
}

// GET: List all posts, or get a single post by ?slug=xxx
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const result = await getBlogFile(slug);
    if (!result) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({
      slug,
      sha: result.sha,
      ...result.data,
    });
  }

  // List all posts
  const files = await listBlogFiles();
  const posts = await Promise.all(
    files.map(async (file) => {
      const s = file.name.replace(/\.json$/, "");
      const result = await getBlogFile(s);
      if (!result) return null;
      return {
        slug: s,
        sha: file.sha,
        title: result.data.title || "Untitled",
        description: result.data.description || "",
        date: result.data.date || "",
        tags: result.data.tags || [],
        locale: result.data.locale || "ja",
      };
    })
  );

  const filtered = posts
    .filter((p) => p !== null)
    .sort((a, b) => ((a!.date as string) > (b!.date as string) ? -1 : 1));

  return NextResponse.json(filtered);
}

// POST: Create or update a post
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, title, description, date, tags, locale, blocks, sha } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: "slug and title are required" },
        { status: 400 }
      );
    }

    const data = {
      title,
      description: description || "",
      date: date || new Date().toISOString().slice(0, 10),
      tags: tags || [],
      locale: locale || "ja",
      blocks: blocks || [],
    };

    const success = await saveBlogFile(slug, data, sha || undefined);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to save to GitHub" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, slug });
  } catch {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a post
export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const sha = searchParams.get("sha");

  if (!slug || !sha) {
    return NextResponse.json(
      { error: "slug and sha are required" },
      { status: 400 }
    );
  }

  const success = await deleteBlogFile(slug, sha);
  if (!success) {
    return NextResponse.json(
      { error: "Failed to delete from GitHub" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
