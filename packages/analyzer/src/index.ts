/**
 * Morphology analyzer — local analysis by language.
 */
import type { AnalysisResult, Language, RelatedWord } from "@morphology-explorer/core";
import { analyzeArabic, getRelatedWordsArabic } from "./arabic/analyzer.js";
import { analyzeJapanese, getRelatedWordsJapanese } from "./japanese/analyzer.js";

export { analyzeArabic, getRelatedWordsArabic } from "./arabic/analyzer.js";
export { analyzeJapanese, getRelatedWordsJapanese } from "./japanese/analyzer.js";
export { normalizeArabicWord, ARABIC_PATTERN_PLACEHOLDERS } from "./arabic/rules.js";

/**
 * Analyze a word and return its root, pattern, and derived form (if found).
 * Uses local morphological rules only; no network.
 *
 * @param word - The word to analyze (e.g. "كتب" for Arabic).
 * @param lang - Language code: "ar" (Arabic) or "ja" (Japanese).
 * @returns AnalysisResult with root and pattern, or null if no analysis found.
 */
export function analyze(word: string, lang: Language): AnalysisResult | null {
  switch (lang) {
    case "ar":
      return analyzeArabic(word);
    case "ja":
      return analyzeJapanese(word);
    default:
      return null;
  }
}

/**
 * Return related words for a root: same root with different pattern templates applied.
 * E.g. for root "k-t-b", returns forms like فَعَلَ، فَعَّلَ، اِفْتَعَلَ, etc.
 *
 * @param rootId - Root id (e.g. "k-t-b").
 * @param lang - Language code: "ar" or "ja".
 * @returns Array of { word, patternId, patternMeaning }.
 */
export function getRelatedWords(rootId: string, lang: Language): RelatedWord[] {
  switch (lang) {
    case "ar":
      return getRelatedWordsArabic(rootId);
    case "ja":
      return getRelatedWordsJapanese(rootId);
    default:
      return [];
  }
}
