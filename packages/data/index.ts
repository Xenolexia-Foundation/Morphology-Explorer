/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

/**
 * Morphology data package — root/pattern databases per language.
 * Load roots and patterns from JSON; validate with Zod at load time.
 */
import type { Language, Root, Pattern } from "@morphology-explorer/core";
import {
  getArabicRoots,
  getArabicPatterns,
  findArabicRootById,
  findArabicPatternById,
  searchArabicRoots,
} from "./arabic/index.js";
import {
  getJapaneseRoots,
  getJapanesePatterns,
  findJapaneseRootById,
  findJapanesePatternById,
  searchJapaneseRoots,
} from "./japanese/index.js";

export type { Root, Pattern } from "@morphology-explorer/core";
export {
  getArabicRoots,
  getArabicPatterns,
  findArabicRootById,
  findArabicPatternById,
  searchArabicRoots,
} from "./arabic/index.js";
export {
  getJapaneseRoots,
  getJapanesePatterns,
  findJapaneseRootById,
  findJapaneseRootByStem,
  findJapanesePatternById,
  getJapanesePatternIdForRoot,
  searchJapaneseRoots,
} from "./japanese/index.js";

/**
 * Load and return all roots for a language (from local JSON, validated with Zod).
 * @param lang - "ar" or "ja".
 */
export function getRoots(lang: Language): Root[] {
  switch (lang) {
    case "ar":
      return getArabicRoots();
    case "ja":
      return getJapaneseRoots();
    default:
      return [];
  }
}

/**
 * Load and return all patterns for a language.
 * @param lang - "ar" or "ja".
 */
export function getPatterns(lang: Language): Pattern[] {
  switch (lang) {
    case "ar":
      return getArabicPatterns();
    case "ja":
      return getJapanesePatterns();
    default:
      return [];
  }
}

/**
 * Look up a root by id (e.g. "k-t-b").
 * @param id - Root id.
 * @param lang - Language code.
 */
export function findRootById(id: string, lang: Language): Root | undefined {
  switch (lang) {
    case "ar":
      return findArabicRootById(id);
    case "ja":
      return findJapaneseRootById(id);
    default:
      return undefined;
  }
}

/**
 * Look up a pattern by id (e.g. "fa'ala").
 * @param id - Pattern id.
 * @param lang - Language code.
 */
export function findPatternById(id: string, lang: Language): Pattern | undefined {
  switch (lang) {
    case "ar":
      return findArabicPatternById(id);
    case "ja":
      return findJapanesePatternById(id);
    default:
      return undefined;
  }
}

/**
 * Search roots by id substring, meaning substring, or consonant match.
 * @param query - Search string (trimmed, case-insensitive for id/meaning).
 * @param lang - Language code.
 */
export function searchRoots(query: string, lang: Language): Root[] {
  switch (lang) {
    case "ar":
      return searchArabicRoots(query);
    case "ja":
      return searchJapaneseRoots(query);
    default:
      return [];
  }
}
