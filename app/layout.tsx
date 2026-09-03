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
  metadataBase: new URL(
    'https://sunday-syndicate-hub.emmet793061.chatgpt.site',
  ),
  title: {
    default: `${leagueConfig.name} · League Hub`,
    template: `%s · ${leagueConfig.name}`,
  },
  description: leagueConfig.tagline,
  openGraph: {
    title: `${leagueConfig.name} · Fantasy League Hub`,
    description:
      'Twelve teams. One trophy. Live matchups, standings, and league pulse.',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1024,
        height: 1024,
        alt: `${leagueConfig.name} league hub`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${leagueConfig.name} · Fantasy League Hub`,
    description:
      'Twelve teams. One trophy. Live matchups, standings, and league pulse.',
    images: ['/og.png'],
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
          <LeagueShell leagueAvatar={league?.avatar ?? null}>
            {children}
          </LeagueShell>
        </QueryProvider>
      </body>
    </html>
  );
}
