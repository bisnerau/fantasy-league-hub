// Site sections in navigation order. The shell adds icons; the page
// transition uses the order to decide which way the yard line sweeps.
export interface NavigationItem {
  label: string;
  shortLabel?: string;
  href: string;
}

export const navigation: readonly NavigationItem[] = [
  { label: 'Clubhouse', shortLabel: 'Home', href: '/' },
  { label: 'Weekly picks', shortLabel: 'Picks', href: '/matchups' },
  { label: 'My Season', shortLabel: 'My Season', href: '/my-season' },
  { label: 'Record book', shortLabel: 'Records', href: '/records' },
  { label: 'League standings', href: '/standings' },
  { label: 'Power rankings', href: '/power-rankings' },
  { label: 'Managers', href: '/managers' },
  { label: 'Awards & Receipts', href: '/season-hub' },
  { label: 'Wall of shame', href: '/wall-of-shame' },
  { label: 'Draft Report & Season Preview', href: '/draft-recap' },
];

export const navigationOrder: readonly string[] = navigation.map(
  (item) => item.href,
);
