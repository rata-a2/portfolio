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
      className="min-h-[400px] bg-white rounded-lg px-6 py-4 text-sm text-neutral-800 border border-neutral-200 focus-within:border-neutral-400 transition-colors [&_.ce-block__content]:max-w-none [&_.ce-toolbar__content]:max-w-none [&_.codex-editor__redactor]:pb-8 [&_.ce-paragraph]:text-neutral-700 [&_.ce-paragraph]:leading-relaxed [&_.ce-header]:text-neutral-900 [&_.ce-header]:font-bold [&_.ce-code__textarea]:bg-neutral-50 [&_.ce-code__textarea]:text-neutral-700 [&_.ce-code__textarea]:border-neutral-200 [&_.cdx-quote__text]:text-neutral-600 [&_.cdx-quote__text]:border-l-neutral-300 [&_.cdx-quote__caption]:text-neutral-400 [&_.ce-toolbar__plus]:text-neutral-400 [&_.ce-toolbar__plus:hover]:text-neutral-700 [&_.ce-toolbar__settings-btn]:text-neutral-400 [&_.ce-toolbar__settings-btn:hover]:text-neutral-700 [&_.cdx-list__item]:text-neutral-700 [&_.ce-inline-toolbar]:bg-white [&_.ce-inline-toolbar]:border-neutral-200 [&_.ce-inline-toolbar]:shadow-lg [&_.ce-inline-tool]:text-neutral-600 [&_.ce-conversion-toolbar]:bg-white [&_.ce-conversion-toolbar]:border-neutral-200 [&_.ce-conversion-toolbar]:shadow-lg [&_.ce-conversion-tool]:text-neutral-600 [&_.ce-popover]:bg-white [&_.ce-popover]:border-neutral-200 [&_.ce-popover]:shadow-lg [&_.ce-popover-item__title]:text-neutral-700 [&_.ce-popover-item__icon]:text-neutral-500 [&_.cdx-search-field]:bg-neutral-50 [&_.cdx-search-field__input]:text-neutral-700 [&_.ce-delimiter]:text-neutral-300"
    />
  );
}
