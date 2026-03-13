import { useState, useEffect, useCallback } from "react";
import type { Language } from "@morphology-explorer/core";
import type { AnalysisResult } from "@morphology-explorer/core";
import { analyze } from "@morphology-explorer/analyzer";
import { useDebouncedValue } from "./useDebouncedValue";

const DEBOUNCE_MS = 450;

interface UseAnalyzeOptions {
  /** Run analysis on debounced input (default true). */
  debounce?: boolean;
  /** Debounce delay in ms (default 450). */
  debounceMs?: number;
}

/**
 * Word + language state and analysis result.
 * Updates result when word/lang change (debounced) or when analyze() is called explicitly.
 */
export function useAnalyze(options: UseAnalyzeOptions = {}) {
  const { debounce = true, debounceMs = DEBOUNCE_MS } = options;
  const [word, setWord] = useState("");
  const [lang, setLang] = useState<Language>("ar");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const debouncedWord = useDebouncedValue(word, debounceMs);
  const trimmedDebounced = debouncedWord.trim();

  // Run analysis when debounced word or lang changes
  useEffect(() => {
    if (!debounce) return;
    if (trimmedDebounced === "") {
      setResult(null);
      return;
    }
    const next = analyze(trimmedDebounced, lang);
    setResult(next);
  }, [trimmedDebounced, lang, debounce]);

  const runAnalysis = useCallback(() => {
    const trimmed = word.trim();
    if (trimmed === "") {
      setResult(null);
      return;
    }
    setResult(analyze(trimmed, lang));
  }, [word, lang]);

  return { word, setWord, lang, setLang, result, runAnalysis };
}
