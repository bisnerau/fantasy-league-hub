'use client';

import { BarChart3, Home, Radio, Settings2, Trophy } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { leagueConfig } from '@/lib/config/league.config';
import { cn } from '@/lib/utils';

const mainNavigation = [
  { label: 'Clubhouse', href: '/', icon: Home },
  { label: 'Standings', href: '/standings', icon: BarChart3 },
];

const upcoming = ['Power rankings', 'Matchup center', 'Draft room', 'Trade center', 'Wall of shame'];

export function LeagueShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-white/8 bg-sidebar/95 px-4 py-5 backdrop-blur-xl lg:flex lg:flex-col">
        <Link href="/" className="flex items-center gap-3 px-2" aria-label={`${leagueConfig.name} home`}>
          <span className="brand-mark">{leagueConfig.shortName}</span>
          <span className="min-w-0">
            <span className="block truncate font-heading text-sm font-black uppercase tracking-[0.12em]">{leagueConfig.name}</span>
            <span className="mt-0.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">League command</span>
          </span>
        </Link>

        <nav className="mt-10" aria-label="Primary navigation">
          <p className="nav-eyebrow">Live board</p>
          <div className="mt-2 space-y-1">
            {mainNavigation.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn('nav-item', active && 'nav-item-active')}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="size-[18px]" />
                  {item.label}
                  {active && <Radio className="ml-auto size-3.5 text-primary" />}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="mt-8">
          <p className="nav-eyebrow">On the roadmap</p>
          <div className="mt-3 space-y-3 px-3">
            {upcoming.map((item, index) => (
              <div key={item} className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-mono text-[9px] text-white/25">0{index + 2}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto rounded-xl border border-primary/15 bg-primary/[0.05] p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary"><Trophy className="size-4" /> The road to Sunday</div>
          <p className="mt-2 text-[11px] leading-5 text-muted-foreground">Phase 1 is live. Matchups and rankings are next on the commissioner board.</p>
        </div>
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/8 bg-background/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <span className="brand-mark brand-mark-sm">{leagueConfig.shortName}</span>
            <span className="font-heading text-xs font-black uppercase tracking-[0.1em]">{leagueConfig.name}</span>
          </Link>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
            <span className="live-dot" />
            League feed ready
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden rounded-full border border-white/8 bg-white/[0.035] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:inline-flex">2026 season</span>
            <ThemeToggle />
            <button className="flex size-8 items-center justify-center rounded-full border border-white/8 bg-white/[0.035] text-muted-foreground" aria-label="League settings"><Settings2 className="size-4" /></button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1460px] px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-12">{children}</main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-2 rounded-2xl border border-white/10 bg-[#11140f]/95 p-1.5 shadow-2xl backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
        {mainNavigation.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={cn('mobile-nav-item', active && 'mobile-nav-item-active')} aria-current={active ? 'page' : undefined}>
              <Icon className="size-[18px]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
