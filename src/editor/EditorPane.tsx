import "../styles/components/EditorPane.css";
import { useEffect, useRef } from "react";
import { EditorState, Compartment, Transaction } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, highlightActiveLine } from "@codemirror/view";
import { history, defaultKeymap, historyKeymap } from "@codemirror/commands";
import { foldGutter, foldKeymap, indentOnInput, bracketMatching, syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { search, searchKeymap } from "@codemirror/search";
import { getLanguageSupport } from "./languageRegistry";
import { createSyntaxHighlighting } from "./editorTheme";

interface EditorPaneProps {
  content: string;
  language: string;
  onContentChange: (value: string) => void;
  onSave: () => void;
}

const baseTheme = EditorView.theme({
  ".cm-editor": {
    height: "100%",
    background: "transparent",
  },
  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-sm)",
  },
  ".cm-content": {
    caretColor: "var(--accent)",
    lineHeight: "1.5",
  },
  ".cm-gutters": {
    background: "var(--bg-0)",
    borderRight: "1px solid var(--border)",
    color: "var(--text-3)",
  },
  ".cm-activeLine": {
    background: "var(--bg-hover)",
  },
  ".cm-activeLineGutter": {
    background: "var(--bg-hover)",
  },
  ".cm-selectionBackground": {
    background: "var(--accent-dim)",
  },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "var(--accent-dim)",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--accent)",
  },
  ".cm-matchingBracket": {
    background: "var(--accent-dim)",
    outline: "1px solid var(--accent)",
  },
  ".cm-searchMatch": {
    background: "rgba(255, 176, 0, 0.25)",
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    background: "rgba(255, 176, 0, 0.55)",
    outline: "1px solid var(--yellow)",
  },
  ".cm-foldPlaceholder": {
    background: "var(--bg-2)",
    border: "1px solid var(--border)",
    color: "var(--text-3)",
  },
});

export function EditorPane({ content, language, onContentChange, onSave }: EditorPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onContentChangeRef = useRef(onContentChange);
  const onSaveRef = useRef(onSave);
  const languageCompartment = useRef(new Compartment());
  const themeCompartment = useRef(new Compartment());

  // Keep callback refs up to date
  onContentChangeRef.current = onContentChange;
  onSaveRef.current = onSave;

  // Create and destroy EditorView
  useEffect(() => {
    if (!containerRef.current) return;

    const langSupport = getLanguageSupport(language);

    const state = EditorState.create({
      doc: content,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        bracketMatching(),
        closeBrackets(),
        highlightActiveLine(),
        search(),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          {
            key: "Mod-s",
            run: () => {
              onSaveRef.current();
              return true;
            },
          },
        ]),
        languageCompartment.current.of(langSupport ? [langSupport] : []),
        themeCompartment.current.of(createSyntaxHighlighting()),
        baseTheme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onContentChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.domEventHandlers({
          keydown(event) {
            // Prevent tab from moving focus out of the editor; let CM handle indent
            if (event.key === "Tab") {
              event.preventDefault();
            }
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Only run on mount/unmount — content and language changes are handled by
    // dedicated effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external content changes (file switch, git discard reload)
  // Uses addToHistory: false so the user can't Cmd+Z back to stale/empty content
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentDoc = view.state.doc.toString();
    if (currentDoc !== content) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: content,
        },
        annotations: Transaction.addToHistory.of(false),
      });
    }
  }, [content]);

  // Swap language when the language prop changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const langSupport = getLanguageSupport(language);
    view.dispatch({
      effects: languageCompartment.current.reconfigure(langSupport ? [langSupport] : []),
    });
  }, [language]);

  // Hot-swap syntax colours when the app theme changes
  useEffect(() => {
    const handler = () => {
      const view = viewRef.current;
      if (!view) return;
      // Re-read CSS variables after theme switch and rebuild highlight style
      requestAnimationFrame(() => {
        view.dispatch({
          effects: themeCompartment.current.reconfigure(createSyntaxHighlighting()),
        });
      });
    };
    window.addEventListener("hermes:theme-changed", handler);
    return () => window.removeEventListener("hermes:theme-changed", handler);
  }, []);

  return <div ref={containerRef} className="cm-editor-container" />;
}
