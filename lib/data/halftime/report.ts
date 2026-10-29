import snapshot from './snapshot.json';
import activity from './activity.json';
import { halftimeRugby } from './rugby';
import { halftimeAwards, halftimeStageIntro } from './awards';
import { houseBallot } from './house-ballot';
import { sundayKickoffForWeek } from '@/lib/predictions/rules';
import type { HalftimeActivity } from '@/lib/season/halftime-ledger';

// Editorial checkpoint: first seven weeks only. Original forecasts are copied
// verbatim from draft-recap-content; subsequent transactions are kept separate.
const reports: Record<
  number,
  { title: string; verdict: string; review: string; question: string }
> = {
  1: {
    title: 'The commissioner has a case to answer.',
    verdict: 'Apology issued',
    review:
      'Second was a vote of confidence in Burns the manager. Seven weeks later, tenth is a rather direct response. The opening 158.10 showed what this team could do, but the next six weeks never reached that level. Murphy handed him the biggest defeat of Week 7. Chase and Kyren still give him a route back; 33–44 against the whole league says the record is not simply a scheduling accident. The original forecast gave six straight playoff appearances a lot of credit. This season has charged interest.',
    question:
      'Can Burns find enough reliable scoring around his stars to make a seventh straight playoff appearance?',
  },
  2: {
    title: 'The opening night feels a long time ago.',
    verdict: 'Under review',
    review:
      'Murray opened with 169.00. By Week 7 he was scoring 87.98 and losing to Sharpe. The intervening weeks leave him ninth, with 31 all-play wins from 77 comparisons. The preseason fifth-place call relied on his willingness to improve a roster during the season. There is still time for that argument to work, but the first half has produced too little scoring to make a convincing recovery story. Three wins keep him in touch. The next version of this team needs to turn activity into points.',
    question:
      'Can Murray rebuild the weekly floor before the playoff places start disappearing?',
  },
  3: {
    title: 'Twelfth would like a word.',
    verdict: 'Apology issued',
    review:
      'The AI sent Keenan to the bottom before a ball was kicked. He reached halfway fifth. Four opening wins made that call look especially silly, although three straight defeats have tightened the race. His 133.62 against Alan in Week 7 was a useful response to the previous two scores; it just happened to arrive against 138.08. The 34–43 all-play record gives us a reason to keep watching the scoring. It does not give us permission to pretend that predicting him last was clever.',
    question: 'Can the Week 7 scoring rebound become a run of wins?',
  },
  4: {
    title: 'Better football. Same dreadful table.',
    verdict: 'Under review',
    review:
      'Tommy is last at 1–6, but his last three scores average 128.03. There is a much better team here than the one that opened with 74.46 and 72.48. Irving contributed 24.00 on his Week 7 debut, only for Hugo to win by 0.82. That is a particularly unpleasant way to spend a Monday. The improvement matters, and so do six defeats already banked. His 25–52 all-play record keeps the first half in perspective even as the recent points make a comeback easier to imagine.',
    question: 'Has the scoring arrived early enough to rescue the season?',
  },
  5: {
    title: 'Still in the frame. Fewer excuses.',
    verdict: 'Standing by it',
    review:
      'The preseason favourite reaches halfway second at 5–2. That is a perfectly respectable defence of the original call. His 171.46 in Week 5 showed the ceiling, but 106.70 and 88.72 followed it. Jack won their Week 7 meeting comfortably. Karl has the fourth-best all-play record and plenty of points already banked, so the case for contention remains sound. The recent wobble is worth fixing before the rest of the league starts attaching supporting documentation to its own schedule complaints.',
    question:
      'Can Karl recover the scoring that made him the preseason favourite?',
  },
  6: {
    title: 'The champion has more than the record suggests.',
    verdict: 'Standing by it',
    review:
      'Fourth was the AI call. Fourth is where Alan stands. The exact match flatters the prediction a little: his 936.68 points and 57–20 all-play record both rank second. Only Shane has scored more. Alan has cleared 110 in every week and beat Keenan despite conceding 133.62 in Week 7. A 4–3 record leaves work to do, but the scoring gives the reigning champion a strong argument that his first half was better than the table makes it look.',
    question:
      'Will Alan turn the second-best scoring record into a top-two finish?',
  },
  7: {
    title: 'The podium booking needs checking.',
    verdict: 'Under review',
    review:
      'The preseason report promised Joe a place on the podium. At halfway he is eighth. A recent scoring revival offers some defence: the last three weeks average 129.43, even after Shane ended the winning run. Across the full seven weeks, 39–38 all-play is almost perfectly balanced. The excellent finish to this half has not erased the 71.62 in Week 3 or four defeats. Joe has enough production to challenge the teams above him; the original third-place call still needs several favourable weekends.',
    question:
      'Can Joe sustain the recent scoring long enough to climb into the playoff places?',
  },
  8: {
    title: 'A season restarted by 0.82.',
    verdict: 'Standing by it',
    review:
      'Hugo began with 156.06 and a win, then lost five in a row. His 126.02 against Tommy finally stopped the run, with just 0.82 to spare. At 2–5 he sits eleventh, exactly where the preseason forecast placed him. Higgins and Concepcion supplied 50.00 in that escape. The 30–46–1 all-play record tells us there is still work beyond celebrating the result. He has at least earned a week without another instalment of the losing-streak discussion.',
    question: 'Can Hugo make the Week 7 escape the beginning of a recovery?',
  },
  9: {
    title: 'The Wagyu is exceeding the estimate.',
    verdict: 'Apology issued',
    review:
      'Eighth looked cautious in September. Third at halfway makes it look very cautious indeed. Jack has won three straight, with Pollard supplying 36.50 in the latest win over Karl. His seven weekly scores include six above 113, giving him a steadier return than the preseason discussion of age and roster trade-offs suggested. The 39–38 all-play record is more modest than 5–2, so the schedule has helped too. Jack is entitled to enjoy the table while everybody else explains the caveats.',
    question:
      'Can Jack keep converting steady scoring into wins against the contenders?',
  },
  10: {
    title: 'Apparently, the phone is charged.',
    verdict: 'Apology issued',
    review:
      'The AI liked Shane’s draft enough to rank it second, then marked his predicted finish down to sixth because of his engagement history. He has answered with first place, a 6–1 record and the most points in the league. His 59–18 all-play record leads that table too. Every week has cleared 119 points. There is very little room for a clever explanation here: the roster has performed, the manager has kept it moving, and the original forecast put too much weight on the old jokes.',
    question: 'Can Shane maintain this weekly floor through the second half?',
  },
  11: {
    title: 'Four wins. Please ignore the points column.',
    verdict: 'Under review',
    review:
      'Sharpe is sixth at 4–3 despite the fewest points in the league. His 23–53–1 all-play record is also last. That is a sizeable gap between what the table says and what the weekly scores suggest. The Week 7 win over Murray still counts exactly as much as anyone else’s, and 135.34 in Week 5 shows he can post a strong score. Seven games have given him a useful position. The next seven will be easier to navigate if the scoring catches up.',
    question:
      'Can Sharpe improve the points before the schedule stops being so accommodating?',
  },
  12: {
    title: 'The complaint comes with evidence.',
    verdict: 'Under review',
    review:
      'Murphy is seventh with a losing record and the third-best all-play return. After opening with just 57.00, he has cleared 114 in every week. The Week 7 high of 140.98 included 36.00 from waiver additions Cooper and Hockenson. That is a useful reply to a preseason report which questioned whether he would adapt enough. The 47–30 all-play record supports the complaint that 3–4 understates his first half. A playoff place remains within reach, with actual changes already contributing.',
    question:
      'Can Murphy turn a strong six-week run into a place above the cut line?',
  },
};

