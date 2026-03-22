import { type LanguageSupport } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import { rust } from "@codemirror/lang-rust";
import { python } from "@codemirror/lang-python";
import { go } from "@codemirror/lang-go";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";
import { sql } from "@codemirror/lang-sql";
import { yaml } from "@codemirror/lang-yaml";

/**
 * Map from language identifier to a factory that produces the CM6 LanguageSupport.
 * Each factory is called once; the result is cached.
 */
const languageFactories: Record<string, () => LanguageSupport> = {
  javascript: () => javascript({ jsx: true, typescript: false }),
  typescript: () => javascript({ jsx: true, typescript: true }),
  rust: () => rust(),
  python: () => python(),
  go: () => go(),
  java: () => java(),
  cpp: () => cpp(),
  php: () => php(),
  sql: () => sql(),
  yaml: () => yaml(),
  html: () => html(),
  css: () => css(),
  json: () => json(),
  markdown: () => markdown(),
};

/** Cache so each language is only instantiated once. */
const cache = new Map<string, LanguageSupport>();

/**
 * Returns the CodeMirror 6 LanguageSupport for a language identifier,
 * or `null` for unsupported / plaintext languages.
 */
export function getLanguageSupport(language: string): LanguageSupport | null {
  const id = language.toLowerCase();

  const cached = cache.get(id);
  if (cached) {
    return cached;
  }

  const factory = languageFactories[id];
  if (!factory) {
    return null;
  }

  const support = factory();
  cache.set(id, support);
  return support;
}

/**
 * Extension-to-language-id mapping.
 * Matches the Rust backend's file-type detection exactly.
 */
const extensionMap: Record<string, string> = {
  // Rust
  rs: "rust",

  // TypeScript
  ts: "typescript",
  tsx: "typescript",

  // JavaScript
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",

  // Python
  py: "python",

  // Go
  go: "go",

  // Java
  java: "java",

  // C / C++ (C uses cpp grammar)
  c: "cpp",
  h: "cpp",
  cpp: "cpp",
  hpp: "cpp",
  cc: "cpp",
  cxx: "cpp",

  // PHP
  php: "php",

  // SQL
  sql: "sql",

  // YAML
  yaml: "yaml",
  yml: "yaml",

  // HTML
  html: "html",
  htm: "html",

  // CSS variants
  css: "css",
  scss: "css",
  sass: "css",
  less: "css",

  // JSON
  json: "json",

  // Markdown
  md: "markdown",
  markdown: "markdown",

  // Kotlin — falls back to Java grammar
  kt: "java",
  kts: "java",

  // Shell — no CM package bundled, maps to plaintext
  sh: "shell",
  bash: "shell",
  zsh: "shell",

  // Dockerfile — no CM package bundled
  dockerfile: "dockerfile",

  // Other languages without bundled CM packages
  rb: "ruby",
  swift: "swift",
  dart: "dart",
  lua: "lua",
  r: "r",
  ex: "elixir",
  exs: "elixir",
  cs: "csharp",
  toml: "toml",
  xml: "xml",
  svg: "xml",
};

/**
 * Maps a file extension (without the leading dot) to a language identifier.
 * Returns `"plaintext"` for unrecognised extensions.
 */
export function getLanguageForExtension(ext: string): string {
  const normalized = ext.toLowerCase().replace(/^\./, "");
  return extensionMap[normalized] ?? "plaintext";
}
