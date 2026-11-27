'use client';

import { useState } from 'react';
import { spark } from '@/components/effects/click-spark';

/** Original SVG artwork with a short, replayable Griddy. */
export function ThanksgivingMascot() {
  const [celebration, setCelebration] = useState(0);
  return (
    <div className="feast-mascot-wrap">
      <button
        type="button"
        className="feast-mascot"
        aria-label="Make the turkey do the Griddy"
        onClick={(event) => {
          setCelebration((count) => count + 1);
          spark(event.currentTarget, { thanksgiving: true });
        }}
      >
        <svg
          key={celebration}
          viewBox="0 0 280 260"
          fill="none"
          aria-hidden="true"
        >
          <ellipse
            cx="140"
            cy="233"
            rx="107"
            ry="17"
            fill="#e4aa60"
            opacity=".14"
          />
          <ellipse
            cx="140"
            cy="228"
            rx="96"
            ry="12"
            stroke="#e4aa60"
            strokeWidth="2"
            opacity=".5"
          />
          <g className="feast-turkey">
            <g className="feast-tail">
              {[-60, -40, -20, 0, 20, 40, 60].map((angle, index) => (
                <g key={angle} transform={`rotate(${angle} 140 159)`}>
                  <rect
                    x="122"
                    y="23"
                    width="36"
                    height="139"
                    rx="18"
                    fill={index % 2 ? '#a84238' : '#db873c'}
                    stroke="#2d201a"
                    strokeWidth="3"
                  />
                  <path
                    d="M131 46Q140 34 149 46L146 89H134Z"
                    fill={index % 2 ? '#e6a55c' : '#f4cb85'}
                  />
                  <path
                    d="M140 96V143"
                    stroke="#543326"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>
              ))}
            </g>
            <g
              stroke="#efb158"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g className="feast-leg feast-leg-left">
                <path d="M119 199L114 215L112 227" />
                <path
                  className="feast-foot-left"
                  d="M103 230L113 225L122 229"
                />
              </g>
              <g className="feast-leg feast-leg-right">
                <path d="M157 199L162 215L164 227" />
                <path
                  className="feast-foot-right"
                  d="M154 230L164 225L174 230"
                />
              </g>
            </g>
            <ellipse
              cx="140"
              cy="164"
              rx="58"
              ry="53"
              fill="#673b29"
              stroke="#2d201a"
              strokeWidth="3"
            />
            <path
              d="M88 159Q140 184 192 159L183 196Q140 225 97 196Z"
              fill="#244d3a"
              stroke="#e5b16c"
              strokeWidth="3"
            />
            <path
              d="M108 185H116V204M135 186Q153 180 153 190L135 204H155"
              stroke="#fff1d7"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g className="feast-wing feast-wing-left">
              <path
                d="M97 149Q61 160 58 186Q78 190 104 169"
                fill="#905131"
                stroke="#2d201a"
                strokeWidth="3"
              />
              <path
                d="M69 171L65 181M77 170L73 183"
                stroke="#e6a55c"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
            <g className="feast-wing feast-wing-right">
              <path
                d="M183 149Q219 160 222 186Q202 190 176 169"
                fill="#905131"
                stroke="#2d201a"
                strokeWidth="3"
              />
              <path
                d="M211 171L215 181M203 170L207 183"
                stroke="#e6a55c"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
            <path
              d="M119 139V110Q118 87 141 87Q166 86 165 110L160 143"
              fill="#bf7840"
              stroke="#2d201a"
              strokeWidth="3"
            />
            <path
              d="M116 104Q111 77 140 73Q166 73 172 101L159 107H120Z"
              fill="#244d3a"
              stroke="#f5c989"
              strokeWidth="3"
            />
            <path d="M140 75V99" stroke="#f4cb85" strokeWidth="7" />
            <circle cx="149" cy="113" r="4" fill="#211b18" />
            <circle cx="150" cy="112" r="1.2" fill="#fff1d7" />
            <path d="M161 116L179 123L160 129Z" fill="#f2b952" />
            <path
              d="M159 130Q176 134 164 149Q153 153 154 139Z"
              fill="#b9473e"
            />
            <g
              className="feast-griddy-goggles"
              stroke="#905131"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M97 153L110 127L127 118M183 153L174 129L159 119" />
              <circle cx="132" cy="113" r="9" />
              <circle cx="153" cy="113" r="9" />
            </g>
          </g>
          <g transform="translate(204 217) rotate(-20)">
            <ellipse
              rx="25"
              ry="14"
              fill="#9f4d2c"
              stroke="#f5c989"
              strokeWidth="2"
            />
            <path
              d="M-12 0H12M-6-4V4M0-4V4M6-4V4"
              stroke="#fff1d7"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </button>
      <p className="feast-mascot-hint">Tap to hit the Griddy</p>
      <output className="sr-only">
        {celebration > 0
          ? 'The turkey is hitting the Griddy. Happy Thanksgiving, MAC 12!'
          : ''}
      </output>
    </div>
  );
}
