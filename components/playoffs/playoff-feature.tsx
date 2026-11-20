import { ArrowUpRight } from 'lucide-react';
export function PlayoffFeature() {
  return (
    <a
      href="/playoff-chances"
      className="halftime-feature"
      aria-label="Explore Playoff Chances"
    >
      <div>
        <p>MAC 12 · THE RUN-IN</p>
        <h2>
          Playoff Chances<span>.</span>
        </h2>
        <p className="halftime-feature-copy">
          Who’s sniffing around? Who’s looking over their shoulder? The odds,
          the bubble and the games that matter.
        </p>
        <span className="halftime-feature-link">
          Explore the race <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="halftime-feature-clock" aria-hidden="true">
        06<span>/12</span>
        <small>SPOTS TO FILL</small>
      </div>
    </a>
  );
}
