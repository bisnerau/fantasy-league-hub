import { halftimeHonours } from './publication';

const order = ['pickup', 'schedule', 'escape', 'miss', 'team'];
const shortlists: Record<string, { name: string; evidence: string }[]> = {
  pickup: [
    { name: 'Jared Goff · Keenan', evidence: '86.80 starter points · $5' },
    { name: 'Tyler Shough · Burns', evidence: '80.52 starter points · $15' },
    {
      name: 'Spencer Shrader · Murray',
      evidence: '63.00 starter points · free',
    },
  ],
  schedule: [
    { name: 'Aidan Murphy', evidence: '7th in table · 3rd all-play' },
    { name: 'Alan Horgan', evidence: '4th in table · 2nd all-play' },
  ],
  escape: [
    { name: 'David Sharpe', evidence: '6th in table · 12th all-play' },
    { name: 'Jack Ringrose', evidence: '5–2 record · 39–38 all-play' },
  ],
  miss: [
    { name: 'The Burns forecast', evidence: 'AI: 2nd · halfway: 10th' },
    { name: 'The Keenan forecast', evidence: 'AI: 12th · halfway: 5th' },
    { name: 'The Shane forecast', evidence: 'AI: 6th · halfway: 1st' },
  ],
  team: [
    { name: 'Shane Marmion', evidence: '973.88 points · 59–18 all-play' },
    { name: 'Alan Horgan', evidence: '936.68 points · 57–20 all-play' },
    { name: 'Karl Moroney', evidence: '5–2 record · second in table' },
  ],
};

export const halftimeAwards = order.map((id) => {
  const award = halftimeHonours.find((a) => a.id === id)!;
  return { ...award, shortlist: shortlists[id] };
});
