import { describe, it, expect } from "vitest";
import {
  normalizeArabicWord,
  getTemplateConsonantPositions,
  extractRootFromWord,
  applyRootToTemplate,
} from "./rules.js";

describe("normalizeArabicWord", () => {
  it("trims whitespace", () => {
    expect(normalizeArabicWord("  كتب  ")).toBe("كتب");
  });

  it("strips Arabic diacritics", () => {
    // كَتَبَ (with fatha) -> كتب
    expect(normalizeArabicWord("كَتَبَ")).toBe("كتب");
    expect(normalizeArabicWord("\u0643\u064e\u062a\u064e\u0628\u064e")).toBe("كتب");
  });

  it("returns empty string for empty input", () => {
    expect(normalizeArabicWord("")).toBe("");
  });
});

describe("getTemplateConsonantPositions", () => {
  it("returns [0, 2, 4] for فَعَلَ", () => {
    const template = "\u0641\u064e\u0639\u064e\u0644\u064e"; // فَعَلَ
    expect(getTemplateConsonantPositions(template)).toEqual([0, 2, 4]);
  });

  it("returns positions for يَفْعَلُ (ي at 0, ف at 1, ع at 3, ل at 5)", () => {
    const template = "\u064a\u0641\u0652\u0639\u064e\u0644\u064f"; // يَفْعَلُ
    expect(getTemplateConsonantPositions(template)).toEqual([1, 3, 5]);
  });

  it("returns null for string without ف ع ل in order", () => {
    expect(getTemplateConsonantPositions("abc")).toBeNull();
    // ف ل ف — has ف and ل but no ع in between, so no valid sequence
    expect(getTemplateConsonantPositions("\u0641\u0644\u0641")).toBeNull();
  });
});

describe("extractRootFromWord", () => {
  it("extracts root from word matching template length", () => {
    const word = "\u0643\u064e\u062a\u064e\u0628\u064e"; // كَتَبَ
    const positions: [number, number, number] = [0, 2, 4];
    expect(extractRootFromWord(word, positions, 6)).toEqual(["\u0643", "\u062a", "\u0628"]);
  });

  it("returns null when word length differs from template length", () => {
    expect(extractRootFromWord("كتب", [0, 2, 4], 6)).toBeNull();
    expect(extractRootFromWord("كَتَبَ", [0, 2, 4], 5)).toBeNull();
  });
});

describe("applyRootToTemplate", () => {
  it("inserts root consonants into template at positions", () => {
    const template = "\u0641\u064e\u0639\u064e\u0644\u064e"; // فَعَلَ
    const positions: [number, number, number] = [0, 2, 4];
    const consonants: [string, string, string] = ["\u0643", "\u062a", "\u0628"]; // ك ت ب
    expect(applyRootToTemplate(template, positions, consonants)).toBe("\u0643\u064e\u062a\u064e\u0628\u064e");
  });
});
