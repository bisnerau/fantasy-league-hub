'use client';

import { useState } from 'react';
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Home,
  Menu,
  NotebookPen,
  Skull,
  Users,
  Vote,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { leagueConfig } from '@/lib/config/league.config';
import { cn } from '@/lib/utils';

const navigation = [
  { label: 'Clubhouse', shortLabel: 'Home', href: '/', icon: Home },
  { label: 'Weekly picks', shortLabel: 'Picks', href: '/matchups', icon: Vote },
  {
    label: 'Record book',
    shortLabel: 'Records',
    href: '/records',
    icon: BookOpen,
  },
  { label: 'League standings', href: '/standings', icon: BarChart3 },
  { label: 'Managers', href: '/managers', icon: Users },
  { label: 'Wall of shame', href: '/wall-of-shame', icon: Skull },
  {
    label: 'Draft Report & Season Preview',
    href: '/draft-recap',
    icon: NotebookPen,
  },
];

export function LeagueShell({
  children,
  leagueAvatar,
  season,
}: {
  children: React.ReactNode;
  leagueAvatar: string | null;
  season?: string;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const activePage = navigation.find((item) => item.href === pathname);
  const avatarUrl = leagueAvatar
    ? `https://sleepercdn.com/avatars/thumbs/${leagueAvatar}`
    : '/logo.png';
  const sleeperUrl = leagueConfig.sleeperLeagueId
    ? `https://sleeper.com/leagues/${leagueConfig.sleeperLeagueId}`
    : 'https://sleeper.com';
  const sleeperLink = (
    <a
      href={sleeperUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="clubhouse-text-link min-h-11"
      aria-label="Open MAC 12 on Sleeper (new tab)"
    >
      Open Sleeper <ArrowUpRight className="size-4" />
    </a>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[216px] flex-col border-r border-border bg-sidebar px-4 py-6 xl:flex">
        <a
          href="/"
          className="flex items-center gap-3"
          aria-label="MAC 12 home"
        >
          <span className="brand-mark">
            <Image
              src={avatarUrl}
              alt=""
              width={56}
              height={56}
              unoptimized
              className="size-full object-contain"
            />
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight">
              MAC 12
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Est. 2020
            </span>
          </span>
        </a>
        <nav className="mt-10 space-y-1" aria-label="Primary navigation">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'nav-item',
                  index === 3 && 'mt-6',
                  pathname === item.href && 'nav-item-active',
                )}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                <Icon className="size-[18px] shrink-0" />
                <span className="min-w-0 leading-5">{item.label}</span>
              </a>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-border pt-5">
          {sleeperLink}
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Your team lives there.
            <br />
            Its reputation lives here.
          </p>
        </div>
      </aside>
      <div className="xl:pl-[216px]">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 sm:px-7">
          <a
            href="/"
            className="flex items-center gap-2.5 xl:hidden"
            aria-label="MAC 12 home"
          >
            <Image
              src={avatarUrl}
              alt=""
              width={36}
              height={36}
              unoptimized
              className="size-9 object-contain"
            />
            <span className="text-sm font-black tracking-tight">MAC 12</span>
          </a>
          <p className="hidden text-xs text-muted-foreground xl:block">
            MAC 12 <span className="mx-2">/</span>{' '}
            <span className="text-foreground">
              {activePage?.label ?? 'League'}
            </span>
          </p>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:block">
              {season && `${season} season`}
            </span>
            <span className="hidden xl:block">{sleeperLink}</span>
            <ThemeToggle />
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1280px] scroll-mt-20 px-4 pb-28 pt-6 outline-none sm:px-7 sm:pt-8 xl:pb-12"
        >
          <div key={pathname} className="page-arrival">
            {children}
          </div>
        </main>
      </div>
      <nav
        className="mobile-clubhouse-nav xl:hidden"
        aria-label="Mobile navigation"
      >
        {navigation.slice(0, 3).map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'mobile-nav-item',
                pathname === item.href && 'mobile-nav-item-active',
              )}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              <Icon className="size-5" />
              <span>{item.shortLabel}</span>
            </a>
          );
        })}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            className={cn(
              'mobile-nav-item',
              navigation.slice(3).some((item) => item.href === pathname) &&
                'mobile-nav-item-active',
            )}
            aria-label="Open league navigation"
          >
            <Menu className="size-5" />
            <span>League</span>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="rounded-t-2xl p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] duration-150"
          >
            <SheetTitle className="text-xl font-bold">
              Around the league
            </SheetTitle>
            <SheetDescription>
              Records, characters, and the evidence.
            </SheetDescription>
            <nav
              aria-label="More league pages"
              className="grid gap-1 sm:grid-cols-2"
            >
              {navigation.slice(3).map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'nav-item min-h-12',
                      pathname === item.href && 'nav-item-active',
                    )}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </a>
                );
              })}
            </nav>
            <div className="border-t border-border pt-2">{sleeperLink}</div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
