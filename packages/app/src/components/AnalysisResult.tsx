/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { AnalysisResult as AnalysisResultType } from "@morphology-explorer/core";
import { RelatedWordsList } from "./RelatedWordsList";
import { getRelatedWords } from "@morphology-explorer/analyzer";
import type { Language } from "@morphology-explorer/core";

interface AnalysisResultProps {
  result: AnalysisResultType;
  lang: Language;
}

export function AnalysisResult({ result, lang }: AnalysisResultProps) {
  const related = getRelatedWords(result.root.id, lang);

  return (
    <section className="result" aria-labelledby="result-heading">
      <h2 id="result-heading" className="result__title">
        Result
      </h2>
      <dl className="result__dl">
        <div className="result__row">
          <dt className="result__dt">Root</dt>
          <dd className="result__dd result__dd--arabic" dir="rtl">
            {result.root.consonants.join("–")}
            {result.root.meaning != null && (
              <span className="result__meaning"> ({result.root.meaning})</span>
            )}
          </dd>
        </div>
        <div className="result__row">
          <dt className="result__dt">Pattern</dt>
          <dd className="result__dd result__dd--arabic" dir="rtl">
            {result.pattern.template}
            {result.pattern.meaning != null && (
              <span className="result__meaning"> ({result.pattern.meaning})</span>
            )}
          </dd>
        </div>
      </dl>
      {related.length > 0 && (
        <RelatedWordsList items={related} lang={lang} />
      )}
    </section>
  );
}
