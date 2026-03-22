import { tags } from "@lezer/highlight";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import type { Extension } from "@codemirror/state";

/**
 * Read a CSS custom property from :root, returning `fallback` when
 * the variable is not defined or the value is empty.
 */
export function getCSSVar(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

/**
 * Build a CodeMirror 6 `HighlightStyle` that pulls every colour from
 * the app's CSS custom properties.  Because the variables are read at
 * call-time, re-invoking after a theme switch yields fresh colours.
 */
export function createEditorHighlightStyle(): HighlightStyle {
  const magenta = getCSSVar("--magenta", "#c678dd");
  const green   = getCSSVar("--green",   "#98c379");
  const yellow  = getCSSVar("--yellow",  "#e5c07b");
  const blue    = getCSSVar("--blue",    "#61afef");
  const cyan    = getCSSVar("--cyan",    "#56b6c2");
  const red     = getCSSVar("--red",     "#e06c75");
  const text0   = getCSSVar("--text-0",  "#d4d4d4");
  const text1   = getCSSVar("--text-1",  "#abb2bf");
  const text2   = getCSSVar("--text-2",  "#6b7280");
  const text3   = getCSSVar("--text-3",  "#5c6370");
  const accent  = getCSSVar("--accent",  "#61afef");

  return HighlightStyle.define([
    // Keywords
    { tag: tags.keyword,         color: magenta },
    { tag: tags.modifier,        color: magenta },
    { tag: tags.operatorKeyword, color: magenta },

    // Strings & regexps
    { tag: tags.string, color: green },
    { tag: tags.regexp, color: green },

    // Comments (italic to match .syn-comment)
    { tag: tags.comment,      color: text3, fontStyle: "italic" },
    { tag: tags.lineComment,  color: text3, fontStyle: "italic" },
    { tag: tags.blockComment, color: text3, fontStyle: "italic" },

    // Numbers & attributes
    { tag: tags.number,        color: yellow },
    { tag: tags.integer,       color: yellow },
    { tag: tags.float,         color: yellow },
    { tag: tags.attributeName, color: yellow },

    // Booleans / null / atom
    { tag: tags.bool, color: yellow },
    { tag: tags.null, color: yellow },
    { tag: tags.atom, color: cyan },

    // Functions
    { tag: tags.function(tags.variableName),                      color: blue },
    { tag: tags.function(tags.definition(tags.variableName)),     color: blue },

    // Types & namespaces
    { tag: tags.typeName,  color: cyan },
    { tag: tags.className, color: cyan },
    { tag: tags.namespace, color: cyan },

    // Operators & punctuation
    { tag: tags.operator,    color: text2 },
    { tag: tags.punctuation, color: text2 },

    // Properties & tags
    { tag: tags.propertyName, color: red },
    { tag: tags.tagName,      color: red },
    { tag: tags.angleBracket, color: red },

    // Default variable / name
    { tag: tags.variableName, color: text1 },
    { tag: tags.name,         color: text1 },

    // Headings & emphasis
    { tag: tags.heading, color: text0, fontWeight: "bold" },
    { tag: tags.strong,  color: text0, fontWeight: "bold" },

    // Links
    { tag: tags.link, color: accent, textDecoration: "underline" },
    { tag: tags.url,  color: accent, textDecoration: "underline" },

    // Meta
    { tag: tags.meta, color: text3 },
  ]);
}

/**
 * Convenience wrapper: returns a CodeMirror `Extension` that applies
 * syntax highlighting using the current theme's CSS variables.
 */
export function createSyntaxHighlighting(): Extension {
  return syntaxHighlighting(createEditorHighlightStyle());
}
