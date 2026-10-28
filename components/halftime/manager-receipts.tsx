'use client';
import { useState } from 'react';
import type { halftimeForecastInsights } from '@/lib/season/halftime-forecasts';

type Insights = ReturnType<typeof halftimeForecastInsights>;
export function ManagerReceipts({
  insights,
  status,
}: {
  insights: Insights;
  status: string;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="ht-manager-receipts">
      <div className="ht-member-heading">
        <div>
          <span className="ht-eyebrow">THE MANAGERS’ RECEIPTS</span>
          <h3>Who called it?</h3>
        </div>
        {status === 'ready' && (
          <span className="ht-participation">
            {insights?.count ?? 0}
            <span>/12 submitted</span>
          </span>
        )}
      </div>
      {status !== 'ready' ? (
        <p className="ht-member-message">
          {status === 'loading' ? (
            'Checking the submitted ballots…'
          ) : status === 'error' ? (
            'The manager ballots could not be loaded. No participation count or scores have been assumed.'
          ) : (
            <>
              Sign in to see the original manager predictions, the biggest
              disagreements and the halfway accuracy table.{' '}
              <a href="/matchups">Member sign-in →</a>
            </>
          )}
        </p>
      ) : !insights ? (
        <p className="ht-member-message">
          No complete preseason ballots are available for this league. Nobody
          receives a prediction score.
        </p>
      ) : (
        <>
          <p className="ht-member-message">
            These are the {insights.count} managers who submitted complete
            rankings. Every ballot carries equal weight. Non-submitters receive
            no score; final-season predictions are still in progress.
          </p>
          <div className="ht-manager-insights">
            <article>
              <span className="ht-eyebrow">THE ROOM WAS SPLIT</span>
              {insights.splits[0].spread > 0 ? (
                insights.splits.map((s) => (
                  <div key={s.rosterId}>
                    <h4>{s.name}</h4>
                    <strong>
                      #{s.high} <span>to</span> #{s.low}
                    </strong>
                    <p>
                      {s.believers.join(', ')} had the highest prediction.{' '}
                      {s.doubters.join(', ')} had the lowest.
                    </p>
                  </div>
                ))
              ) : (
                <p>The submitted rankings agree on every team.</p>
              )}
            </article>
            <article>
              <span className="ht-eyebrow">EARLY BELIEVERS</span>
              {insights.surprise ? (
                <>
                  <h4>{insights.surprise.name}</h4>
                  <strong>
                    #{insights.surprise.consensus} <span>→</span> #
                    {insights.surprise.actual}
                  </strong>
                  <p>
                    Consensus to halfway.{' '}
                    {insights.surprise.believers.join(', ')} backed this team
                    highest, at #{insights.surprise.high}.
                  </p>
                </>
              ) : (
                <p>
                  No team is above its consensus position at this checkpoint.
                </p>
              )}
            </article>
            <article>
              <span className="ht-eyebrow">THE SELF-BELIEF CHECK</span>
              {insights.optimism.length ? (
                insights.optimism.map((o) => (
                  <div key={o.rosterId}>
                    <h4>{o.name}</h4>
                    <strong>
                      #{o.predicted} <span>→</span> #{o.actual}
                    </strong>
                    <p>
                      Own forecast to current position. {o.gap} places of
                      optimism still to justify.
                    </p>
                  </div>
                ))
              ) : (
                <p>
                  No submitting manager placed themselves above their current
                  position.
                </p>
              )}
            </article>
          </div>
          <div className="ht-forecast-race">
            <div className="ht-race-label">
              <span>HALFWAY ACCURACY</span>
              <span>PLACES OUT ↓ / EXACT</span>
            </div>
            {insights.scores.map((s) => (
              <div key={s.id}>
                <button
                  type="button"
                  className={s.ai ? 'ht-ai-entry' : ''}
                  aria-expanded={expanded === s.id}
                  onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                >
                  <span>{String(s.position).padStart(2, '0')}</span>
                  <strong>
                    {s.name}
                    {s.ai && <small> ORIGINAL FORECAST</small>}
                  </strong>
                  <b>{s.error}</b>
                  <span>{s.exact}/12</span>
                  <span>{expanded === s.id ? '−' : '+'}</span>
                </button>
                {expanded === s.id && (
                  <div className="ht-ballot-detail">
                    <p>
                      Lower total position error is better. Equal totals share a
                      rank.
                    </p>
                    <table>
                      <caption>
                        {s.name}: the original ballot against Week 7
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col">Team</th>
                          <th scope="col">Called</th>
                          <th scope="col">Week 7</th>
                          <th scope="col">Gap</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.rows.map((r) => (
                          <tr key={r.name}>
                            <th scope="row">{r.name}</th>
                            <td>{r.predicted}</td>
                            <td>{r.actual}</td>
                            <td>{r.gap}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
