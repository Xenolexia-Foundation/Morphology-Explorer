/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

/**
 * Arabic morphological analyzer: pattern matching + root lookup + related words.
 */
import type { AnalysisResult, RelatedWord, Root } from "@morphology-explorer/core";
import {
  getArabicRoots,
  getArabicPatterns,
  findArabicRootById,
  findArabicPatternById,
} from "@morphology-explorer/data";
import {
  getTemplateConsonantPositions,
  extractRootFromWord,
  applyRootToTemplate,
} from "./rules.js";

/** Stem list fallback: normalized word (no diacritics) → { rootId, patternId }. */
const STEM_LIST: Record<string, { rootId: string; patternId: string }> = {
  كتب: { rootId: "k-t-b", patternId: "fa'ala" },
  يكتب: { rootId: "k-t-b", patternId: "yaf'alu" },
  قرأ: { rootId: "q-r-ʼ", patternId: "fa'ala" },
  درس: { rootId: "d-r-s", patternId: "fa'ala" },
  يعمل: { rootId: "ʻ-m-l", patternId: "yaf'alu" },
  عمل: { rootId: "ʻ-m-l", patternId: "fa'ala" },
  علم: { rootId: "ʻ-l-m", patternId: "fa'ala" },
  ضرب: { rootId: "ḍ-r-b", patternId: "fa'ala" },
  فتح: { rootId: "f-t-ḥ", patternId: "fa'ala" },
  استكتب: { rootId: "k-t-b", patternId: "istaf'ala" },
  اكتتب: { rootId: "k-t-b", patternId: "tafa''ala" },
};

function normalizeForStem(s: string): string {
  return s.trim().replace(/[\u064B-\u0652\u0670]/gu, "");
}

function findRootByConsonants(roots: Root[], c1: string, c2: string, c3: string): Root | undefined {
  return roots.find(
    (r) =>
      r.consonants.length >= 3 &&
      r.consonants[0] === c1 &&
      r.consonants[1] === c2 &&
      r.consonants[2] === c3
  );
}

export function analyzeArabic(word: string): AnalysisResult | null {
  const trimmed = word.trim();
  if (!trimmed) return null;

  const roots = getArabicRoots();
  const patterns = getArabicPatterns();

  for (const pattern of patterns) {
    const positions = getTemplateConsonantPositions(pattern.template);
    if (!positions) continue;
    if (trimmed.length !== pattern.template.length) continue;

    const rootLetters = extractRootFromWord(trimmed, positions, pattern.template.length);
    if (!rootLetters) continue;

    const [c1, c2, c3] = rootLetters;
    const root = findRootByConsonants(roots, c1, c2, c3);
    if (root) {
      return {
        input: trimmed,
        root,
        pattern,
        derivedForm: trimmed,
      };
    }
  }

  const stemKey = normalizeForStem(trimmed);
  const stem = STEM_LIST[stemKey];
  if (stem) {
    const root = findArabicRootById(stem.rootId);
    const pattern = findArabicPatternById(stem.patternId);
    if (root && pattern) {
      return {
        input: trimmed,
        root,
        pattern,
        derivedForm: trimmed,
      };
    }
  }

  return null;
}

export function getRelatedWordsArabic(rootId: string): RelatedWord[] {
  const root = findArabicRootById(rootId);
  if (!root || root.consonants.length < 3) return [];

  const patterns = getArabicPatterns();
  const [c1, c2, c3] = root.consonants;
  const consonants: [string, string, string] = [c1, c2, c3];
  const out: RelatedWord[] = [];

  for (const pattern of patterns) {
    const positions = getTemplateConsonantPositions(pattern.template);
    if (!positions) continue;

    const word = applyRootToTemplate(pattern.template, positions, consonants);
    out.push({
      word,
      patternId: pattern.id,
      patternMeaning: pattern.meaning,
    });
  }

  return out;
}
