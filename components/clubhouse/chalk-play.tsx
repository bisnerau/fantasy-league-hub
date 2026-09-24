/**
 * A coach's chalkboard X's-and-O's play. The solid route runs to the called
 * side; with no call, both routes stay as faint dashed options.
 */
export function ChalkPlay({
  home,
  away,
  call,
}: {
  home: string;
  away: string;
  call: { side: 'home' | 'away'; label: string } | null;
}) {
  const route = (side: 'home' | 'away') =>
    side === 'home'
      ? 'M58 70 C 110 64, 150 30, 238 26'
      : 'M58 70 C 110 78, 150 104, 238 100';
  const description = call
    ? `Chalkboard play: ${call.label}, ${call.side === 'home' ? home : away}`
    : `Chalkboard play: ${home} v ${away}, too close to call`;
  return (
    <>
      <span className="sr-only">{description}</span>
      <svg viewBox="0 0 320 124" className="chalk-play" aria-hidden="true">
        <g className="chalk-marks" fontFamily="var(--font-geist-mono)">
          {[34, 58, 82].map((y) => (
            <text key={y} x="20" y={y + 4} fontSize="14" textAnchor="middle">
              O
            </text>
          ))}
          {[18, 110].map((y) => (
            <text key={y} x="150" y={y + 4} fontSize="14" textAnchor="middle">
              X
            </text>
          ))}
          {(['home', 'away'] as const).map((side) => (
            <path
              key={side}
              d={route(side)}
              pathLength={1}
              className={
                call?.side === side
                  ? 'chalk-line chalk-line-called'
                  : 'chalk-line-option'
              }
            />
          ))}
          {call && (
            <path
              d={
                call.side === 'home'
                  ? 'M230 20 L240 26 L230 32'
                  : 'M230 94 L240 100 L230 106'
              }
              pathLength={1}
              className="chalk-line chalk-line-called chalk-arrow"
            />
          )}
          <text x="250" y="30" fontSize="12" className="chalk-label">
            {home}
          </text>
          <text x="250" y="104" fontSize="12" className="chalk-label">
            {away}
          </text>
          {call && (
            <text
              x="250"
              y={call.side === 'home' ? 46 : 120}
              fontSize="9"
              className="chalk-call"
            >
              {call.label.toUpperCase()}
            </text>
          )}
        </g>
      </svg>
    </>
  );
}
