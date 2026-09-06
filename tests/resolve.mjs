import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Run the application's TypeScript directly, keeping tests on the same code path.
const root = new URL('../', import.meta.url);
export async function resolve(specifier, context, nextResolve) {
  const local = specifier.startsWith('@/')
    ? new URL(specifier.slice(2), root)
    : specifier.startsWith('.') &&
        context.parentURL?.startsWith(new URL('lib/', root).href)
      ? new URL(specifier, context.parentURL)
      : null;
  if (local && existsSync(fileURLToPath(new URL(`${local.href}.ts`))))
    return nextResolve(`${local.href}.ts`, context);
  return nextResolve(specifier, context);
}
