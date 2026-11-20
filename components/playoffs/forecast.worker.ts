import { simulate } from '@/lib/playoffs/model';
import { getInsights } from '@/lib/playoffs/insights';
import type { ForecastInput, Scenario } from '@/lib/playoffs/types';
self.onmessage = (
  event: MessageEvent<{ input: ForecastInput; scenario: Scenario }>,
) => {
  try {
    const { input, scenario } = event.data;
    const result = simulate(input, scenario, undefined, undefined, (progress) =>
      self.postMessage({ progress }),
    );
    self.postMessage({
      result,
      insights: getInsights(input, result, scenario),
    });
  } catch (error) {
    self.postMessage({
      error:
        error instanceof Error ? error.message : 'Scenario calculation failed',
    });
  }
};
