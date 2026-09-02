'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export function PointsBars({ pointsFor, pointsAgainst, max }: { pointsFor: number; pointsAgainst: number; max: number }) {
  return (
    <div className="h-8 w-28" aria-label={`${pointsFor.toFixed(1)} points for and ${pointsAgainst.toFixed(1)} points against`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={[{ name: 'points', PF: pointsFor, PA: pointsAgainst }]} layout="vertical" barGap={3} margin={{ top: 1, right: 0, bottom: 1, left: 0 }}>
          <XAxis type="number" domain={[0, max]} hide />
          <YAxis type="category" dataKey="name" hide />
          <Bar dataKey="PF" fill="var(--league-primary)" radius={[0, 3, 3, 0]} barSize={6} />
          <Bar dataKey="PA" fill="var(--league-accent)" radius={[0, 3, 3, 0]} barSize={6} fillOpacity={0.65} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
