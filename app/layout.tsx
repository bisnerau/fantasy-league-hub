import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LeagueShell } from '@/components/shared/league-shell';
import { QueryProvider } from '@/components/shared/query-provider';
import { leagueConfig } from '@/lib/config/league.config';
import { getLeague } from '@/lib/sleeper/client';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fantasy-league-hub-plum.vercel.app'),
  title: {
    default: `${leagueConfig.name} · League Hub`,
    template: `%s · ${leagueConfig.name}`,
  },
  description: leagueConfig.tagline,
  openGraph: {
    title: `${leagueConfig.name} · Fantasy League Hub`,
    description:
      'Weekly picks, league stories, and a very long memory. The MAC 12 clubhouse.',
    type: 'website',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: `${leagueConfig.name} league hub`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${leagueConfig.name} · Fantasy League Hub`,
    description:
      'Weekly picks, league stories, and a very long memory. The MAC 12 clubhouse.',
    images: ['/og.jpg'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const league = leagueConfig.sleeperLeagueId
    ? await getLeague(leagueConfig.sleeperLeagueId).catch(() => null)
    : null;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('fantasy-theme');document.documentElement.classList.toggle('dark',t!=='light')}catch(e){}`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            // Skip the arrival fade while a cross-document view transition runs.
            __html: `addEventListener('pagereveal',function(e){var v=e.viewTransition,d=document.documentElement;if(!v)return;d.dataset.vt='';v.finished.finally(function(){delete d.dataset.vt})})`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={
          {
            '--league-primary': leagueConfig.colors.primary,
            '--league-secondary': leagueConfig.colors.secondary,
            '--league-accent': leagueConfig.colors.accent,
          } as React.CSSProperties
        }
      >
        <QueryProvider>
          <LeagueShell
            leagueAvatar={league?.avatar ?? null}
            season={league?.season}
          >
            {children}
          </LeagueShell>
        </QueryProvider>
      </body>
    </html>
  );
}
