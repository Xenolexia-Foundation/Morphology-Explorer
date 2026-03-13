/**
 * Arabic root/pattern data loader with Zod validation.
 */
import type { Root, Pattern } from "@morphology-explorer/core";
import { rootsArraySchema, patternsArraySchema } from "./schema.js";

// Load and validate at module load (sync). Use dynamic import for JSON so bundlers can inline.
// For Node/build we need JSON in dist — see package.json "build" script.
import rootsJson from "./roots.json";
import patternsJson from "./patterns.json";

const validatedRoots = rootsArraySchema.parse(rootsJson);
const validatedPatterns = patternsArraySchema.parse(patternsJson);

let rootsCache: Root[] | null = null;
let patternsCache: Pattern[] | null = null;

function toRoot(r: { id: string; consonants: string[]; meaning?: string; language: "ar" }): Root {
  return { id: r.id, consonants: r.consonants, meaning: r.meaning, language: "ar" };
}

function toPattern(p: { id: string; template: string; meaning?: string; language: "ar" }): Pattern {
  return { id: p.id, template: p.template, meaning: p.meaning, language: "ar" };
}

export function getArabicRoots(): Root[] {
  if (rootsCache === null) {
    rootsCache = validatedRoots.map(toRoot);
  }
  return rootsCache;
}

export function getArabicPatterns(): Pattern[] {
  if (patternsCache === null) {
    patternsCache = validatedPatterns.map(toPattern);
  }
  return patternsCache;
}

export function findArabicRootById(id: string): Root | undefined {
  const r = validatedRoots.find((x) => x.id === id);
  return r ? toRoot(r) : undefined;
}

export function findArabicPatternById(id: string): Pattern | undefined {
  const p = validatedPatterns.find((x) => x.id === id);
  return p ? toPattern(p) : undefined;
}

export function searchArabicRoots(query: string): Root[] {
  const q = query.trim().toLowerCase();
  if (!q) return getArabicRoots();
  return validatedRoots
    .filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        (r.meaning && r.meaning.toLowerCase().includes(q)) ||
        r.consonants.some((c) => c === query.trim())
    )
    .map(toRoot);
}
