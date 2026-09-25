export type TransitionDirection = 'forward' | 'back';

// Which way the yard line sweeps between two pages: forward when moving
// further along the navigation order, back when returning towards Home, so
// the browser's Back button reverses the wipe naturally. Nested pages count
// as their section (longest matching prefix); unknown pages sweep forward.
//
// It is inlined into the head script with String(), so it must stay
// self-contained: no imports, closures or helpers.
export function transitionDirection(
  fromPath: string | null | undefined,
  toPath: string,
  order: readonly string[],
): TransitionDirection {
  function sectionIndex(path: string) {
    let best = -1;
    let bestLength = -1;
    for (let i = 0; i < order.length; i++) {
      const href = order[i];
      const matches =
        path === href ||
        (href !== '/' &&
          path.startsWith(href.endsWith('/') ? href : href + '/'));
      if (matches && href.length > bestLength) {
        best = i;
        bestLength = href.length;
      }
    }
    return best;
  }
  if (!fromPath) return 'forward';
  const from = sectionIndex(fromPath);
  const to = sectionIndex(toPath);
  if (from < 0 || to < 0 || from === to) return 'forward';
  return to < from ? 'back' : 'forward';
}
