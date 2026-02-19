"use client";

import { useState } from "react";
import {
  Save,
  Trash2,
  Plus,
  LogIn,
  Eye,
  Edit3,
  ArrowLeft,
  FileText,
  PenTool,
} from "lucide-react";
import Link from "next/link";

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  locale: string;
  content?: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(false);

  // Editor state
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [tags, setTags] = useState("");
  const [locale, setLocale] = useState("ja");
  const [content, setContent] = useState("");
  const [isExisting, setIsExisting] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${password}`,
  };

  const login = async () => {
    try {
      const res = await fetch("/api/admin/posts", {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.ok) {
        setAuthed(true);
        const data = await res.json();
        setPosts(data);
        setMessage("");
      } else {
        setMessage("パスワードが違います");
      }
    } catch {
      setMessage("接続エラー");
    }
  };

  const fetchPosts = async () => {
    const res = await fetch("/api/admin/posts", { headers });
    if (res.ok) {
      setPosts(await res.json());
    }
  };

  const newPost = () => {
    setSlug("");
    setTitle("");
    setDescription("");
    setDate(new Date().toISOString().slice(0, 10));
    setTags("");
    setLocale("ja");
    setContent("");
    setIsExisting(false);
    setEditing(true);
    setPreview(false);
    setMessage("");
  };

  const editPost = async (post: PostMeta) => {
    // Fetch full content including body
    try {
      const res = await fetch(`/api/admin/posts?slug=${post.slug}`, {
        headers,
      });
      if (res.ok) {
        const full = await res.json();
        setSlug(full.slug);
        setTitle(full.title);
        setDescription(full.description);
        setDate(full.date);
        setTags(full.tags?.join(", ") || "");
        setLocale(full.locale || "ja");
        setContent(full.content || "");
        setIsExisting(true);
        setEditing(true);
        setPreview(false);
        setMessage("");
      }
    } catch {
      setMessage("記事の読み込みに失敗しました");
    }
  };

  const savePost = async () => {
    if (!slug || !title || !content) {
      setMessage("スラグ、タイトル、本文は必須です");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers,
        body: JSON.stringify({
          slug,
          title,
          description,
          date,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          locale,
          content,
        }),
      });

      if (res.ok) {
        setMessage("✓ 保存しました");
        await fetchPosts();
        setEditing(false);
      } else {
        setMessage("保存に失敗しました");
      }
    } catch {
      setMessage("エラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  const removePost = async (postSlug: string) => {
    if (!confirm(`「${postSlug}」を削除しますか？`)) return;

    const res = await fetch(`/api/admin/posts?slug=${postSlug}`, {
      method: "DELETE",
      headers,
    });

    if (res.ok) {
      setMessage("削除しました");
      await fetchPosts();
    }
  };

  // === Login screen ===
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-xs">
          <div className="flex items-center gap-3 mb-8">
            <PenTool size={20} className="text-white/40" />
            <h1 className="text-xl font-bold tracking-tight">ブログ管理</h1>
          </div>
          <p className="text-white/30 text-xs mb-6 leading-relaxed">
            ブログ記事の作成・編集・削除ができます。
            <br />
            パスワードを入力してログインしてください。
          </p>
          <div className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="パスワード"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
              autoFocus
            />
            <button
              onClick={login}
              className="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-3 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
            >
              <LogIn size={15} />
              ログイン
            </button>
            {message && (
              <p className="text-red-400/80 text-xs text-center">{message}</p>
            )}
          </div>
          <div className="mt-8 pt-6 border-t border-white/[0.04]">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs text-white/20 hover:text-white/50 transition-colors"
            >
              <ArrowLeft size={12} />
              サイトに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // === Editor ===
  if (editing) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditing(false)}
                className="text-white/30 hover:text-white transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <h1 className="text-lg font-bold tracking-tight">
                {isExisting ? "記事を編集" : "新しい記事を作成"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreview(!preview)}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white border border-white/10 px-3 py-2 rounded-lg transition-colors"
              >
                <Eye size={13} />
                {preview ? "編集に戻る" : "プレビュー"}
              </button>
              <button
                onClick={savePost}
                disabled={saving}
                className="flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded-lg text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                <Save size={13} />
                {saving ? "保存中..." : "保存する"}
              </button>
            </div>
          </div>

          {message && (
            <p
              className={`text-xs mb-4 ${message.startsWith("✓") ? "text-green-400/70" : "text-red-400/70"}`}
            >
              {message}
            </p>
          )}

          {!preview ? (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="スラグ（URL）"
                  value={slug}
                  onChange={(v) =>
                    setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
                  }
                  placeholder="my-post-slug"
                  mono
                  disabled={isExisting}
                />
                <InputField
                  label="日付"
                  value={date}
                  onChange={setDate}
                  type="date"
                />
              </div>

              <InputField
                label="タイトル"
                value={title}
                onChange={setTitle}
                placeholder="記事のタイトル"
              />

              <InputField
                label="説明文"
                value={description}
                onChange={setDescription}
                placeholder="記事の概要（一覧やOGPに表示）"
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="タグ（カンマ区切り）"
                  value={tags}
                  onChange={setTags}
                  placeholder="TypeScript, React"
                />
                <div>
                  <label className="block text-[10px] text-white/30 uppercase tracking-wider mb-1.5">
                    言語
                  </label>
                  <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
                  >
                    <option value="ja" className="bg-black">
                      日本語
                    </option>
                    <option value="en" className="bg-black">
                      English
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-white/30 uppercase tracking-wider mb-1.5">
                  本文（Markdown）
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`## 見出し\n\n本文をここに書きます...\n\n### 小見出し\n\n- リスト項目\n- リスト項目`}
                  rows={24}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20 font-mono leading-relaxed resize-y transition-colors"
                />
                <p className="text-[10px] text-white/15 mt-1.5">
                  Markdown記法が使えます。## で見出し、** で太字、```
                  でコードブロック
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-white/[0.06] rounded-lg p-8 bg-white/[0.01]">
              <div className="flex items-center gap-3 mb-4">
                <time className="text-[10px] text-white/20 font-mono">
                  {date}
                </time>
                {tags
                  .split(",")
                  .filter(Boolean)
                  .map((tag) => (
                    <span
                      key={tag.trim()}
                      className="text-[10px] text-white/25 border border-white/[0.06] px-2 py-0.5 rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
              </div>
              <h1 className="text-2xl font-bold tracking-tight mb-4">
                {title || "タイトル未設定"}
              </h1>
              {description && (
                <p className="text-white/40 text-sm mb-8">{description}</p>
              )}
              <div className="prose-custom whitespace-pre-wrap text-white/50 text-sm leading-relaxed">
                {content || "本文を入力してください"}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // === Post list ===
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-white/30" />
            <h1 className="text-xl font-bold tracking-tight">記事管理</h1>
            <span className="text-[10px] text-white/15 bg-white/[0.03] px-2 py-0.5 rounded-full">
              {posts.length}件
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              サイトに戻る
            </Link>
            <button
              onClick={newPost}
              className="flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded-lg text-xs font-medium hover:bg-white/90 transition-colors"
            >
              <Plus size={13} />
              新しい記事
            </button>
          </div>
        </div>

        {message && (
          <p className="text-xs text-white/40 mb-4">{message}</p>
        )}

        {posts.length > 0 ? (
          <div className="border border-white/[0.04] rounded-lg overflow-hidden">
            {posts.map((post, i) => (
              <div
                key={post.slug}
                className={`flex items-center justify-between px-5 py-4 group hover:bg-white/[0.02] transition-colors ${
                  i !== posts.length - 1 ? "border-b border-white/[0.04]" : ""
                }`}
              >
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => editPost(post)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-white/15 font-mono">
                      {post.date}
                    </span>
                    <span className="text-[10px] text-white/20 bg-white/[0.03] px-1.5 py-0.5 rounded">
                      {post.locale.toUpperCase()}
                    </span>
                    {post.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-white/15"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-sm font-medium text-white/60 group-hover:text-white/80 transition-colors truncate">
                    {post.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => editPost(post)}
                    className="text-white/30 hover:text-white p-2 rounded-md hover:bg-white/[0.04] transition-all"
                    title="編集"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => removePost(post.slug)}
                    className="text-white/30 hover:text-red-400 p-2 rounded-md hover:bg-white/[0.04] transition-all"
                    title="削除"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-white/[0.04] rounded-lg">
            <FileText size={24} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/20 text-sm mb-4">記事がまだありません</p>
            <button
              onClick={newPost}
              className="text-xs text-white/40 hover:text-white border border-white/10 px-4 py-2 rounded-lg transition-colors"
            >
              最初の記事を書く
            </button>
          </div>
        )}

        {/* Help */}
        <div className="mt-10 p-5 border border-white/[0.04] rounded-lg bg-white/[0.01]">
          <h3 className="text-xs font-medium text-white/40 mb-3">
            ブログの使い方
          </h3>
          <ul className="text-[11px] text-white/25 space-y-1.5 leading-relaxed">
            <li>
              • 「新しい記事」→ タイトル・本文を入力して「保存」
            </li>
            <li>
              • 記事一覧の行をクリックすると既存の記事を編集できます
            </li>
            <li>
              • 記事はMarkdown形式で書けます（## 見出し、** 太字、``` コードブロック）
            </li>
            <li>
              • 言語を切り替えると、日本語版・英語版の記事を別々に管理できます
            </li>
            <li>
              •
              保存した記事はGitで管理されます。Vercelにデプロイすると自動的に公開されます
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Reusable input field component
function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  mono = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  mono?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] text-white/30 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20 transition-colors disabled:opacity-40 ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}
