# v0.6.0

## New

- **Built-in code editor with syntax highlighting** — Open any file and edit it directly with proper syntax highlighting for 13 languages including TypeScript, Rust, Python, Go, Java, C/C++, PHP, SQL, and more
- **Bracket matching, code folding, and auto-indent** — The editor now behaves like a real code editor with smart editing features powered by CodeMirror 6
- **Native find and replace** — Press Cmd+F to search and Cmd+H to replace, with match highlighting and navigation built into the editor
- **Auto-save** — Files save automatically after 2 seconds of inactivity, with a manual Cmd+S option and a dirty indicator in the header
- **AI provider detection during setup** — The onboarding wizard now detects which AI tools you have installed and shows install commands for missing ones

## Improved

- **Redesigned theme picker in onboarding** — Themes are now grouped into Dark and Light sections in a compact grid, making it easier to browse all 29 themes at a glance
- **All theme previews now display correctly** — 14 themes that previously showed empty squares in the onboarding picker now show proper color previews
- **Settings export is smarter** — Exported files now include version metadata, and machine-specific settings like window size and workspace layout are excluded so imports work across different machines
- **Settings import applies changes immediately** — Importing settings now instantly updates the theme, analytics preferences, and autonomous mode without requiring a restart
- **Plugin text and button sizes scale consistently** — All plugin panels now follow the global UI scale setting

## Fixed

- **Save & Close no longer loses data on failure** — Previously, if a file save failed, the editor would close anyway and discard unsaved changes
- **External file changes no longer overwrite your edits** — If a file is changed on disk while you have unsaved edits, the editor now keeps your work instead of silently replacing it
- **Editor keyboard shortcuts no longer re-register on every keystroke** — Fixed a performance issue where global key listeners were torn down and recreated on each character typed
- **Find matches no longer recalculate on every render** — Improved performance when using find/replace on large files
- **Hash comments no longer highlight incorrectly in JavaScript and Rust** — The `#` character was incorrectly styled as a comment in languages that don't use hash comments
- **Importing a non-settings JSON file now shows an error** — Previously, importing an unrelated JSON file would silently do nothing
- **Two settings were silently failing to save** — Activity bar order and plugin uninstall tracking now persist correctly
