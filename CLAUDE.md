# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # node_modules is not checked in
npm run dev       # Vite dev server on http://localhost:3000 (opens browser)
npm run build     # production build to build/ (not dist/)
```

`/deploy-gh-pages [repo-name]` (`.claude/commands/deploy-gh-pages.md`) deploys to GitHub Pages through `.github/workflows/deploy.yml`, which builds on every push to `main`. `vite.config.ts` sets `base: './'` so assets resolve under the `/<repo>/` subpath. Keep it relative.

There is no test runner, linter, or `tsconfig.json`. Vite strips types with SWC and does no type checking, so type errors will not fail `dev` or `build`.

## Architecture

This is a Figma Make export: a single-page React 18 + Vite treasure-hunt game. All game logic and UI live in `src/App.tsx`. `src/main.tsx` only mounts `<App />` and imports `src/index.css`.

**Game model:** `App` holds `boxes: Box[]` (3 boxes, `{ id, isOpen, hasTreasure }`), `score`, and `gameEnded`. `initializeGame()` randomly picks one treasure box. `openBox()` scores +100 for treasure and −50 for a skeleton. The game ends only after every box is open. Animations come from `motion/react` (the `motion` package, not `framer-motion`).

**Auth:** front-end only, with no backend. `src/auth.ts` keeps accounts in localStorage under the key `treasure_users`. Each account stores a SHA-256 password hash and stats: `gamesPlayed`, `highScore` and `totalScore`. The current session is stored under `treasure_current_user`. `App` renders `src/components/LoginForm.tsx` until a user logs in. When a game ends, `openBox()` calls `recordGame()`.

**Styling: `src/index.css` is precompiled Tailwind v4 output, not a Tailwind source file.** Tailwind is not installed and there is no PostCSS or Tailwind config, so only utility classes already in `index.css` work. For example, `mt-1`, `mt-2`, and `mt-4` exist but `mt-3` does not. When you add a new class, grep `index.css` for it first. If it's missing, use an inline `style` or add the CSS rule to `index.css` yourself. `src/styles/globals.css` holds the shadcn theme tokens, but nothing imports it.

**UI kit:** `src/components/ui/` is a vendored shadcn/ui set built on Radix. Only `Button` is used today. These files import packages with version-pinned specifiers (for example `@radix-ui/react-slot@1.1.2`), which resolve only through the alias table in `vite.config.ts`. If you add a dependency imported that way, add a matching alias. `@` is aliased to `src/`.

**Assets:** images in `src/assets/` and audio in `src/audios/` are imported as ES modules, so Vite resolves them to URLs. `src/results/` holds screenshots of expected outcomes, not runtime assets. `openBox()` plays `chest_open.mp3` for treasure and `chest_open_with_evil_laugh.mp3` for skeletons. `assets/key.png` is the custom cursor shown over unopened chests.

`src/guidelines/Guidelines.md` is an empty Figma Make template with no active rules.
