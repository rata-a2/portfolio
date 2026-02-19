"use client";

import { useEffect, useRef, useCallback } from "react";
import type EditorJS from "@editorjs/editorjs";
import type { OutputData } from "@editorjs/editorjs";

interface BlogEditorProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  holder?: string;
}

export default function BlogEditor({
  data,
  onChange,
  holder = "editorjs",
}: BlogEditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);

  const initEditor = useCallback(async () => {
    if (editorRef.current) return;

    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const Quote = (await import("@editorjs/quote")).default;
    const Delimiter = (await import("@editorjs/delimiter")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const Marker = (await import("@editorjs/marker")).default;

    const editor = new EditorJS({
      holder,
      data: data || undefined,
      placeholder: "ここに記事を書き始めてください...",
      tools: {
        header: {
          class: Header as unknown as EditorJS.BlockToolConstructable,
          config: {
            levels: [2, 3, 4],
            defaultLevel: 2,
          },
          inlineToolbar: true,
        },
        list: {
          class: List as unknown as EditorJS.BlockToolConstructable,
          inlineToolbar: true,
        },
        code: {
          class: Code as unknown as EditorJS.BlockToolConstructable,
        },
        quote: {
          class: Quote as unknown as EditorJS.BlockToolConstructable,
          inlineToolbar: true,
        },
        delimiter: {
          class: Delimiter as unknown as EditorJS.BlockToolConstructable,
        },
        inlineCode: {
          class: InlineCode as unknown as EditorJS.InlineToolConstructable,
        },
        marker: {
          class: Marker as unknown as EditorJS.InlineToolConstructable,
        },
      },
      onChange: async (api) => {
        const output = await api.saver.save();
        onChange?.(output);
      },
      minHeight: 300,
    });

    editorRef.current = editor;
  }, [data, holder, onChange]);

  useEffect(() => {
    initEditor();

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={holderRef}
      id={holder}
      className="min-h-[400px] bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white focus-within:border-white/20 transition-colors [&_.ce-block__content]:max-w-none [&_.ce-toolbar__content]:max-w-none [&_.codex-editor__redactor]:pb-8 [&_.ce-paragraph]:text-white/70 [&_.ce-paragraph]:leading-relaxed [&_.ce-header]:text-white [&_.ce-header]:font-bold [&_.ce-code__textarea]:bg-white/5 [&_.ce-code__textarea]:text-white/60 [&_.ce-code__textarea]:border-white/10 [&_.cdx-quote__text]:text-white/50 [&_.cdx-quote__text]:border-l-white/20 [&_.cdx-quote__caption]:text-white/30 [&_.ce-toolbar__plus]:text-white/30 [&_.ce-toolbar__settings-btn]:text-white/30 [&_.cdx-list__item]:text-white/70 [&_.ce-inline-toolbar]:bg-neutral-900 [&_.ce-inline-toolbar]:border-white/10 [&_.ce-inline-tool]:text-white/60 [&_.ce-conversion-toolbar]:bg-neutral-900 [&_.ce-conversion-toolbar]:border-white/10 [&_.ce-conversion-tool]:text-white/60 [&_.ce-popover]:bg-neutral-900 [&_.ce-popover]:border-white/10 [&_.ce-popover-item__title]:text-white/70 [&_.ce-popover-item__icon]:text-white/50 [&_.cdx-search-field]:bg-white/5 [&_.cdx-search-field__input]:text-white/70 [&_.ce-delimiter]:text-white/20"
    />
  );
}
