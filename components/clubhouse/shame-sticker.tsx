import Image from 'next/image';
import { ArrowRight, Skull } from 'lucide-react';
import { TearReveal } from '@/components/effects/tear-reveal';
import { forfeits } from '@/lib/data/wall-of-shame';

/** Last season's wooden spoon, under a sticker you peel back. */
export function ShameSticker() {
  const latest = [...forfeits].sort((a, b) => b.year - a.year)[0];
  if (!latest)
    return (
      <a href="/wall-of-shame" className="shame-tile">
        <Skull className="size-5" aria-hidden="true" />
        <span className="mt-auto font-bold">The Wall of Shame</span>
      </a>
    );
  return (
    <section aria-labelledby="shame-title" className="shame-tile">
      <h2 id="shame-title" className="sr-only">
        Wall of Shame: the {latest.year} wooden spoon
      </h2>
      <TearReveal
        variant="sticker"
        className="flex-1"
        cover={
          <span className="shame-sticker">
            <Skull className="size-7" aria-hidden="true" />
            <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.14em]">
              Wooden spoon
            </span>
            <span className="block font-heading text-3xl font-black leading-none">
              {latest.year}
            </span>
            <span className="mt-3 block text-[11px] text-muted-foreground">
              Peel to reveal ←
            </span>
          </span>
        }
      >
        <div className="flex h-full flex-col">
          {latest.image && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-md">
              <Image
                src={latest.image}
                alt={`${latest.managerName || latest.teamName} - ${latest.year} forfeit`}
                fill
                unoptimized
                className="object-cover object-[50%_65%]"
              />
            </div>
          )}
          <p className="mt-2 font-bold leading-tight">{latest.managerName}</p>
          <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">
            {latest.forfeit}
          </p>
          <a
            href="/wall-of-shame"
            className="clubhouse-text-link mt-auto min-h-11 text-xs"
          >
            See the evidence <ArrowRight className="size-3.5" />
          </a>
        </div>
      </TearReveal>
    </section>
  );
}
