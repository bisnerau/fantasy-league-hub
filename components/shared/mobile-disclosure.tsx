'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

/** Compact on phones; the full content stays expanded at the site's sm breakpoint. */
export function MobileDisclosure({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [wide, setWide] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)');
    const update = () => setWide(media.matches);
    const timer = window.setTimeout(update, 0);
    media.addEventListener('change', update);
    return () => {
      window.clearTimeout(timer);
      media.removeEventListener('change', update);
    };
  }, []);
  return (
    <Collapsible
      open={wide || mobileOpen}
      onOpenChange={setMobileOpen}
      className="rounded-xl border border-border sm:border-0 sm:rounded-none"
    >
      <CollapsibleTrigger className="group flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold focus-visible:outline-2 focus-visible:outline-primary sm:hidden">
        {title}
        <ChevronDown className="size-4 shrink-0 transition-transform group-data-[panel-open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent keepMounted>
        <div className="px-3 pb-3 sm:p-0">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
