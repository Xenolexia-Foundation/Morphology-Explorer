import { describe, it, expect } from "vitest";
import {
  getRoots,
  getPatterns,
  findRootById,
  findPatternById,
  searchRoots,
} from "@morphology-explorer/data";

describe("getRoots", () => {
  it("returns non-empty array for Arabic", () => {
    const roots = getRoots("ar");
    expect(Array.isArray(roots)).toBe(true);
    expect(roots.length).toBeGreaterThan(0);
    expect(roots[0]).toHaveProperty("id");
    expect(roots[0]).toHaveProperty("consonants");
    expect(roots[0]).toHaveProperty("language", "ar");
  });

  it("returns non-empty array for Japanese", () => {
    const roots = getRoots("ja");
    expect(Array.isArray(roots)).toBe(true);
    expect(roots.length).toBeGreaterThan(0);
    expect(roots[0]).toHaveProperty("language", "ja");
  });
});

describe("getPatterns", () => {
  it("returns non-empty array for Arabic", () => {
    const patterns = getPatterns("ar");
    expect(Array.isArray(patterns)).toBe(true);
    expect(patterns.length).toBeGreaterThan(0);
    expect(patterns[0]).toHaveProperty("id");
    expect(patterns[0]).toHaveProperty("template");
    expect(patterns[0]).toHaveProperty("language", "ar");
  });

  it("returns non-empty array for Japanese", () => {
    const patterns = getPatterns("ja");
    expect(Array.isArray(patterns)).toBe(true);
    expect(patterns.length).toBeGreaterThan(0);
    expect(patterns[0]).toHaveProperty("language", "ja");
  });
});

describe("findRootById", () => {
  it("returns root for known id", () => {
    const root = findRootById("k-t-b", "ar");
    expect(root).toBeDefined();
    expect(root!.id).toBe("k-t-b");
    expect(root!.consonants).toEqual(["\u0643", "\u062a", "\u0628"]);
  });

  it("returns undefined for unknown id", () => {
    expect(findRootById("x-y-z", "ar")).toBeUndefined();
  });

  it("returns root for known Japanese id", () => {
    const root = findRootById("kak", "ja");
    expect(root).toBeDefined();
    expect(root!.id).toBe("kak");
    expect(root!.consonants).toContain("書");
  });
});

describe("findPatternById", () => {
  it("returns pattern for known id", () => {
    const pattern = findPatternById("fa'ala", "ar");
    expect(pattern).toBeDefined();
    expect(pattern!.id).toBe("fa'ala");
    expect(pattern!.template).toContain("\u0641");
  });

  it("returns undefined for unknown id", () => {
    expect(findPatternById("unknown", "ar")).toBeUndefined();
  });
});

describe("searchRoots", () => {
  it("filters by meaning substring", () => {
    const results = searchRoots("write", "ar");
    expect(results.some((r) => r.id === "k-t-b")).toBe(true);
  });

  it("filters by id substring", () => {
    const results = searchRoots("k-t", "ar");
    expect(results.some((r) => r.id === "k-t-b")).toBe(true);
  });

  it("returns all roots for empty query", () => {
    const all = getRoots("ar");
    const searched = searchRoots("", "ar");
    expect(searched.length).toBe(all.length);
  });
});
