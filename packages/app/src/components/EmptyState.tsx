/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = "No analysis found for this word.",
}: EmptyStateProps) {
  return (
    <section className="result result--empty" aria-live="polite">
      <p>{message}</p>
    </section>
  );
}
