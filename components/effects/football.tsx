// The drive-tracker football, shared by the page transition and the snap.
export function Football({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 14" className={className} aria-hidden="true">
      <ellipse cx="12" cy="7" rx="11" ry="6.5" fill="currentColor" />
      <path
        d="M7 7h10M9.5 5.2v3.6M12 5.2v3.6M14.5 5.2v3.6"
        stroke="var(--card)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
