# rata. — ポートフォリオサイト

Full-Stack Developer「らた。」のポートフォリオサイト。

## 技術スタック

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** — スクロール連動アニメーション
- **Canvas 2D** — パーティクル背景（自作・ライブラリ不使用）
- **next-intl** — 日本語/英語切り替え
- **MDX + gray-matter** — ブログシステム

## セットアップ

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

http://localhost:3000 でアクセス。

## ページ構成

| パス | 内容 |
|------|------|
| `/` | メインページ（Hero / About / Projects / Blog） |
| `/blog` | ブログ記事一覧 |
| `/blog/[slug]` | ブログ記事詳細 |
| `/admin` | ブログ管理画面 |

## ブログの書き方

### 管理画面から書く

1. `/admin` にアクセス
2. パスワードを入力してログイン
3. 「新しい記事」をクリック
4. タイトル・本文（Markdown）を入力して「保存」
5. 既存の記事は一覧からクリックして編集

### ファイルで直接書く

`content/blog/` に MDX ファイルを作成：

```mdx
---
title: "記事のタイトル"
description: "概要テキスト"
date: "2026-02-18"
tags: ["TypeScript", "React"]
locale: "ja"
---

## 見出し

本文をここに書きます。
```

## 日本語/英語切り替え

- ナビゲーション右上の「EN / JA」ボタンで切り替え
- 記事は `locale` フィールド（`ja` / `en`）で言語別に管理
- UIテキストは `messages/ja.json` / `messages/en.json` で定義

## 環境変数

`.env.local` を作成：

```
ADMIN_PASSWORD=任意のパスワード
```

設定しない場合のデフォルトは `admin`。

## デプロイ

Vercel にデプロイ：

```bash
npx vercel
```

環境変数 `ADMIN_PASSWORD` を Vercel のダッシュボードから設定してください。

## ディレクトリ構造

```
src/
├── app/              # ページ・ルーティング
│   ├── admin/        # ブログ管理画面
│   ├── api/          # API Route（ブログCRUD）
│   └── blog/         # ブログページ
├── components/
│   ├── canvas/       # パーティクル背景
│   ├── sections/     # Hero, About, Projects, Blog セクション
│   └── ui/           # 共通UIコンポーネント
├── lib/              # ユーティリティ（プロジェクトデータ, ブログ処理）
└── i18n/             # 国際化設定

content/blog/         # MDXブログ記事
messages/             # 日英テキスト定義
public/               # 静的ファイル（ロゴ, ファビコン）
```
