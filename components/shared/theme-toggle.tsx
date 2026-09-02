'use client';

import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    typeof document === 'undefined'
      ? true
      : document.documentElement.classList.contains('dark'),
  );

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    window.localStorage.setItem('fantasy-theme', next ? 'dark' : 'light');
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
      className="rounded-full border-white/10 bg-white/5"
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
