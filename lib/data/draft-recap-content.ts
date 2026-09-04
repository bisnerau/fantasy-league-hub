export type DraftRecapPick = {
  round: number;
  overall: number;
  player: string;
  position: string;
  nflTeam: string;
};

export type DraftRecapSpotlight = {
  player: string;
  detail: string;
};

export type DraftRecapEntry = {
  rosterId: number;
  managerName: string;
  teamName: string;
  avatar: string | null;
  draftSlot: number;
  grade: string;
  gradeScore: number;
  headline: string;
  summary: string;
  bestPick: DraftRecapSpotlight;
  biggestConcern: DraftRecapSpotlight;
  seasonOutlook: string;
  leinsterComparison: {
    player: string;
    detail: string;
  };
  picks: DraftRecapPick[];
};

export type DraftRecapContent = {
  published: boolean;
  season: number;
  generatedAt: string | null;
  overview: string;
  methodology: string;
  sources: Array<{
    label: string;
    url: string;
    category: 'ADP' | 'Expert rankings' | 'NFL news' | 'Leinster';
  }>;
  entries: DraftRecapEntry[];
};

// This file is deliberately ready but unpublished. Once the draft is complete,
// the prepared analysis is written here and `published` is switched to true.
export const draftRecapContent: DraftRecapContent = {
  published: false,
  season: 2026,
  generatedAt: null,
  overview: '',
  methodology: '',
  sources: [],
  entries: [],
};
