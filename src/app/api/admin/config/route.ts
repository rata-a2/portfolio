import { NextRequest, NextResponse } from "next/server";
import { getSiteConfig } from "@/lib/site-config";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_REPO = process.env.GITHUB_REPO || "rata-a2/portfolio";
const CONFIG_FILE_PATH = "content/site-config.json";

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  if (!auth) return false;
  const token = auth.replace("Bearer ", "");
  return token === ADMIN_PASSWORD;
}

// GET: Get current site config
export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Try GitHub first (for getting sha), fall back to local
  try {
    const ghRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${CONFIG_FILE_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (ghRes.ok) {
      const ghFile = await ghRes.json();
      const content = Buffer.from(ghFile.content, "base64").toString("utf-8");
      return NextResponse.json({
        config: JSON.parse(content),
        sha: ghFile.sha,
      });
    }
  } catch {
    // GitHub unavailable, use local
  }

  // Fall back to local file
  const config = getSiteConfig();
  return NextResponse.json({ config, sha: null });
}

// POST: Update site config
export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { config, sha } = await request.json();

    const content = Buffer.from(JSON.stringify(config, null, 2)).toString(
      "base64"
    );

    const body: Record<string, string> = {
      message: "Update site configuration",
      content,
    };
    if (sha) {
      body.sha = sha;
    }

    const ghRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${CONFIG_FILE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!ghRes.ok) {
      const err = await ghRes.json();
      return NextResponse.json(
        { error: `GitHub API error: ${err.message || "Unknown"}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update config" },
      { status: 500 }
    );
  }
}
