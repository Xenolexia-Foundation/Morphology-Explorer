# Morphology Explorer

A **local** morphology explorer for languages like **Arabic** and **Japanese**: enter a word and see its **root**, **pattern**, and **related words** using only local rules—no external APIs.

---

## Features

- **Word analysis** — Enter a word; get root (e.g. ك-ت-ب), pattern (e.g. فَعَلَ), and optional meaning.
- **Related words** — Same root with different patterns (e.g. فَعَلَ، فَعَّلَ، اِفْتَعَلَ).
- **Arabic** — Trilateral roots, Form I–X patterns, template matching, stem list fallback.
- **Japanese** — Verb stems and patterns (五段, 一段, サ変, カ変).
- **Multiple clients** — Web (Vite + React), Electron (desktop), React Native (Expo, iOS/Android).
- **Offline** — All data and logic are in-repo; no network required.

---

## Quick start

```bash
git clone <repo-url>
cd Morphology-Explorer
npm install
npm run build:deps
npm run dev
```

Then open **http://localhost:5173**, enter a word (e.g. **كتب** or **書く**), and tap **Analyze**.

---

## How to run

### Web (browser)

```bash
npm install
npm run build:deps   # required before dev/test
npm run dev          # → http://localhost:5173
```

### Electron (desktop)

```bash
npm install
npm run electron:dev    # dev: Vite + Electron (with DevTools)
npm run electron:build  # build app + Electron
npm run electron:start  # run built app (after electron:build)
```

### React Native (Expo, iOS/Android)

```bash
npm install
npm run build:deps
npm run mobile          # Expo dev server → scan QR with Expo Go
npm run mobile:android  # open on Android
npm run mobile:ios      # open on iOS simulator (mac only)
```

---

## Commands

| Command | Description |
|--------|-------------|
| `npm install` | Install all workspace dependencies |
| `npm run build:deps` | Build core, data, analyzer (run before dev/test/mobile) |
| `npm run build` | Build all packages |
| `npm run dev` | Web app at http://localhost:5173 |
| `npm run electron:dev` | Desktop app (dev) |
| `npm run electron:build` | Build web app + Electron |
| `npm run electron:start` | Run built desktop app |
| `npm run mobile` | Expo dev server |
| `npm run mobile:android` | Expo + Android |
| `npm run mobile:ios` | Expo + iOS (mac only) |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Tests in watch mode |
| `npm run lint` | Lint |
| `npm run format` | Format with Prettier |

---

## Project structure

```
packages/
  core/      Shared types (Root, Pattern, AnalysisResult, Language)
  data/      Root/pattern DBs (arabic/, japanese/) + Zod validation
  analyzer/  Local analyzer (Arabic + Japanese)
  app/       Web UI (Vite + React)
  electron/  Desktop app (Electron)
  mobile/    Mobile app (Expo / React Native)
```

---

## How to add roots/patterns (Arabic)

1. **Roots** — Edit `packages/data/arabic/roots.json`:
   - `{ "id": "k-t-b", "consonants": ["ك", "ت", "ب"], "meaning": "write", "language": "ar" }`
   - Use 3–4 consonants; `id` is romanized.

2. **Patterns** — Edit `packages/data/arabic/patterns.json`:
   - `{ "id": "fa'ala", "template": "فَعَلَ", "meaning": "past tense", "language": "ar" }`
   - Template must contain ف, ع, ل (in that order) for the three root slots.

3. Rebuild: `npm run build -w @morphology-explorer/data` (and restart dev if needed).

---

## How the analyzer works

1. **Normalize** — e.g. strip Arabic diacritics.
2. **Template match** — Find ف, ع, ل in each pattern; if the word has the same length as the template, read the three consonants and look them up in the roots DB.
3. **Stem list** — Fallback map (normalized word → rootId, patternId) for common words.
4. **Related words** — Apply each pattern template to the root to list related forms.

---

## Implementation phases

| Phase | Focus |
|-------|--------|
| **0** | Monorepo, TypeScript, core types |
| **1** | Local root/pattern DB (Arabic), Zod, query API |
| **2** | Arabic analyzer (template match, stem list, related words) |
| **3** | Web UI (components, debounced analysis, RTL) |
| **4** | Tests (Vitest), docs, Japanese data + analyzer |

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for the full plan.

---

## License

Private / unlicensed unless otherwise specified.