// Trades completed after the 27 October cutoff, from the public Sleeper
// transactions (checked 29 October). They carry no first-half scoring return.
const afterWhistle = [
  {
    date: '27 Oct',
    sides: [
      { rosterId: 6, received: ['Jaylen Waddle', 'Chase Brown'] },
      { rosterId: 2, received: ['Chris Olave'] },
    ],
  },
  {
    date: '27 Oct',
    sides: [
      { rosterId: 6, received: ['Brock Bowers'] },
      { rosterId: 8, received: ['Javonte Williams', 'Tucker Kraft'] },
    ],
  },
  {
    date: '29 Oct',
    sides: [
      { rosterId: 10, received: ['Dallas Goedert'] },
      { rosterId: 2, received: ['Isaiah Likely'] },
    ],
  },
  {
    date: '29 Oct',
    sides: [
      { rosterId: 7, received: ['Emeka Egbuka', 'Brock Purdy'] },
      { rosterId: 9, received: ['Justin Jefferson'] },
    ],
  },
];

export const halftimeReport = {
  ...snapshot,
  afterWhistle,
  honours: halftimeAwards,
  stageIntro: halftimeStageIntro,
  // The second-half ballot locks at the Week 8 Sunday kickoff.
  secondHalf: {
    lockAt: sundayKickoffForWeek(2026, 8).toISOString(),
    house: houseBallot,
  },
  activity: activity as HalftimeActivity,
  teams: snapshot.teams.map((team) => ({
    ...team,
    ...reports[team.id],
    rugby: halftimeRugby[team.id],
  })),
};
export type HalftimeTeam = (typeof halftimeReport.teams)[number];
export type HalftimeReport = typeof halftimeReport;
