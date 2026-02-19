"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";

interface Skill {
  name: string;
  level: number;
}

interface ProjectConfig {
  id: string;
  title: { ja: string; en: string };
  description: { ja: string; en: string };
  tech: string[];
  category: string;
  github: string;
  demo: string;
  featured: boolean;
}

interface SiteConfigData {
  hero: {
    greeting: { ja: string; en: string };
    name: { ja: string; en: string };
    title: string;
    subtitle: { ja: string; en: string };
  };
  about: {
    description: { ja: string; en: string };
    skills: Skill[];
  };
  projects: ProjectConfig[];
  footer: {
    copyright: { ja: string; en: string };
  };
}

export default function SiteConfigEditor({ password }: { password: string }) {
  const [config, setConfig] = useState<SiteConfigData | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${password}`,
  };

  useEffect(() => {
    fetchConfig();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/admin/config", { headers });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setSha(data.sha);
      }
    } catch {
      setMessage("設定の読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers,
        body: JSON.stringify({ config, sha }),
      });
      if (res.ok) {
        setMessage("保存しました（GitHubにコミット済み）");
        await fetchConfig();
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

  const updateHero = (
    key: keyof SiteConfigData["hero"],
    lang: "ja" | "en" | null,
    value: string
  ) => {
    if (!config) return;
    const hero = { ...config.hero };
    if (lang && key !== "title") {
      (hero[key] as { ja: string; en: string })[lang] = value;
    } else {
      (hero as Record<string, unknown>)[key] = value;
    }
    setConfig({ ...config, hero });
  };

  const updateAboutDesc = (lang: "ja" | "en", value: string) => {
    if (!config) return;
    const about = {
      ...config.about,
      description: { ...config.about.description, [lang]: value },
    };
    setConfig({ ...config, about });
  };

  const updateSkill = (index: number, field: "name" | "level", value: string | number) => {
    if (!config) return;
    const skills = [...config.about.skills];
    skills[index] = { ...skills[index], [field]: value };
    setConfig({ ...config, about: { ...config.about, skills } });
  };

  const addSkill = () => {
    if (!config) return;
    setConfig({
      ...config,
      about: {
        ...config.about,
        skills: [...config.about.skills, { name: "", level: 5 }],
      },
    });
  };

  const removeSkill = (index: number) => {
    if (!config) return;
    const skills = config.about.skills.filter((_, i) => i !== index);
    setConfig({ ...config, about: { ...config.about, skills } });
  };

  const updateProject = (
    id: string,
    field: string,
    value: unknown,
    lang?: "ja" | "en"
  ) => {
    if (!config) return;
    const projects = config.projects.map((p) => {
      if (p.id !== id) return p;
      if (lang && (field === "title" || field === "description")) {
        return {
          ...p,
          [field]: { ...(p[field] as { ja: string; en: string }), [lang]: value },
        };
      }
      return { ...p, [field]: value };
    });
    setConfig({ ...config, projects });
  };

  const addProject = () => {
    if (!config) return;
    const newId = `project-${Date.now()}`;
    setConfig({
      ...config,
      projects: [
        ...config.projects,
        {
          id: newId,
          title: { ja: "", en: "" },
          description: { ja: "", en: "" },
          tech: [],
          category: "webapp",
          github: "",
          demo: "",
          featured: false,
        },
      ],
    });
    setExpandedProject(newId);
  };

  const removeProject = (id: string) => {
    if (!config) return;
    if (!confirm("このプロジェクトを削除しますか？")) return;
    setConfig({
      ...config,
      projects: config.projects.filter((p) => p.id !== id),
    });
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-white/20 text-sm">読み込み中...</div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-20 text-red-400/60 text-sm">
        設定ファイルの読み込みに失敗しました
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Save button */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-white/25">
          変更はGitHubにコミットされ、自動的にデプロイされます
        </p>
        <button
          onClick={saveConfig}
          disabled={saving}
          className="flex items-center gap-1.5 bg-white text-black px-5 py-2.5 rounded-lg text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          <Save size={13} />
          {saving ? "保存中..." : "すべて保存"}
        </button>
      </div>

      {message && (
        <p
          className={`text-xs ${message.includes("保存しました") ? "text-green-400/70" : "text-red-400/70"}`}
        >
          {message}
        </p>
      )}

      {/* Hero Section */}
      <Section title="ヒーローセクション">
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="挨拶（日本語）"
            value={config.hero.greeting.ja}
            onChange={(v) => updateHero("greeting", "ja", v)}
          />
          <Field
            label="挨拶（English）"
            value={config.hero.greeting.en}
            onChange={(v) => updateHero("greeting", "en", v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="名前（日本語）"
            value={config.hero.name.ja}
            onChange={(v) => updateHero("name", "ja", v)}
          />
          <Field
            label="名前（English）"
            value={config.hero.name.en}
            onChange={(v) => updateHero("name", "en", v)}
          />
        </div>
        <Field
          label="肩書き"
          value={config.hero.title}
          onChange={(v) => updateHero("title", null, v)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="サブタイトル（日本語）"
            value={config.hero.subtitle.ja}
            onChange={(v) => updateHero("subtitle", "ja", v)}
          />
          <Field
            label="サブタイトル（English）"
            value={config.hero.subtitle.en}
            onChange={(v) => updateHero("subtitle", "en", v)}
          />
        </div>
      </Section>

      {/* About Section */}
      <Section title="自己紹介">
        <TextareaField
          label="紹介文（日本語）"
          value={config.about.description.ja}
          onChange={(v) => updateAboutDesc("ja", v)}
          rows={4}
        />
        <TextareaField
          label="紹介文（English）"
          value={config.about.description.en}
          onChange={(v) => updateAboutDesc("en", v)}
          rows={4}
        />
      </Section>

      {/* Skills */}
      <Section title="スキル">
        <div className="space-y-2">
          {config.about.skills.map((skill, i) => (
            <div key={i} className="flex items-center gap-3">
              <GripVertical size={14} className="text-white/10 shrink-0" />
              <input
                type="text"
                value={skill.name}
                onChange={(e) => updateSkill(i, "name", e.target.value)}
                placeholder="スキル名"
                className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20 font-mono"
              />
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={skill.level}
                  onChange={(e) => updateSkill(i, "level", parseInt(e.target.value))}
                  className="w-24 accent-white"
                />
                <span className="text-xs text-white/30 w-5 text-center font-mono">
                  {skill.level}
                </span>
              </div>
              <button
                onClick={() => removeSkill(i)}
                className="text-white/20 hover:text-red-400 p-1 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addSkill}
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 border border-white/[0.08] px-3 py-2 rounded-lg transition-colors mt-2"
        >
          <Plus size={12} />
          スキルを追加
        </button>
      </Section>

      {/* Projects */}
      <Section title="プロジェクト">
        <div className="space-y-2">
          {config.projects.map((project) => {
            const isExpanded = expandedProject === project.id;
            return (
              <div
                key={project.id}
                className="border border-white/[0.06] rounded-lg overflow-hidden"
              >
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() =>
                    setExpandedProject(isExpanded ? null : project.id)
                  }
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${project.featured ? "bg-white/40" : "bg-white/10"}`}
                    />
                    <span className="text-sm text-white/60">
                      {project.title.ja || project.id}
                    </span>
                    <span className="text-[10px] text-white/20 bg-white/[0.03] px-1.5 py-0.5 rounded">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProject(project.id);
                      }}
                      className="text-white/15 hover:text-red-400 p-1 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                    {isExpanded ? (
                      <ChevronUp size={14} className="text-white/30" />
                    ) : (
                      <ChevronDown size={14} className="text-white/30" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 space-y-3 border-t border-white/[0.04]">
                    <Field
                      label="ID（URL用）"
                      value={project.id}
                      onChange={(v) => updateProject(project.id, "id", v)}
                      mono
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label="タイトル（日本語）"
                        value={project.title.ja}
                        onChange={(v) =>
                          updateProject(project.id, "title", v, "ja")
                        }
                      />
                      <Field
                        label="タイトル（English）"
                        value={project.title.en}
                        onChange={(v) =>
                          updateProject(project.id, "title", v, "en")
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <TextareaField
                        label="説明（日本語）"
                        value={project.description.ja}
                        onChange={(v) =>
                          updateProject(project.id, "description", v, "ja")
                        }
                        rows={2}
                      />
                      <TextareaField
                        label="説明（English）"
                        value={project.description.en}
                        onChange={(v) =>
                          updateProject(project.id, "description", v, "en")
                        }
                        rows={2}
                      />
                    </div>
                    <Field
                      label="技術スタック（カンマ区切り）"
                      value={project.tech.join(", ")}
                      onChange={(v) =>
                        updateProject(
                          project.id,
                          "tech",
                          v.split(",").map((t) => t.trim()).filter(Boolean)
                        )
                      }
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] text-white/30 uppercase tracking-wider mb-1">
                          カテゴリ
                        </label>
                        <select
                          value={project.category}
                          onChange={(e) =>
                            updateProject(project.id, "category", e.target.value)
                          }
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                        >
                          <option value="webapp" className="bg-black">Web App</option>
                          <option value="desktop" className="bg-black">Desktop</option>
                          <option value="extension" className="bg-black">Extension</option>
                        </select>
                      </div>
                      <Field
                        label="GitHub URL"
                        value={project.github}
                        onChange={(v) =>
                          updateProject(project.id, "github", v)
                        }
                        mono
                      />
                      <Field
                        label="Demo URL"
                        value={project.demo}
                        onChange={(v) =>
                          updateProject(project.id, "demo", v)
                        }
                        mono
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={project.featured}
                        onChange={(e) =>
                          updateProject(project.id, "featured", e.target.checked)
                        }
                        className="accent-white"
                      />
                      <span className="text-xs text-white/40">注目プロジェクト</span>
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={addProject}
          className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 border border-white/[0.08] px-3 py-2 rounded-lg transition-colors mt-2"
        >
          <Plus size={12} />
          プロジェクトを追加
        </button>
      </Section>

      {/* Footer */}
      <Section title="フッター">
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="コピーライト（日本語）"
            value={config.footer.copyright.ja}
            onChange={(v) =>
              setConfig({
                ...config,
                footer: {
                  copyright: { ...config.footer.copyright, ja: v },
                },
              })
            }
          />
          <Field
            label="コピーライト（English）"
            value={config.footer.copyright.en}
            onChange={(v) =>
              setConfig({
                ...config,
                footer: {
                  copyright: { ...config.footer.copyright, en: v },
                },
              })
            }
          />
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white/50 border-b border-white/[0.06] pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] text-white/30 uppercase tracking-wider mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20 transition-colors ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-[10px] text-white/30 uppercase tracking-wider mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/20 transition-colors resize-y leading-relaxed"
      />
    </div>
  );
}
