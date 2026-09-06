'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export function SeasonPreviewTabs({
  report,
  predictions,
}: {
  report: ReactNode;
  predictions: ReactNode;
}) {
  const reportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = reportRef.current;
    const openReport = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest('a[href^="#roster-"]');
      if (!link) return;
      const article = document.getElementById(
        link.getAttribute('href')!.slice(1),
      );
      const detail = article?.querySelector<HTMLDetailsElement>(
        'details[data-report-card]',
      );
      if (detail) detail.open = true;
    };
    container?.addEventListener('click', openReport);
    return () => container?.removeEventListener('click', openReport);
  }, []);
  function expandAll(open: boolean) {
    reportRef.current
      ?.querySelectorAll<HTMLDetailsElement>('details[data-report-card]')
      .forEach((detail) => {
        detail.open = open;
      });
  }
  return (
    <Tabs defaultValue="report" className="gap-5">
      <TabsList
        className="h-11 w-full sm:w-fit"
        aria-label="Season preview sections"
      >
        <TabsTrigger value="report" className="px-4">
          Draft Report
        </TabsTrigger>
        <TabsTrigger value="predictions" className="px-4">
          Manager Predictions
        </TabsTrigger>
      </TabsList>
      <TabsContent value="report" keepMounted>
        <div className="mb-4 flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => expandAll(true)}>
            Expand all reports
          </Button>
          <Button size="sm" variant="ghost" onClick={() => expandAll(false)}>
            Collapse all
          </Button>
        </div>
        <div ref={reportRef}>{report}</div>
      </TabsContent>
      <TabsContent value="predictions" keepMounted>
        {predictions}
      </TabsContent>
    </Tabs>
  );
}
