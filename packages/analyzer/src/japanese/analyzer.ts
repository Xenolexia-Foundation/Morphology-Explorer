/**
 * Japanese morphological analyzer: strip endings, match stem, map to pattern.
 * Reuses AnalysisResult type from core.
 */
import type { AnalysisResult, RelatedWord } from "@morphology-explorer/core";
import {
  findJapaneseRootById,
  findJapaneseRootByStem,
  findJapanesePatternById,
  getJapanesePatternIdForRoot,
} from "@morphology-explorer/data";

/** Godan (五段) dictionary-form endings: -u row (く, う, す, つ, ぬ, ぶ, む, ぐ, る for ラ行). */
const GODAN_ENDINGS = ["く", "う", "す", "つ", "ぬ", "ぶ", "む", "ぐ", "る"];

function normalizeJapaneseWord(word: string): string {
  return word.trim();
}

/**
 * Try to strip a verb ending and return stem, or null.
 * Handles: する, 来る/くる, ichidan る, godan endings.
 */
function tryStem(word: string): { stem: string; patternId: string } | null {
  const w = normalizeJapaneseWord(word);
  if (!w) return null;

  // する (sahen)
  if (w === "する" || w.endsWith("する")) {
    const stem = w === "する" ? "す" : w.slice(0, -2);
    return { stem, patternId: "sahen" };
  }
  // 来る / くる (kahen)
  if (w === "来る" || w === "くる") return { stem: "来", patternId: "kahen" };

  // Ichidan: ends in る, stem is 1+ chars
  if (w.endsWith("る") && w.length >= 2) {
    const stem = w.slice(0, -1);
    const root = findJapaneseRootByStem(stem);
    if (root && getJapanesePatternIdForRoot(root.id) === "ichidan")
      return { stem, patternId: "ichidan" };
  }

  // Godan: strip one character ending
  for (const ending of GODAN_ENDINGS) {
    if (w.endsWith(ending) && w.length >= 2) {
      const stem = w.slice(0, -1);
      const root = findJapaneseRootByStem(stem);
      if (root && getJapanesePatternIdForRoot(root.id) === "godan")
        return { stem, patternId: "godan" };
    }
  }

  // Fallback: try stem as-is (e.g. 書, 読)
  const root = findJapaneseRootByStem(w);
  if (root) {
    const patternId = getJapanesePatternIdForRoot(root.id);
    if (patternId) return { stem: w, patternId };
  }

  return null;
}

export function analyzeJapanese(word: string): AnalysisResult | null {
  const trimmed = normalizeJapaneseWord(word);
  if (!trimmed) return null;

  const parsed = tryStem(trimmed);
  if (!parsed) return null;

  const root = findJapaneseRootByStem(parsed.stem);
  const pattern = findJapanesePatternById(parsed.patternId);
  if (!root || !pattern) return null;

  return {
    input: trimmed,
    root,
    pattern,
    derivedForm: trimmed,
  };
}

export function getRelatedWordsJapanese(rootId: string): RelatedWord[] {
  const r = findJapaneseRootById(rootId);
  if (!r) return [];

  const patternId = getJapanesePatternIdForRoot(r.id);
  const pattern = patternId ? findJapanesePatternById(patternId) : undefined;
  if (!pattern) return [];

  const stem = r.consonants.join("");
  return [
    {
      word: stem + "…",
      patternId: pattern.id,
      patternMeaning: pattern.meaning,
    },
  ];
}
