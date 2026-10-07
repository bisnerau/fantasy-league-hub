'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { formatAudioTime } from '@/lib/data/return-of-the-mac';

export function AudioPlayer({
  src,
  durationSeconds,
  title,
}: {
  src: string;
  durationSeconds: number;
  title: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekId = useId();
  const [playing, setPlaying] = useState(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(durationSeconds);
  const [ready, setReady] = useState(false);

  // Metadata or a load error can arrive before the server-rendered player
  // hydrates. Reconcile the existing media state as well as future events.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.error) {
      setFailed(true);
    } else if (audio.readyState >= 1 && Number.isFinite(audio.duration)) {
      setDuration(audio.duration);
      setReady(audio.duration > 0);
      setElapsed(audio.currentTime);
    }
  }, []);

  function fail() {
    setPlaying(false);
    setPending(false);
    setFailed(true);
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!failed && !audio.paused) {
      audio.pause();
      return;
    }
    if (failed) {
      setFailed(false);
      setReady(false);
      setElapsed(0);
      audio.load();
    }
    setPending(true);
    try {
      await audio.play();
    } catch (error) {
      // A pause during a pending play is intentional, not a broken recording.
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        fail();
    }
  }

  return (
    <fieldset className="mac-player min-w-0">
      <legend className="sr-only">Audio: {title}</legend>
      {/* Launch explicitly omits a transcript; do not fabricate captions. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const seconds = event.currentTarget.duration;
          if (Number.isFinite(seconds) && seconds > 0) {
            setDuration(seconds);
            setReady(true);
          }
        }}
        onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
        onPlaying={() => {
          setPlaying(true);
          setPending(false);
          setFailed(false);
        }}
        onWaiting={() => {
          setPlaying(false);
          setPending(true);
        }}
        onPause={() => {
          setPlaying(false);
          setPending(false);
        }}
        onEnded={() => {
          setPlaying(false);
          setPending(false);
        }}
        onError={fail}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="mac-play-button"
          onClick={() => void togglePlayback()}
        >
          {failed ? (
            <RotateCcw className="size-4" aria-hidden="true" />
          ) : playing || pending ? (
            <Pause className="size-4" aria-hidden="true" />
          ) : (
            <Play className="size-4" aria-hidden="true" />
          )}
          {failed
            ? 'Retry playback'
            : playing || pending
              ? 'Pause episode'
              : elapsed >= duration
                ? 'Replay episode'
                : 'Play episode'}
          <span className="font-mono text-xs">
            · {formatAudioTime(duration)}
          </span>
        </button>
        <span className="mac-on-air" data-active={playing}>
          <span aria-hidden="true" /> ON AIR
          <span className="sr-only">{playing ? ' — playing' : ' — off'}</span>
        </span>
      </div>
      <label className="sr-only" htmlFor={seekId}>
        Seek episode
      </label>
      <input
        id={seekId}
        className="mac-seek"
        type="range"
        min={0}
        max={duration}
        step={1}
        value={Math.min(elapsed, duration)}
        disabled={!ready || failed}
        aria-valuetext={`${formatAudioTime(elapsed)} of ${formatAudioTime(duration)}`}
        onChange={(event) => {
          const seconds = Number(event.currentTarget.value);
          if (audioRef.current) audioRef.current.currentTime = seconds;
          setElapsed(seconds);
        }}
      />
      <div
        className="flex justify-between font-mono text-xs text-muted-foreground"
        aria-hidden="true"
      >
        <span>{formatAudioTime(elapsed)}</span>
        <span>{formatAudioTime(duration)}</span>
      </div>
      <output className="mt-2 block text-xs text-muted-foreground">
        {failed
          ? 'The recording couldn’t be played. Try again.'
          : pending
            ? 'Loading recording…'
            : '\u00a0'}
      </output>
      <noscript>
        <a href={src} className="clubhouse-text-link min-h-11">
          Open recording
        </a>
      </noscript>
    </fieldset>
  );
}
