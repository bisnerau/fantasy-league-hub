import type { PredictionWeekData } from '@/lib/data/predictions';
import { isThanksgivingWeek } from '@/lib/data/thanksgiving-week';
import { ThanksgivingMascot } from './thanksgiving-mascot';

export function ThanksgivingWeek({ data }: { data: PredictionWeekData }) {
  if (!isThanksgivingWeek(data)) return null;

  return (
    <aside aria-labelledby="thanksgiving-title" className="feast-board">
      <div className="feast-ribbon">
        <span>MAC 12 · Thanksgiving weekend</span>
        <span>Week 12</span>
      </div>
      <div className="feast-main">
        <div className="feast-copy">
          <p className="feast-eyebrow">The Friday leftovers edition</p>
          <h2 id="thanksgiving-title">
            Pass the gravy.
            <br />
            <em>Pick a winner.</em>
          </h2>
          <p className="feast-intro">
            Gibbs took seconds. Allen barely touched his plate. Six fresh
            previews, one very crowded playoff table.
          </p>
          <a
            className="feast-cta"
            href={`/matchups?week=${data.week}#weekly-ballot`}
          >
            {data.locked ? 'See the picks' : 'Serve the picks'}
          </a>
          <p className="feast-deadline">
            Six picks + one Banker
            <br />
            <strong>Sunday 29 Nov · 18:00 Irish time</strong>
          </p>
        </div>
        <ThanksgivingMascot />
      </div>
      <div
        className="feast-receipts"
        aria-label="Thanksgiving fantasy highlights at Friday publication"
      >
        <a href="/matchups?week=12#matchup-3">
          <span className="feast-course">The extra helping</span>
          <strong>48.20</strong>
          <span>Gibbs for Alan</span>
        </a>
        <a href="/matchups?week=12#matchup-4">
          <span className="feast-course">The full plate</span>
          <strong>105.62</strong>
          <span>Keenan · six played</span>
        </a>
        <a href="/matchups?week=12#matchup-5">
          <span className="feast-course">The empty plate</span>
          <strong>3.54</strong>
          <span>Allen for Jack</span>
        </a>
      </div>
      <div className="feast-footer">
        <p>
          <strong>Friday’s course:</strong> Broncos–Steelers · Fri 27 Nov, 20:00
          Irish time. Then Sunday’s slate and Monday night.
        </p>
        <p>
          Odds refreshed Friday using banked scores and remaining lineups.
          Updated odds apply to all Week 12 picks, including saved picks and
          Bankers. Set Sleeper lineups before each player’s kickoff.
        </p>
      </div>
    </aside>
  );
}
