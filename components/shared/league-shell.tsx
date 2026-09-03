'use client';

import {
  BarChart3,
  BookOpen,
  Home,
  Radio,
  Settings2,
  Skull,
  Trophy,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import { leagueConfig } from '@/lib/config/league.config';
import { cn } from '@/lib/utils';

const mainNavigation = [
  { label: 'Clubhouse', href: '/', icon: Home },
  { label: 'Standings', href: '/standings', icon: BarChart3 },
  { label: 'Record book', href: '/records', icon: BookOpen },
  { label: 'Managers', href: '/managers', icon: Users },
  { label: 'Wall of shame', href: '/wall-of-shame', icon: Skull },
];

const upcoming = [
  'Power rankings',
  'Matchup center',
  'Trade center',
  'Draft recap',
];

export function LeagueShell({
  children,
  leagueAvatar,
}: {
  children: React.ReactNode;
  leagueAvatar: string | null;
}) {
  const pathname = usePathname();
  const avatarUrl = leagueAvatar
    ? `https://sleepercdn.com/avatars/thumbs/${leagueAvatar}`
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[224px] border-r border-white/8 bg-sidebar/95 px-3 py-4 backdrop-blur-xl lg:flex lg:flex-col">
        <a
          href="/"
          className="flex items-center gap-3.5 px-2"
          aria-label={`${leagueConfig.name} home`}
        >
          <span className="brand-mark">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt=""
                width={56}
                height={56}
                unoptimized
                className="size-full rounded-2xl object-cover"
              />
            ) : (
              leagueConfig.shortName
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-heading text-base font-black uppercase tracking-[0.12em]">
              {leagueConfig.name}
            </span>
            <span className="mt-1 block text-[11px] text-muted-foreground">
              Fantasy league
            </span>
          </span>
        </a>

        <nav className="mt-8" aria-label="Primary navigation">
          <p className="nav-eyebrow">Workspace</p>
          <div className="mt-2 space-y-1">
            {mainNavigation.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn('nav-item', active && 'nav-item-active')}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="size-[18px]" />
                  {item.label}
                  {active && (
                    <Radio className="ml-auto size-3.5 text-primary" />
                  )}
                </a>
              );
            })}
          </div>
        </nav>

        <div className="mt-7">
          <p className="nav-eyebrow">Coming next</p>
          <div className="mt-3 space-y-3 px-3">
            {upcoming.map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-3 text-xs text-muted-foreground"
              >
                <span className="font-mono text-[9px] text-white/25">
                  0{index + 2}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto rounded-xl border border-white/8 bg-white/[0.025] p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            <Trophy className="size-4 text-primary" /> Draft week
          </div>
          <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
            Sunday, 6 September · 11:00
          </p>
        </div>
      </aside>

      <div className="lg:pl-[224px]">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/8 bg-background/85 px-4 backdrop-blur-xl sm:px-6 lg:px-7">
          <a href="/" className="flex items-center gap-2.5 lg:hidden">
            <span className="brand-mark brand-mark-sm">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                  className="size-full rounded-lg object-cover"
                />
              ) : (
                leagueConfig.shortName
              )}
            </span>
            <span className="font-heading text-xs font-black uppercase tracking-[0.1em]">
              {leagueConfig.name}
            </span>
          </a>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
            <span className="text-muted-foreground/60">MAC 12</span>
            <span className="text-muted-foreground/30">/</span>
            <span className="text-foreground/80">Draft hub</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden rounded-md border border-white/8 bg-white/[0.025] px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
              2026 season
            </span>
            <ThemeToggle />
            <button
              className="flex size-8 items-center justify-center rounded-full border border-white/8 bg-white/[0.035] text-muted-foreground"
              aria-label="League settings"
            >
              <Settings2 className="size-4" />
            </button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1320px] px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:px-7 lg:pb-12">
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 rounded-2xl border border-white/10 bg-[#11140f]/95 p-1.5 shadow-2xl backdrop-blur-xl lg:hidden"
        aria-label="Mobile navigation"
      >
        {mainNavigation.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'mobile-nav-item',
                active && 'mobile-nav-item-active',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="size-[18px]" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
