const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_REPO = process.env.GITHUB_REPO || "rata-a2/portfolio";
const BLOG_PATH = "content/blog";

interface GitHubFileResponse {
  sha: string;
  content: string;
  encoding: string;
}

async function githubApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/${endpoint}`;
  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

/** List all blog post files from GitHub */
export async function listBlogFiles(): Promise<
  { name: string; sha: string }[]
> {
  const res = await githubApi(`contents/${BLOG_PATH}`);
  if (!res.ok) return [];

  const files = await res.json();
  return (files as { name: string; sha: string }[]).filter((f) =>
    f.name.endsWith(".json")
  );
}

/** Get a single blog post file from GitHub */
export async function getBlogFile(
  slug: string
): Promise<{ data: Record<string, unknown>; sha: string } | null> {
  const res = await githubApi(`contents/${BLOG_PATH}/${slug}.json`);
  if (!res.ok) return null;

  const file = (await res.json()) as GitHubFileResponse;
  const content = Buffer.from(file.content, "base64").toString("utf-8");
  return { data: JSON.parse(content), sha: file.sha };
}

/** Create or update a blog post file on GitHub */
export async function saveBlogFile(
  slug: string,
  data: Record<string, unknown>,
  existingSha?: string
): Promise<boolean> {
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

  const body: Record<string, string> = {
    message: existingSha ? `Update blog: ${slug}` : `Create blog: ${slug}`,
    content,
  };
  if (existingSha) {
    body.sha = existingSha;
  }

  const res = await githubApi(`contents/${BLOG_PATH}/${slug}.json`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  return res.ok;
}

/** Delete a blog post file from GitHub */
export async function deleteBlogFile(
  slug: string,
  sha: string
): Promise<boolean> {
  const res = await githubApi(`contents/${BLOG_PATH}/${slug}.json`, {
    method: "DELETE",
    body: JSON.stringify({
      message: `Delete blog: ${slug}`,
      sha,
    }),
  });

  return res.ok;
}
