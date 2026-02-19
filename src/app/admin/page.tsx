"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Save,
  Trash2,
  Plus,
  LogIn,
  ArrowLeft,
  FileText,
  PenTool,
  Edit3,
  Settings,
} from "lucide-react";
import Link from "next/link";
import type { OutputData } from "@editorjs/editorjs";
import SiteConfigEditor from "./SiteConfigEditor";

const BlogEditor = dynamic(
  () => import("@/components/editor/BlogEditor"),
  { ssr: false }
);

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  locale: string;
  sha?: string;
  blocks?: OutputData["blocks"];
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"blog" | "config">("blog");

  // Editor state
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [tags, setTags] = useState("");
  const [locale, setLocale] = useState("ja");
  const [editorData, setEditorData] = useState<OutputData | null>(null);
  const [isExisting, setIsExisting] = useState(false);
  const [existingSha, setExistingSha] = useState<string | undefined>();
  const [editorKey, setEditorKey] = useState(0);

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
    setEditorData(null);
    setIsExisting(false);
    setExistingSha(undefined);
    setEditorKey((k) => k + 1);
    setEditing(true);
    setMessage("");
  };

  const editPost = async (post: PostMeta) => {
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
        setExistingSha(full.sha);
        const blocks = full.blocks || [];
        setEditorData({ time: Date.now(), blocks, version: "2.28.0" });
        setEditorKey((k) => k + 1);
        setIsExisting(true);
        setEditing(true);
        setMessage("");
      }
    } catch {
      setMessage("記事の読み込みに失敗しました");
    }
  };

  const handleEditorChange = useCallback((data: OutputData) => {
    setEditorData(data);
  }, []);

  const savePost = async () => {
    if (!slug || !title) {
      setMessage("スラグとタイトルは必須です");
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
          blocks: editorData?.blocks || [],
          sha: existingSha,
        }),
      });

      if (res.ok) {
        setMessage("保存しました（GitHubにコミット済み）");
        await fetchPosts();
        setEditing(false);
      } else {
        const err = await res.json();
        setMessage(`保存に失敗: ${err.error || "不明なエラー"}`);
      }
    } catch {
      setMessage("エラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  const removePost = async (post: PostMeta) => {
    if (!confirm(`「${post.title}」を削除しますか？`)) return;

    const res = await fetch(
      `/api/admin/posts?slug=${post.slug}&sha=${post.sha}`,
      {
        method: "DELETE",
        headers,
      }
    );

    if (res.ok) {
      setMessage("削除しました");
      await fetchPosts();
    } else {
      setMessage("削除に失敗しました");
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
            <button
              onClick={savePost}
              disabled={saving}
              className="flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded-lg text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              <Save size={13} />
              {saving ? "保存中..." : "保存する"}
            </button>
          </div>

          {message && (
            <p
              className={`text-xs mb-4 ${message.includes("保存しました") ? "text-green-400/70" : "text-red-400/70"}`}
            >
              {message}
            </p>
          )}

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
                本文
              </label>
              <BlogEditor
                key={editorKey}
                data={editorData || undefined}
                onChange={handleEditorChange}
              />
              <p className="text-[10px] text-white/15 mt-1.5">
                ブロックエディタ: 「/」または「+」でブロックを追加（見出し、リスト、コード、引用など）
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === Main dashboard ===
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header + Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <PenTool size={18} className="text-white/30" />
            <h1 className="text-xl font-bold tracking-tight">管理画面</h1>
          </div>
          <Link
            href="/"
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            サイトに戻る
          </Link>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 mb-8 border-b border-white/[0.06]">
          <button
            onClick={() => setActiveTab("blog")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-wide transition-colors border-b-2 -mb-px ${
              activeTab === "blog"
                ? "border-white/40 text-white"
                : "border-transparent text-white/30 hover:text-white/60"
            }`}
          >
            <FileText size={14} />
            ブログ管理
            <span className="text-[10px] text-white/15 bg-white/[0.03] px-1.5 py-0.5 rounded-full">
              {posts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("config")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs tracking-wide transition-colors border-b-2 -mb-px ${
              activeTab === "config"
                ? "border-white/40 text-white"
                : "border-transparent text-white/30 hover:text-white/60"
            }`}
          >
            <Settings size={14} />
            サイト設定
          </button>
        </div>

        {/* Site config tab */}
        {activeTab === "config" && <SiteConfigEditor password={password} />}

        {/* Blog tab */}
        {activeTab === "blog" && (
        <>
        <div className="flex items-center justify-end mb-6">
            <button
              onClick={newPost}
              className="flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded-lg text-xs font-medium hover:bg-white/90 transition-colors"
            >
              <Plus size={13} />
              新しい記事
            </button>
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
                  i !== posts.length - 1
                    ? "border-b border-white/[0.04]"
                    : ""
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
                      <span key={tag} className="text-[10px] text-white/15">
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
                    onClick={() => removePost(post)}
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
              • エディタでは「/」キーまたは左の「+」ボタンでブロックを追加できます
            </li>
            <li>
              • 見出し、リスト、コードブロック、引用、区切り線が使えます
            </li>
            <li>
              • テキストを選択すると太字・インラインコード・マーカーなどの装飾ができます
            </li>
            <li>
              • 保存すると自動的にGitHubにコミットされ、Vercelが再デプロイします
            </li>
          </ul>
        </div>
        </>
        )}
      </div>
    </div>
  );
}

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
