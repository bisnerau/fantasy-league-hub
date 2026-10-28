'use client';

import { HalftimeShow } from './halftime-show';
import { useHalftimePreview } from './use-halftime-preview';

export function PrivateHalftime() {
  const preview = useHalftimePreview(true, true);
  if (preview.status === 'ready' && preview.report)
    return (
      <>
        <p className="mb-4 rounded-lg border border-primary/20 px-4 py-3 text-xs text-muted-foreground">
          Private preview · Only your commissioner account can open this report
          until you announce it.
        </p>
        <HalftimeShow report={preview.report} />
      </>
    );
  return (
    <section className="linear-panel rounded-xl p-5" aria-live="polite">
      <h1 className="text-2xl font-semibold">Private preview</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {preview.status === 'loading'
          ? 'Checking your sign-in…'
          : preview.status === 'signed-out'
            ? 'Sign in with your commissioner account to open this preview.'
            : preview.status === 'forbidden'
              ? 'This page is not available to your account.'
              : 'Your access could not be checked. Please try again.'}
      </p>
      {preview.status === 'signed-out' && (
        <a
          href="/matchups"
          className="mt-4 inline-block text-primary underline"
        >
          Sign in
        </a>
      )}
      {preview.status === 'error' && (
        <button className="mt-4 text-primary underline" onClick={preview.retry}>
          Try again
        </button>
      )}
      {preview.status === 'forbidden' && (
        <a href="/" className="mt-4 inline-block text-primary underline">
          Back to the clubhouse
        </a>
      )}
    </section>
  );
}
