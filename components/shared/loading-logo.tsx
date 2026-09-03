'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export function LoadingLogo() {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFill((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto size-28 sm:size-32">
      <Image
        src="/logo.png"
        alt="MAC 12"
        width={128}
        height={128}
        unoptimized
        className="absolute inset-0 size-full object-contain opacity-15 grayscale"
      />
      <Image
        src="/logo.png"
        alt=""
        width={128}
        height={128}
        unoptimized
        className="absolute inset-0 size-full object-contain"
        style={{ clipPath: `inset(${100 - fill}% 0 0 0)` }}
      />
    </div>
  );
}
