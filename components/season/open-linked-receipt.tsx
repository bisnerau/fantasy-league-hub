'use client';
import { useEffect } from 'react';

/** A receipt linked from My Season should open, not just scroll to its closed heading. */
export function OpenLinkedReceipt() {
  useEffect(() => {
    let frame = 0;
    const open = () => {
      if (!/^#trade-\d+$/.test(window.location.hash)) return;
      const target = document.getElementById(window.location.hash.slice(1));
      if (!(target instanceof HTMLDetailsElement)) return;
      target.open = true;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        target.scrollIntoView({ block: 'start' }),
      );
    };
    open();
    window.addEventListener('hashchange', open);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', open);
    };
  }, []);
  return null;
}
