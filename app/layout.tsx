import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LeagueShell } from '@/components/shared/league-shell';
import { QueryProvider } from '@/components/shared/query-provider';
import { leagueConfig } from '@/lib/config/league.config';
import { navigationOrder } from '@/lib/config/navigation';
import { transitionDirection } from '@/lib/navigation/transition';
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

// Marks the arrival of a cross-document view transition with its sweep
// direction (data-vt="forward|back"), which skips the arrival fade and points
// the yard-line wipe. The page being left is remembered for browsers without
// navigation.activation, so Back still reverses the sweep.
const pageRevealScript = `(function(){var o=${JSON.stringify(navigationOrder)},k='vt-from',dir=${String(transitionDirection)};function keep(){try{sessionStorage.setItem(k,location.pathname)}catch(x){}}addEventListener('pageswap',keep);addEventListener('pagehide',keep);addEventListener('pagereveal',function(e){var v=e.viewTransition,d=document.documentElement,f=null;if(!v)return;try{var a=window.navigation&&navigation.activation,u=a&&a.from&&a.from.url;if(u){var p=new URL(u);if(p.origin===location.origin)f=p.pathname}if(!f)f=sessionStorage.getItem(k)}catch(x){}d.dataset.vt=dir(f,location.pathname,o);v.finished.finally(function(){delete d.dataset.vt})})})()`;

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
            __html: pageRevealScript,
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
