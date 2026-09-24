'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';

// Adapted from React Bits HoldButton (MIT + Commons Clause). A pointer hold
// fills the meter and confirms when full; letting go early cancels. Keyboard
// and screen reader activation (a click with no pointer) and reduced motion
// get an explicit confirm step instead, so nobody has to hold anything.
export function HoldButton({
  children,
  onConfirm,
  disabled,
  label,
  confirmLabel,
  duration = 700,
  className,
}: {
  children: ReactNode;
  onConfirm: () => void;
  disabled?: boolean;
  label: string;
  confirmLabel: string;
  duration?: number;
  className?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [hint, setHint] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const hold = useRef<{ frame: number; done: boolean } | null>(null);
  const completed = useRef(false);

  useEffect(() => {
    if (confirming) confirmRef.current?.focus();
  }, [confirming]);
  useEffect(() => {
    if (!hint) return;
    const timer = window.setTimeout(() => setHint(false), 1600);
    return () => window.clearTimeout(timer);
  }, [hint]);
  useEffect(
    () => () => {
      if (hold.current) cancelAnimationFrame(hold.current.frame);
    },
    [],
  );

  const release = (element: HTMLElement) => {
    const current = hold.current;
    if (!current) return;
    cancelAnimationFrame(current.frame);
    hold.current = null;
    delete element.dataset.holding;
    element.style.setProperty('--hold', '0');
    if (!current.done) setHint(true);
  };

  if (confirming)
    return (
      <fieldset className="hold-confirm">
        <legend className="sr-only">{label}</legend>
        <button
          ref={confirmRef}
          type="button"
          className="hold-confirm-yes"
          disabled={disabled}
          onClick={() => {
            setConfirming(false);
            onConfirm();
          }}
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          className="hold-confirm-no"
          onClick={() => {
            setConfirming(false);
            window.setTimeout(() => buttonRef.current?.focus(), 0);
          }}
        >
          Cancel
        </button>
      </fieldset>
    );

  return (
    <button
      ref={buttonRef}
      type="button"
      className={cn('hold-button', className)}
      aria-label={label}
      disabled={disabled}
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        if (disabled || event.button !== 0 || prefersReducedMotion()) return;
        const element = event.currentTarget;
        element.setPointerCapture(event.pointerId);
        element.dataset.holding = '';
        setHint(false);
        const start = performance.now();
        const tick = (now: number) => {
          const current = hold.current;
          if (!current) return;
          const progress = Math.min((now - start) / duration, 1);
          element.style.setProperty('--hold', String(progress));
          if (progress < 1) {
            current.frame = requestAnimationFrame(tick);
            return;
          }
          current.done = true;
          completed.current = true;
          release(element);
          element.dataset.kicked = '';
          window.setTimeout(() => delete element.dataset.kicked, 900);
          onConfirm();
        };
        hold.current = { frame: requestAnimationFrame(tick), done: false };
      }}
      onPointerUp={(event) => release(event.currentTarget)}
      onPointerCancel={(event) => release(event.currentTarget)}
      onClick={(event) => {
        if (completed.current) {
          completed.current = false;
          return;
        }
        // No pointer: keyboard or assistive technology activated the button.
        if (event.detail === 0 || prefersReducedMotion()) setConfirming(true);
      }}
    >
      <span className="hold-meter" aria-hidden="true" />
      <span className="relative inline-flex items-center gap-2">
        {children}
      </span>
      <span className="hold-hint" aria-live="polite">
        {hint ? 'Keep holding' : ''}
      </span>
    </button>
  );
}
