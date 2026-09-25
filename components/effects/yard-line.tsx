import { Football } from './football';

// The chalk line and football that lead the page-to-page wipe. They are
// hidden until a cross-document view transition marks <html data-vt>, so
// they are only ever captured into the arriving page's snapshot and animated
// there (see "Page transitions" in docs/weekly-clubhouse.md).
export function YardLine() {
  return (
    <div className="vt-field" aria-hidden="true">
      <span className="vt-chalk" />
      <span className="vt-ball">
        <Football className="size-full" />
      </span>
    </div>
  );
}
