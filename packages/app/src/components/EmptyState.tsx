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
