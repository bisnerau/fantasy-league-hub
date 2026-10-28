import { ArrowUpRight } from 'lucide-react';

export function HalftimeFeature() {
  return (
    <a
      href="/halftime"
      className="halftime-feature"
      aria-label="Read the Halftime Show"
    >
      <div>
        <p>MAC12 STUDIOS · THE WEEK 7 CHECKPOINT</p>
        <h2>
          The Halftime Show<span>.</span>
        </h2>
        <p className="halftime-feature-copy">
          Seven weeks. Twelve team reports. The original predictions, the moves
          and the receipts.
        </p>
        <span className="halftime-feature-link">
          Roll the tape <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="halftime-feature-clock" aria-hidden="true">
        07<span>/14</span>
        <small>SEVEN TO GO</small>
      </div>
    </a>
  );
}
