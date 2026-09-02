# Optional AI commentary layer

This build contains no AI calls. Analysis functions return structured facts first, so commentary can be added later without changing the data pipeline.

To enable it later:

1. Add `ANTHROPIC_API_KEY` to the local and hosted environment.
2. Create a server-only adapter in this directory.
3. Pass only the structured output from `/lib/analysis` into that adapter.
4. Replace the `AI_HOOK` comments in power rankings, matchups, rivalries, and awards with optional commentary components.

Keep every page useful when the commentary service is disabled or unavailable.
