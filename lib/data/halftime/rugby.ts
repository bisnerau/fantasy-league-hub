import { draftRecapContent } from '../draft-recap-content';

type IrelandComparison = {
  player: string;
  era: string;
  status: 'Still fits' | 'Era revised' | 'New reference';
  verdict: string;
  roast: string;
  evidence: [string, string];
  source?: string;
};

export const irelandComparisons: Record<number, IrelandComparison> = {
  10: {
    player: 'Brian O’Driscoll',
    era: '2009',
    status: 'New reference',
    verdict:
      'The Gibson-Park call recognised the scoring potential but questioned the preparation. Shane has answered both. BOD’s 2009 combination of individual excellence and team leadership fits this first half; the championship still has to be won.',
    roast:
      'We questioned whether he would charge his phone. He has spent seven weeks charging everyone else rent at the top.',
    evidence: ['6–1 · first in the table', '973.88 points · league high'],
    source:
      'https://www.sixnationsrugby.com/en/m6n/news/player-of-the-championship-classic-winners-brian-odriscoll-2009',
  },
  5: {
    player: 'Caelan Doris',
    era: 'The complete back-rower',
    status: 'Still fits',
    verdict:
      'The balanced contender comparison holds up. Karl is second at 5–2, with a 171.46-point ceiling. The caveat is the recent slide to 106.70 and 88.72. We got the quality broadly right; automatic dominance was never included.',
    roast:
      'Still captain material. The last two weeks have made the captain’s address considerably longer.',
    evidence: ['5–2 · second in the table', '171.46 · Week 5 ceiling'],
  },
  9: {
    player: 'Rob Kearney',
    era: '2018',
    status: 'New reference',
    verdict:
      'The Nacewa comparison’s emphasis on experience and dependable returns survives. Kearney’s established presence in Ireland’s 2018 Grand Slam side supplies the green-jersey reference. Jack has six weekly scores above 113 and three consecutive wins; 39–38 all-play reminds us the schedule has helped too.',
    roast:
      'Safely under the high ball. Equally comfortable underneath everyone’s radar.',
    evidence: ['5–2 · third in the table', 'Six of seven scores above 113'],
    source: 'https://alumni.ucd.ie/awards/awardee/rob-kearney/',
  },
  6: {
    player: 'Dan Sheehan',
    era: 'The attacking hooker',
    status: 'Still fits',
    verdict:
      'One of the better original calls: attacking production that makes the supposedly functional positions exciting. Alan is second in points and all-play, with every weekly score above 110. Fourth matches the AI forecast, but understates how well he has performed.',
    roast:
      'We promised attacking returns. Alan delivered 936.68 points and would now like someone to explain fourth place.',
    evidence: ['936.68 points · second', '57–20 all-play · second'],
  },
  3: {
    player: 'Andrew Trimble',
    era: '2014',
    status: 'New reference',
    verdict:
      'The James Ryan comparison concentrated on the engine room; the AI then placed Keenan last. Fifth at halfway makes that forecast look poor. Trimble’s emergence as a central figure in Ireland’s 2014 title campaign, after limited involvement the previous year, captures the response to low expectations. Three straight defeats stop this becoming an uninterrupted victory lap.',
    roast:
      'Predicted twelfth. Opened with four wins. Has spent the next three weeks generously allowing the AI to recover its composure.',
    evidence: [
      'AI pick: 12th → halfway: 5th',
      'Four opening wins · three losses since',
    ],
    source:
      'https://www.irishrugby.ie/2014/03/18/trimble-hard-work-has-paid-off/',
  },
  11: {
    player: 'Paddy Wallace',
    era: 'Cardiff, the final moments · 2009',
    status: 'New reference',
    verdict:
      'The tidy, balanced Ringrose roster we described has produced the fewest points and weakest all-play record—yet Sharpe is 4–3. This is a deliberately specific Wallace reference: the enormous relief when the late penalty fell short and the result survived. It is about escaping with the outcome, not a verdict on Wallace’s career.',
    roast:
      'The kick fell short in Cardiff. His points have been falling short since September. The result keeps surviving anyway.',
    evidence: ['4–3 · sixth in the table', '693.16 points · last'],
    source:
      'https://www.rte.ie/sport/six-nations/2013/0131/365430-flashback-wales-15-17-ireland-2009/',
  },
  12: {
    player: 'Keith Wood',
    era: 'The difficult Ireland years · 1990s',
    status: 'New reference',
    verdict:
      'The Van der Flier work-rate comparison was fair, but it missed the gap between performance and reward. Murphy is seventh despite ranking third in all-play. After the opening 57, every score has exceeded 114. Wood producing outstanding individual performances while Ireland struggled for results is the stronger reference now.',
    roast:
      'Doing enough work for a contender. Receiving the league position of a man who forgot his password.',
    evidence: ['47–30 all-play · third', '3–4 · seventh in the table'],
    source:
      'https://www.sixnationsrugby.com/en/m6n/news/greatest-xv-profile-keith-wood',
  },
  7: {
    player: 'Ronan O’Gara',
    era: 'Reclaiming the jersey · 2011',
    status: 'New reference',
    verdict:
      'We predicted dependable Hugo Keenan returns. The 71.62-point Week 3 made that difficult to defend. Joe’s last-three-week average now leads the league, so the story has become a recovery of form. O’Gara earning his way back into Ireland’s starting side during the 2011 World Cup fits that chapter.',
    roast:
      'The comeback is making excellent progress. Somebody should tell the league table.',
    evidence: ['129.43 · last-three-week average', '3–4 · eighth in the table'],
    source:
      'https://www.irishtimes.com/sport/rugby/international/rwc-15-ronan-o-gara-and-his-world-cup-demons-1.2345628',
  },
  2: {
    player: 'Jamie Heaslip',
    era: 'The captaincy campaign · 2013',
    status: 'New reference',
    verdict:
      'The Conan call expected a sturdy platform. Niall opened with 169 points but reached halfway ninth, scoring 87.98 in Week 7. Heaslip’s difficult 2013 Ireland campaign supplies the analogy: established quality facing an uncomfortable review of results. This describes the campaign, rather than blaming one player for Ireland’s fifth-place finish.',
    roast:
      'Week 1 was the launch event. We are still waiting for the full product.',
    evidence: [
      '169.00 in Week 1 → 87.98 in Week 7',
      '3–4 · ninth in the table',
    ],
    source:
      'https://www.sixnationsrugby.com/en/m6n/news/heaslip-drawing-on-memories-of-2013',
  },
  1: {
    player: 'Johnny Sexton',
    era: '2019',
    status: 'Era revised',
    verdict:
      'The organiser comparison stays. The era changes. AI second has become halfway tenth, with a 2–5 record and a 46.16-point defeat in Week 7. Sexton’s own disappointment with Ireland’s 2019 campaign makes this a story about expectations meeting results. The AI deserves a prominent share of the roasting.',
    roast:
      'Still directing traffic. Unfortunately, most of it is passing him in the standings.',
    evidence: ['AI pick: 2nd → halfway: 10th', '2–5 · halfway record'],
    source:
      'https://www.irishtimes.com/sport/rugby/european-cup/johnny-sexton-world-cup-failure-will-be-raw-for-four-years-1.4074818',
  },
  8: {
    player: 'Harry Byrne',
    era: 'Promise meets repeatability',
    status: 'Still fits',
    verdict:
      'The original warning was that promise needed to become repeatable execution. An opening 156.06, five successive defeats and then a 0.82-point escape leave that assessment intact. We retain the developmental comparison without pretending every part of Hugo’s season maps onto a particular Ireland campaign.',
    roast:
      'The potential remains enormous. The winning margin was considerably smaller.',
    evidence: ['156.06 · opening score', '0.82 · Week 7 winning margin'],
  },
  4: {
    player: 'Jacob Stockdale',
    era: '2019',
    status: 'New reference',
    verdict:
      'The original Tommy O’Brien comparison leaned heavily on the name match and attacking ambition. The promise now has evidence: Tommy’s last-three-week scoring average is second-best in the league. Unfortunately, he is still 1–6, and 125.20 in Week 7 earned him a defeat by 0.82. Stockdale’s difficult 2019 chapter fits: flashes such as his two tries against Wales that August, with results that made the excitement exhausting.',
    roast:
      'The highlights package is improving. The league table has refused to watch it.',
    evidence: [
      '128.03 · last-three-week average',
      '1–6 · twelfth in the table',
    ],
    source:
      'https://www.rte.ie/sport/rugby/2019/0831/1073033-ireland-hold-off-wales-fightback-for-vital-win/',
  },
};

export const halftimeRugby = Object.fromEntries(
  draftRecapContent.entries.map((entry) => [
    entry.rosterId,
    {
      original: entry.leinsterComparison,
      ...irelandComparisons[entry.rosterId],
    },
  ]),
);
