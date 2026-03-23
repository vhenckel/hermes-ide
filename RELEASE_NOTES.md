# v0.6.3

## New

- **Create sessions from remote branches** — The branch picker now shows both local and remote branches in a single unified list. You can create a session directly from a remote branch without manually checking it out first. A "Fetch" button lets you refresh the list on demand.
- **Editor minimap** — A code overview sidebar is now available in the editor, giving you a bird's-eye view of your file.

## Improved

- **Cleaner branch selection UI** — The branch picker has been simplified with less visual clutter, tighter rows, and commit messages shown on hover instead of inline.
- **Better worktree reliability** — The app now detects when a working directory is deleted externally and notifies you immediately. Stale worktree records are cleaned up automatically on startup, and you'll be notified if cleanup fails during session close.
- **New app icon** — Updated to the new circuit-H design across all platforms.

## Fixed

- Long tool names no longer overflow in the context panel.
