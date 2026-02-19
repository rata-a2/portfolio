export type ProjectCategory = "webapp" | "desktop" | "extension";

export interface Project {
  id: string;
  title: { ja: string; en: string };
  description: { ja: string; en: string };
  tech: string[];
  category: ProjectCategory;
  github?: string;
  demo?: string;
  image: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "devcheck",
    title: {
      ja: "DevCheck",
      en: "DevCheck",
    },
    description: {
      ja: "OGPプレビュー、SMTPテスト、パフォーマンス計測など7つの開発検証機能を搭載したElectronデスクトップアプリ。",
      en: "Electron desktop app with 7 dev verification features: OGP preview, SMTP testing, performance profiling, and more.",
    },
    tech: ["Electron", "React", "TypeScript", "Tailwind CSS"],
    category: "desktop",
    github: "https://github.com/rata-a2/DevCheck",
    image: "/images/projects/devcheck.svg",
    featured: true,
  },
  {
    id: "stock-battle-game",
    title: {
      ja: "Stock Battle Game",
      en: "Stock Battle Game",
    },
    description: {
      ja: "友達とリアルタイムで株取引バトル。プライベートルーム、成行・指値注文、グローバルランキング対応。",
      en: "Competitive stock trading game with private rooms, market/limit orders, and global rankings.",
    },
    tech: ["React", "Express", "PostgreSQL", "Prisma", "WebSocket"],
    category: "webapp",
    github: "https://github.com/rata-a2/stock-battle-game",
    image: "/images/projects/stock-battle.svg",
    featured: true,
  },
  {
    id: "pubcom-viewer",
    title: {
      ja: "パブコメわかりやすく",
      en: "PubCom Viewer",
    },
    description: {
      ja: "パブリックコメントをAIで要約し、メルマガ・LINE・X(Twitter)で自動配信するプラットフォーム。",
      en: "AI-powered public comment summarizer with multi-channel distribution via email, LINE, and X.",
    },
    tech: ["Next.js", "React 19", "Gemini AI", "LINE Bot", "Twitter API"],
    category: "webapp",
    image: "/images/projects/pubcom.svg",
    featured: true,
  },
  {
    id: "devlog-ai",
    title: {
      ja: "DevLog AI",
      en: "DevLog AI",
    },
    description: {
      ja: "AI開発時のエラー履歴を自動記録するChrome拡張 + Web管理画面。モノレポ構成。",
      en: "Chrome extension + web dashboard for tracking AI development error history. Monorepo architecture.",
    },
    tech: ["Chrome Extension", "Next.js", "Supabase", "TypeScript"],
    category: "extension",
    image: "/images/projects/devlog.svg",
    featured: true,
  },
  {
    id: "truck-dispatch",
    title: {
      ja: "配車システム",
      en: "Truck Dispatch System",
    },
    description: {
      ja: "Google Maps連携の配車最適化システム。ALNS最適化アルゴリズムでルート計算。Docker対応。",
      en: "Dispatch optimization system with Google Maps integration. ALNS algorithm for route calculation.",
    },
    tech: ["React", "Express", "Google Maps", "Docker", "SQLite"],
    category: "webapp",
    image: "/images/projects/dispatch.svg",
    featured: true,
  },
  {
    id: "chatwork-enhanced-pro",
    title: {
      ja: "Chatwork Enhanced Pro",
      en: "Chatwork Enhanced Pro",
    },
    description: {
      ja: "Chatworkの生産性を上げるChrome拡張。ルームリサイズ、テンプレート、シンタックスハイライト。",
      en: "Chrome extension to boost Chatwork productivity. Room resizing, templates, syntax highlighting.",
    },
    tech: ["Chrome Extension", "JavaScript", "Manifest V3"],
    category: "extension",
    image: "/images/projects/chatwork.svg",
    featured: false,
  },
  {
    id: "japanese-stock-pro",
    title: {
      ja: "Japanese Stock Pro",
      en: "Japanese Stock Pro",
    },
    description: {
      ja: "日本株の投資分析Webアプリ。リアルタイムチャート、銘柄スクリーニング機能搭載。",
      en: "Investment analysis web app for Japanese stocks with real-time charts and screening features.",
    },
    tech: ["Next.js", "TypeScript", "Recharts", "Yahoo Finance"],
    category: "webapp",
    image: "/images/projects/stock-pro.svg",
    featured: false,
  },
  {
    id: "password-generator",
    title: {
      ja: "Password Generator",
      en: "Password Generator",
    },
    description: {
      ja: "安全なパスワードを自動生成・管理するChrome拡張機能。",
      en: "Chrome extension for generating and managing secure passwords.",
    },
    tech: ["Chrome Extension", "JavaScript", "Manifest V3"],
    category: "extension",
    image: "/images/projects/password.svg",
    featured: false,
  },
];
