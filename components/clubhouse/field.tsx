import { Fragment, type ReactNode } from 'react';

/** A faint chalk yard line with its numbers, as on a real field. */
function YardLine({ yard }: { yard: number }) {
  return (
    <div className="yard-line" aria-hidden="true">
      <span>{yard}</span>
      <span>{yard}</span>
    </div>
  );
}

/**
 * Lays sections down the page like a football field: a yard line before each
 * section, climbing ten yards at a time to midfield and back down towards the
 * end zone in the footer.
 */
export function Field({
  sections,
}: {
  sections: { key: string; node: ReactNode }[];
}) {
  return sections.map(({ key, node }, index) => (
    <Fragment key={key}>
      <YardLine yard={10 * Math.min(index + 1, sections.length - index, 5)} />
      {node}
    </Fragment>
  ));
}

export function EndZone({ children }: { children: ReactNode }) {
  return (
    <footer className="end-zone">
      <span className="end-zone-word" aria-hidden="true">
        MAC 12
      </span>
      {children}
    </footer>
  );
}
