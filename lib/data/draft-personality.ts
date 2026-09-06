import { draftRecapContent, type DraftRecapPick } from './draft-recap-content';
import { draftAdpByPick } from './draft-adp';

export function analyseDraftPicks(
  picks: DraftRecapPick[],
  benchmark: Record<number, number | null>,
) {
  const evidence = picks.map((pick) => {
    const rank = benchmark[pick.overall];
    const adpOrder =
      typeof rank === 'number' && Number.isFinite(rank) && rank > 0
        ? rank
        : null;
    return {
      ...pick,
      adpOrder,
      gap: adpOrder === null ? null : adpOrder - pick.overall,
    };
  });
  const eligible = evidence.filter(
    (p) => p.position !== 'K' && p.position !== 'DEF' && p.gap !== null,
  );
  const early = eligible.filter((p) => p.round <= 7);
  const meanDistance = early.length
    ? early.reduce((sum, p) => sum + Math.abs(p.gap!), 0) / early.length
    : null;
  return {
    evidence,
    earlyCount: early.length,
    meanDistance,
    close: early.filter((p) => Math.abs(p.gap!) <= 6).length,
    reaches: early.filter((p) => p.gap! > 6).length,
    falls: early.filter((p) => p.gap! < -6).length,
    biggestReach:
      eligible
        .filter((p) => p.gap! > 0)
        .sort((a, b) => b.gap! - a.gap! || a.overall - b.overall)[0] ?? null,
    biggestFall:
      eligible
        .filter((p) => p.gap! < 0)
        .sort((a, b) => a.gap! - b.gap! || a.overall - b.overall)[0] ?? null,
  };
}

export const draftPersonalities = draftRecapContent.entries
  .map((entry) => ({
    rosterId: entry.rosterId,
    managerName: entry.managerName,
    ...analyseDraftPicks(entry.picks, draftAdpByPick),
  }))
  .sort(
    (a, b) =>
      (a.meanDistance ?? Infinity) - (b.meanDistance ?? Infinity) ||
      a.rosterId - b.rosterId,
  );

export const personalityCopy: Record<number, { label: string; roast: string }> =
  {
    1: {
      label: 'The Spreadsheet’s Passenger',
      roast:
        'The commissioner followed the first-seven-round market order more closely than anyone else. Six picks within six places: a man who built an entire league just to let the spreadsheet drive. Jadarian Price was the modest early rebellion; Chris Bell was the late declaration of independence. Auto-draft allegations pending, with the commissioner unfortunately also chairing the investigation.',
    },
    4: {
      label: 'The Research Department’s Autopilot',
      roast:
        'All that football knowledge and Tommy’s opening seven picks finish almost level with Burns for obedience to the board. Colston Loveland was the only early pick more than six places ahead of the benchmark. The late Cyrus Allen punt finally gave the scouting department something to put in its annual report. Matthew Stafford falling 64 places provided a much cheaper way to express an opinion.',
    },
    9: {
      label: 'The Premium Autopilot Package',
      roast:
        'Jack stayed within six places on six of his first seven selections; the exception was Josh Allen falling seven places to him. This is the sort of evidence the group chat will staple to the existing auto-draft allegations, although it proves only that he followed the market. Tyrone Tracy was the late reach. Apparently even autopilot occasionally takes the scenic route.',
    },
    11: {
      label: 'The Accidental Bargain Hunter',
      roast:
        'David made no early reaches beyond the six-place band and let Drake Maye and Tyler Warren come to him. For a manager accused of drafting and disappearing, this is suspiciously sensible shopping. Then Travis Hunter arrived 103 places ahead of his benchmark order. The sensible shopping trolley had apparently developed one spectacularly wonky wheel.',
    },
    6: {
      label: 'The Champion’s Cruise Control',
      roast:
        'Six of Alan’s first seven picks sat within six places of the market order. RJ Harvey was the one early insistence that the reigning champion knew something the spreadsheet did not. Nicholas Singleton supplied the much bigger late punt. Expect the newsletter to describe whichever one works as the centrepiece of a carefully coordinated strategy.',
    },
    3: {
      label: 'The Quiet Packers Protest',
      roast:
        'Keenan mostly respected the board, then nudged Christian Watson and MarShawn Lloyd forward by seven and nine places. Hardly a revolution, but enough to insist there was a plan. Kaelon Black was the bigger late departure, while Jared Goff fell 52 places. The 2021 champion appears to be funding his speculative department with savings from the quarterback aisle.',
    },
    7: {
      label: 'The Committee-Approved Draft',
      roast:
        'Six early picks within six places, no early reaches beyond that band, and Sam LaPorta falling nine places: Joe’s core draft could have passed a procurement audit. Zach Charbonnet was his largest reach across the eligible picks, at a restrained 16 places. Even his rebellion came with supporting documentation. The board has approved another motion to discuss escaping fourth place.',
    },
    10: {
      label: 'The Part-Time Maverick',
      roast:
        'Shane moved Chuba Hubbard nine places forward and collected DJ Moore nine places late. A beautifully balanced exchange for someone whose greatest historical imbalance is between football knowledge and checking his phone. Dylan Sampson was his biggest eligible reach at just 13 places. Most of the danger here still appears to be in the management, rather than the shopping list.',
    },
    2: {
      label: 'The Selective Overpayer',
      roast:
        'Niall pushed Jaylen Waddle and Mike Evans up the queue, then saved his bigger late swing for Tre’ Harris. None of his eligible selections fell more than five places below the benchmark, so this was not a draft spent waiting for bargains. The championship-hangover recovery plan seems to involve paying promptly and hoping the receipt contains a playoff berth. Commitment has never been his problem.',
    },
    12: {
      label: 'The Unsupervised Shopper',
      roast:
        'Aidan reached beyond the six-place band for Davante Adams and DK Metcalf, while Quinshon Judkins fell nine places. That is enough individual judgement to complicate the usual allegation that Joe runs the department. Kyle Pitts falling 21 places helped balance the basket. Whether this counts as independent thought or simply shopping without the usual adult present remains open to debate.',
    },
    5: {
      label: 'The Conviction Merchant',
      roast:
        'Karl moved Terry McLaurin nine places and Brian Thomas 14 places ahead of their benchmark slots, then got Jayden Daniels 12 places late. This was a manager choosing where to disagree, rather than blindly paying extra for everyone. Ray Davis supplied the much larger late punt. If it works, credit the vision; if it fails, expect a detailed statement about the schedule.',
    },
    8: {
      label: 'The Board’s Unofficial Editor',
      roast:
        'Hugo had the largest average departure in the first seven rounds, with Ladd McConkey, Caleb Williams and especially Makai Lemon taken early. Lemon went 38 places before his benchmark order: less a queue jump than an entirely separate entrance. Malik Washington was an even bigger late swing, while Patrick Mahomes fell 62 places. Nobody can call this market obedience; whether it was inspired editing will require actual football.',
    },
  };
