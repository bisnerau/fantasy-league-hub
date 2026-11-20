import type { Metadata } from 'next';
import { getPlayoffForecast } from '@/lib/data/playoff-chances';
import { getInsights } from '@/lib/playoffs/insights';
import { PlayoffChances } from '@/components/playoffs/playoff-chances';
import './playoffs.css';
export const metadata: Metadata = {
  title: 'Playoff Chances',
  description:
    'The MAC 12 playoff race, last-place odds and games that matter.',
};
export const dynamic = 'force-dynamic';
export default async function PlayoffChancesPage() {
  const data = await getPlayoffForecast();
  const insights = data.snapshot
    ? getInsights(data.snapshot.input, data.snapshot.result)
    : null;
  return <PlayoffChances initial={data} initialInsights={insights} />;
}
