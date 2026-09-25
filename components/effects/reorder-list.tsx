'use client';

import { useCallback, useLayoutEffect, useRef, type RefObject } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

type Timing = { duration: number; stagger: number };

// Adapted from React Bits AnimatedList (MIT + Commons Clause) as a FLIP
// reorder without the motion dependency. Call `capture` just before changing
// the order; rows marked with data-reorder-key then glide from where they
// were to where they now sit. The DOM order is always the real order, and
// reduced motion reorders instantly.
export function useReorder(
  listRef: RefObject<HTMLElement | null>,
  order: string,
) {
  const snapshot = useRef<{ tops: Map<string, number>; timing: Timing }>(null);

  const capture = useCallback(
    (timing: Timing = { duration: 420, stagger: 0 }) => {
      const list = listRef.current;
      if (!list || prefersReducedMotion()) return;
      const origin = list.getBoundingClientRect().top;
      const tops = new Map<string, number>();
      for (const row of rows(list))
        tops.set(
          row.dataset.reorderKey!,
          row.getBoundingClientRect().top - origin,
        );
      snapshot.current = { tops, timing };
    },
    [listRef],
  );

  useLayoutEffect(() => {
    const list = listRef.current;
    const before = snapshot.current;
    snapshot.current = null;
    if (!list || !before) return;
    const items = rows(list);
    for (const row of items) {
      row.style.transition = 'none';
      row.style.transform = '';
    }
    const origin = list.getBoundingClientRect().top;
    const moved = items.flatMap((row) => {
      const from = before.tops.get(row.dataset.reorderKey!);
      const delta =
        from == null ? 0 : from - (row.getBoundingClientRect().top - origin);
      if (Math.abs(delta) < 1) return [];
      row.style.transform = `translateY(${delta}px)`;
      return [row];
    });
    for (const row of items)
      if (!moved.includes(row)) row.style.transition = '';
    if (!moved.length) return;
    void list.offsetHeight;
    moved.forEach((row, index) => {
      row.style.transition = `transform ${before.timing.duration}ms cubic-bezier(0.2, 0.8, 0.2, 1) ${index * before.timing.stagger}ms`;
      row.style.transform = '';
      row.addEventListener(
        'transitionend',
        () => {
          row.style.transition = '';
        },
        { once: true },
      );
    });
  }, [listRef, order]);

  return capture;
}

const rows = (list: HTMLElement) => [
  ...list.querySelectorAll<HTMLElement>('[data-reorder-key]'),
];
