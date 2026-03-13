import type { RelatedWord } from "@morphology-explorer/core";
import type { Language } from "@morphology-explorer/core";

interface RelatedWordsListProps {
  items: RelatedWord[];
  lang: Language;
}

export function RelatedWordsList({ items, lang }: RelatedWordsListProps) {
  return (
    <>
      <h3 className="result__related-title">Related words</h3>
      <ul className="related-words" dir={lang === "ar" ? "rtl" : "ltr"}>
        {items.map((r, i) => (
          <li key={`${r.patternId}-${i}`} className="related-words__item">
            <span className="related-words__word" dir="rtl">
              {r.word}
            </span>
            <span className="related-words__pattern" aria-hidden>
              — {r.patternMeaning ?? r.patternId}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
