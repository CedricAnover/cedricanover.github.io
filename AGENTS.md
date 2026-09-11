# AGENTS.md — cedricanover.github.io

Personal static site (plain HTML + Tailwind v3 + vanilla JS Web Components). Deployed to GitHub Pages.

## Commands

- `npm run startTwWatch` — the only npm script: regenerates `assets/css/site.css` from `src/input.css` in watch mode. Run it after changing Tailwind classes or `tailwind.config.js`.
- One-shot CSS rebuild: `npx tailwindcss -i ./src/input.css -o ./assets/css/site.css`
- No build, test, lint, or typecheck is configured. Preview by serving the repo root over HTTP (e.g. `python -m http.server`) — `file://` breaks the layout fetch below.

## Architecture

- Shared layout is a `<base-header-footer>` custom element (`templates/base.js`). At runtime it `fetch()`es `templates/base.html`, injects `assets/css/site.css` via a shadow-DOM `@import`, rewrites `.class-path` hrefs to the site root, and renders page content from `<main slot="main-content">`. New pages must follow this pattern.
- `assets/js/project_paths.js` `getRelativeRoot()` returns `protocol + "//" + host + "/"`. Pages reference CSS/JS with depth-correct relative paths (`./` at root, `../../` under `apps/<x>/` — compare `index.html` with `apps/tasks/index.html`).
- Tailwind content globs live in `tailwind.config.js` (root `*.html`, `templates/`, `apps/`, `src/`, `assets/js/`, `shop/`). Custom palette: `heliotrope`, `shocking-pink`, `seagull`, overridden `blue`.
- `assets/css/site.css` is committed generated output — regenerate it whenever utility classes change; never hand-edit it.
- `apps/` holds one folder per demo app: `tasks` and `inventory-management` (vanilla JS), `newton_cas` (JS under `assets/js/apps/`), `battleship` and `wordle` (PyScript: `main.py` + `pyscript.toml`). Per-page CSS goes under `assets/css/`, shared JS under `assets/js/`.

## Deploy & constraints

- Push to `main` triggers `.github/workflows/deploy-site.yml`, which uploads the whole repo root to GitHub Pages with no build step. Only `main` deploys.
- Do not add build/test/lint tooling or new dependencies without asking — the repo intentionally has none beyond `tailwindcss` + `tw-elements` devDependencies.

## Agent skills

- `.opencode/skills/tailwind-best-practices/` (vendored, MIT, source: https://github.com/AsyrafHussin/agent-skills) — Tailwind best-practice rules with a version-detection gate. This repo is v3.4.3, so only its v3 (`tailwind.config.js`) guidance applies; ignore the v4/`@theme`/migration sections. Repo constraints above win over any skill suggestion.
