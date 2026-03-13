/**
 * Supported languages for morphological analysis.
 */
export type Language = "ar" | "ja";

/**
 * A morphological root (e.g. Arabic trilateral root ك-ت-ب).
 */
export interface Root {
  id: string;
  consonants: string[];
  meaning?: string;
  language: Language;
}

/**
 * A morphological pattern/template (e.g. فَعَلَ، فَعَّلَ for Arabic).
 */
export interface Pattern {
  id: string;
  template: string;
  meaning?: string;
  language: Language;
}

/**
 * Result of analyzing a word: identified root, pattern, and optional related words.
 */
export interface AnalysisResult {
  input: string;
  root: Root;
  pattern: Pattern;
  derivedForm?: string;
  relatedWordIds?: string[];
}

/**
 * A related word (same root, different pattern).
 */
export interface RelatedWord {
  word: string;
  patternId: string;
  patternMeaning?: string;
}
