const unavailable = new Set(['Out', 'IR', 'PUP', 'Sus']);

// A projection can survive a move to IR. It does not establish availability.
// Completed starters keep their actual score even if their status later changes.
export function unavailableForOdds(id, entry, status) {
  return (
    id === '0' ||
    !Number.isFinite(entry.points) ||
    (!entry.locked && unavailable.has(status))
  );
}
