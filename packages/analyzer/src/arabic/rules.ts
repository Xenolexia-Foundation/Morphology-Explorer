/**
 * Arabic morphological rules: normalization and template matching.
 */

/** Placeholder letters in pattern templates: ف (C1), ع (C2), ل (C3). */
export const ARABIC_PATTERN_PLACEHOLDERS = ["\u0641", "\u0639", "\u0644"] as const;

const [F, Ayn, L] = ARABIC_PATTERN_PLACEHOLDERS;

/** Arabic diacritics (combining) — strip for normalization. */
const ARABIC_DIACRITICS = /[\u064B-\u0652\u0670]/gu;

/**
 * Normalize word: trim and strip Arabic diacritics (fatḥa, ḍamma, kasra, shadda, sukūn, etc.).
 */
export function normalizeArabicWord(word: string): string {
  return word.trim().replace(ARABIC_DIACRITICS, "");
}

/**
 * Get the indices of ف, ع, ل in the template (in order), for root slot C1, C2, C3.
 * Returns null if the template does not contain exactly one of each in order.
 */
export function getTemplateConsonantPositions(template: string): [number, number, number] | null {
  let i1: number | null = null;
  let i2: number | null = null;
  let i3: number | null = null;
  for (let i = 0; i < template.length; i++) {
    const c = template[i];
    if (c === F && i1 === null) i1 = i;
    else if (c === Ayn && i1 !== null && i2 === null) i2 = i;
    else if (c === L && i2 !== null && i3 === null) {
      i3 = i;
      break;
    }
  }
  if (i1 === null || i2 === null || i3 === null) return null;
  return [i1, i2, i3];
}

/**
 * Extract the three root consonants from a word by using the same positions as ف, ع, ل in the template.
 * Requires word.length === templateLength. Returns null if lengths differ.
 */
export function extractRootFromWord(
  word: string,
  positions: [number, number, number],
  templateLength: number
): [string, string, string] | null {
  if (word.length !== templateLength) return null;
  const c1 = word[positions[0]];
  const c2 = word[positions[1]];
  const c3 = word[positions[2]];
  if (!c1 || !c2 || !c3) return null;
  return [c1, c2, c3];
}

/**
 * Build a word form by inserting root consonants into the template at ف, ع, ل positions.
 */
export function applyRootToTemplate(
  template: string,
  positions: [number, number, number],
  consonants: [string, string, string]
): string {
  const [i1, i2, i3] = positions;
  const [c1, c2, c3] = consonants;
  let out = "";
  for (let i = 0; i < template.length; i++) {
    if (i === i1) out += c1;
    else if (i === i2) out += c2;
    else if (i === i3) out += c3;
    else out += template[i];
  }
  return out;
}
