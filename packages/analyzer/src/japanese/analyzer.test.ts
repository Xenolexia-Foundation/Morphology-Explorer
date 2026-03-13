import { describe, it, expect } from "vitest";
import { analyzeJapanese, getRelatedWordsJapanese } from "./analyzer.js";

describe("analyzeJapanese", () => {
  it("returns null for empty or whitespace", () => {
    expect(analyzeJapanese("")).toBeNull();
    expect(analyzeJapanese("   ")).toBeNull();
  });

  it("returns AnalysisResult for 書く (godan)", () => {
    const result = analyzeJapanese("書く");
    expect(result).not.toBeNull();
    expect(result!.root.id).toBe("kak");
    expect(result!.pattern.id).toBe("godan");
  });

  it("returns AnalysisResult for する (sahen)", () => {
    const result = analyzeJapanese("する");
    expect(result).not.toBeNull();
    expect(result!.root.id).toBe("suru");
    expect(result!.pattern.id).toBe("sahen");
  });

  it("returns AnalysisResult for 食べる (ichidan)", () => {
    const result = analyzeJapanese("食べる");
    expect(result).not.toBeNull();
    expect(result!.root.id).toBe("taber");
    expect(result!.pattern.id).toBe("ichidan");
  });

  it("returns null for unknown word", () => {
    expect(analyzeJapanese("xyz")).toBeNull();
  });
});

describe("getRelatedWordsJapanese", () => {
  it("returns array for known root", () => {
    const related = getRelatedWordsJapanese("kak");
    expect(related.length).toBeGreaterThanOrEqual(0);
  });

  it("returns empty array for unknown root", () => {
    expect(getRelatedWordsJapanese("unknown")).toEqual([]);
  });
});
