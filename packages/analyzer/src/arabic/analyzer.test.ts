import { describe, it, expect } from "vitest";
import { analyzeArabic, getRelatedWordsArabic } from "./analyzer.js";

/** Fixtures: sample words with expected root id and pattern id (for Arabic). */
const FIXTURES: { word: string; rootId: string; patternId: string }[] = [
  { word: "كتب", rootId: "k-t-b", patternId: "fa'ala" },
  { word: "يكتب", rootId: "k-t-b", patternId: "yaf'alu" },
  { word: "قرأ", rootId: "q-r-ʼ", patternId: "fa'ala" },
  { word: "درس", rootId: "d-r-s", patternId: "fa'ala" },
  { word: "عمل", rootId: "ʻ-m-l", patternId: "fa'ala" },
  { word: "ضرب", rootId: "ḍ-r-b", patternId: "fa'ala" },
  { word: "استكتب", rootId: "k-t-b", patternId: "istaf'ala" },
];

describe("analyzeArabic", () => {
  it("returns null for empty or whitespace", () => {
    expect(analyzeArabic("")).toBeNull();
    expect(analyzeArabic("   ")).toBeNull();
  });

  it("returns AnalysisResult with root and pattern for fixture words", () => {
    for (const { word, rootId, patternId } of FIXTURES) {
      const result = analyzeArabic(word);
      expect(result).not.toBeNull();
      expect(result!.root.id).toBe(rootId);
      expect(result!.pattern.id).toBe(patternId);
      expect(result!.input).toBe(word.trim());
    }
  });

  it("returns null for unknown word", () => {
    expect(analyzeArabic("xyz")).toBeNull();
    expect(analyzeArabic("ل ي ك")).toBeNull();
  });
});

describe("getRelatedWordsArabic", () => {
  it("returns array of related words for known root", () => {
    const related = getRelatedWordsArabic("k-t-b");
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((r) => r.word && r.patternId)).toBe(true);
  });

  it("returns empty array for unknown root", () => {
    expect(getRelatedWordsArabic("x-y-z")).toEqual([]);
  });
});
