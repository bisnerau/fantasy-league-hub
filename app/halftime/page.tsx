import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HalftimeShow } from '@/components/halftime/halftime-show';
import { halftimeReport } from '@/lib/data/halftime/report';
import { halftimePublication } from '@/lib/data/halftime/publication';
import './halftime.css';

const publishedMetadata: Metadata = {
  title: 'The Halftime Show',
  description: 'Seven weeks. Twelve managers. The MAC 12 halfway report.',
  alternates: { canonical: '/halftime' },
  openGraph: {
    title: 'The Halftime Show · MAC 12',
    description:
      'The Week 7 table, twelve team reports and the original preseason receipts.',
    url: 'https://fantasy-league-hub-plum.vercel.app/halftime',
    type: 'article',
    publishedTime: halftimePublication.publishedAt,
    images: [
      {
        url: '/images/halftime/2026-halftime-og.png',
        width: 1200,
        height: 630,
        alt: 'MAC12 Halftime Show. Seven weeks down, seven to go.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Halftime Show · MAC 12',
    description: 'Seven weeks. Twelve managers. A table full of receipts.',
    images: ['/images/halftime/2026-halftime-og.png'],
  },
};

export const metadata: Metadata = halftimePublication.isPublic
  ? publishedMetadata
  : { title: 'Page unavailable', robots: { index: false, follow: false } };

export default function HalftimePage() {
  if (!halftimePublication.isPublic && process.env.NODE_ENV !== 'development') {
    notFound();
  }
  return <HalftimeShow report={halftimeReport} />;
}
