/**
 * Japanese root/stem and pattern data loader with Zod validation.
 */
import type { Root, Pattern } from "@morphology-explorer/core";
import { rootsArraySchema, patternsArraySchema } from "./schema.js";

import rootsJson from "./roots.json";
import patternsJson from "./patterns.json";

const validatedRoots = rootsArraySchema.parse(rootsJson);
const validatedPatterns = patternsArraySchema.parse(patternsJson);

const rootIdToPatternId = new Map<string, string>();
validatedRoots.forEach((r) => {
  if (r.patternId) rootIdToPatternId.set(r.id, r.patternId);
});

let rootsCache: Root[] | null = null;
let patternsCache: Pattern[] | null = null;

function toRoot(r: (typeof validatedRoots)[number]): Root {
  return {
    id: r.id,
    consonants: r.consonants,
    meaning: r.meaning,
    language: "ja",
  };
}

function toPattern(p: (typeof validatedPatterns)[number]): Pattern {
  return {
    id: p.id,
    template: p.template,
    meaning: p.meaning,
    language: "ja",
  };
}

export function getJapaneseRoots(): Root[] {
  if (rootsCache === null) {
    rootsCache = validatedRoots.map(toRoot);
  }
  return rootsCache;
}

export function getJapanesePatterns(): Pattern[] {
  if (patternsCache === null) {
    patternsCache = validatedPatterns.map(toPattern);
  }
  return patternsCache;
}

export function findJapaneseRootById(id: string): Root | undefined {
  const r = validatedRoots.find((x) => x.id === id);
  return r ? toRoot(r) : undefined;
}

/** Find root whose stem (consonants joined) equals the given stem string. */
export function findJapaneseRootByStem(stem: string): Root | undefined {
  const r = validatedRoots.find((x) => x.consonants.join("") === stem);
  return r ? toRoot(r) : undefined;
}

export function findJapanesePatternById(id: string): Pattern | undefined {
  const p = validatedPatterns.find((x) => x.id === id);
  return p ? toPattern(p) : undefined;
}

/** Get pattern id for a root (from roots.json patternId). */
export function getJapanesePatternIdForRoot(rootId: string): string | undefined {
  return rootIdToPatternId.get(rootId);
}

export function searchJapaneseRoots(query: string): Root[] {
  const q = query.trim().toLowerCase();
  if (!q) return getJapaneseRoots();
  return validatedRoots
    .filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        (r.meaning && r.meaning.toLowerCase().includes(q)) ||
        r.consonants.join("").includes(query.trim())
    )
    .map(toRoot);
}
