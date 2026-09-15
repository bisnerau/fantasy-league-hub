'use client';

import type { PredictionMatchup } from '@/lib/data/predictions';
import type { MatchupStory } from '@/lib/predictions/stories';
import { formatLockTime, settlementTimeForLock } from '@/lib/predictions/rules';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

function Breakdown({
  story,
  kind,
  receipt,
}: {
  story: MatchupStory;
  kind: 'preview' | 'review';
  receipt?: string;
}) {
  return (
    <div className="pt-2">
      <h3 className="text-base font-semibold tracking-tight">
        {story.headline}
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {story.summary}
      </p>
      <Accordion>
        <AccordionItem value={kind} className="border-0">
          <AccordionTrigger className="min-h-11 py-2 text-sm text-primary hover:no-underline">
            Read the full {kind}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pb-2">
              {story.sections.map((section) => (
                <section key={section.title}>
                  <h4 className="text-sm font-semibold">{section.title}</h4>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {section.text}
                  </p>
                </section>
              ))}
              {receipt && (
                <section>
                  <h4 className="text-sm font-semibold">The league’s call</h4>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {receipt}
                  </p>
                </section>
              )}
              <p className="border-t border-border pt-3 text-xs leading-5 text-muted-foreground">
                {story.editorial
                  ? 'MAC 12 newsletter · Sleeper results, league history and a little perspective.'
                  : kind === 'preview'
                    ? 'Based on the recorded Thursday lineup and Sleeper PPR estimates, which may differ from league-scored projections. Lineups can change afterwards.'
                    : 'Based on settled team results and Sleeper’s recorded player points. Individual breakdowns can reflect later stat corrections; saved final team scores remain the grading record.'}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function MatchupEditorial({
  matchup,
  lockAt,
  finalized,
  receipt,
  locked,
}: {
  matchup: PredictionMatchup;
  lockAt: string;
  finalized: boolean;
  receipt?: string;
  locked: boolean;
}) {
  return (
    <div className="border-t border-border px-3.5 py-3 sm:px-4">
      <Tabs
        key={finalized ? 'final' : 'pregame'}
        defaultValue={finalized ? 'review' : 'preview'}
      >
        <TabsList
          aria-label={`Preview and review: ${matchup.home.ownerName} versus ${matchup.away.ownerName}`}
          className="h-11 w-full max-w-xs"
        >
          <TabsTrigger value="preview" className="min-h-10">
            Preview
          </TabsTrigger>
          <TabsTrigger value="review" className="min-h-10">
            Review
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          {matchup.preview ? (
            <>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Published {formatLockTime(matchup.preview.publishedAt)} ·
                Original call saved
              </p>
              <Breakdown story={matchup.preview} kind="preview" />
            </>
          ) : (
            <p className="py-2 text-sm leading-6 text-muted-foreground">
              {locked || finalized
                ? 'No pregame newsletter was published for this matchup.'
                : 'The Thursday newsletter has not been published yet. Each edition includes our winner call, saved here for the review.'}
            </p>
          )}
        </TabsContent>
        <TabsContent value="review">
          {finalized && matchup.review ? (
            <Breakdown story={matchup.review} kind="review" receipt={receipt} />
          ) : (
            <p className="py-2 text-sm leading-6 text-muted-foreground">
              {finalized
                ? 'The result is final. The Tuesday newsletter review has not been published yet.'
                : `The Tuesday newsletter will revisit this game once results settle, from ${formatLockTime(settlementTimeForLock(lockAt).toISOString())}.`}
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
