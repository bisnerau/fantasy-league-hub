import type { Metadata } from 'next';
import { OddsPlayground } from '@/components/predictions/odds-playground';

export const metadata: Metadata = {
  title: 'Odds playground',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function OddsPlaygroundPage() {
  // A public practice page: picks stay in the browser and never touch the
  // real competition, votes or Bankers. Unlinked and not indexed.
  return <OddsPlayground />;
}
