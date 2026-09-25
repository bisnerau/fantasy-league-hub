'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * Sticky jump links. Plain anchors work without script; the observer only
 * marks the section in view and keeps its chip visible in the rail.
 */
export function SectionChips({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const key = items.map((item) => item.id).join(' ');

  useEffect(() => {
    const sections = key
      .split(' ')
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    if (!sections.length) return;
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        const first = sections.find((section) => visible.has(section.id));
        if (first) setActive(first.id);
        // Back above the first section: nothing is current yet.
        else if (
          sections[0].getBoundingClientRect().top >
          window.innerHeight * 0.35
        )
          setActive(null);
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [key]);

  useEffect(() => {
    const list = rail.current;
    const chip = list?.querySelector<HTMLElement>('[aria-current]');
    if (!list) return;
    list.scrollTo({
      left: chip ? chip.offsetLeft - 16 : 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [active]);

  return (
    <nav aria-label="My Season sections" className="season-chips">
      <div ref={rail} className="snap-rail">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="season-chip"
            aria-current={active === item.id ? 'true' : undefined}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
