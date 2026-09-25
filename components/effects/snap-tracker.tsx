'use client';

import { useEffect, useState } from 'react';
import { Football } from './football';

// Only slow pages earn the snap; fast ones arrive before it shows.
const SHOW_AFTER_MS = 150;
// A stopped or failed navigation never leaves the ball running.
const GIVE_UP_MS = 12_000;

// The snap: while the next page is built on the server, a football runs along
// a thin drive track under the header. It never reaches the end zone, because
// the page's arrival (and its yard-line wipe) is the real finish.
export function SnapTracker() {
  const [snapping, setSnapping] = useState(false);

  useEffect(() => {
    let showTimer: number | undefined;
    let giveUpTimer: number | undefined;
    const reset = () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(giveUpTimer);
      setSnapping(false);
    };
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor =
        event.target instanceof Element
          ? event.target.closest('a[href]')
          : null;
      if (
        !(anchor instanceof HTMLAnchorElement) ||
        anchor.hasAttribute('download') ||
        (anchor.target && anchor.target !== '_self')
      ) {
        return;
      }
      const url = new URL(anchor.href);
      if (
        url.origin !== window.location.origin ||
        (url.pathname === window.location.pathname &&
          url.search === window.location.search)
      ) {
        return;
      }
      reset();
      showTimer = window.setTimeout(() => setSnapping(true), SHOW_AFTER_MS);
      giveUpTimer = window.setTimeout(reset, GIVE_UP_MS);
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) reset();
    };
    document.addEventListener('click', onClick);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(giveUpTimer);
      document.removeEventListener('click', onClick);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  return (
    <span
      className="snap-track"
      data-snap={snapping || undefined}
      aria-hidden="true"
    >
      <span className="snap-ball">
        <Football className="size-full" />
      </span>
    </span>
  );
}
