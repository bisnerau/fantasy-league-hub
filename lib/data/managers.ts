export type Manager = {
  franchiseId: string;
  name: string;
  joined: number;
  bio?: string;
};

export const managers: Manager[] = [
  {
    franchiseId: 'burns',
    name: 'Emmet Burns',
    joined: 2020,
    bio: 'The Commissioner. The man who built MAC 12 from the ground up — and who conveniently happens to sit atop it. Six seasons, six playoff appearances — the only manager in league history with a perfect postseason streak. He has never finished below sixth. He has never visited the Wall of Shame. He has never changed his team name. Consistency is the brand, and the brand is unshakeable.\n\nOf course, the league will tell you the real secret to his success lives on the trade market. A relentless waiver wire grinder with a nose for undervalued assets and an even sharper instinct for selling high, Burns treats every trade negotiation like a hostage situation — and somehow always walks away with the briefcase. "Dodgy trader" is the reputation. The results speak for themselves.\n\nFour podiums in six seasons — bronze in 2020, bronze in 2022, gold in 2023 with a dominant 11-3 campaign, and bronze again in 2025. The commissioner had always been close, and the 2023 title finally gave him the trophy to match the title.\n\nJudge, jury, and champion. Welcome to his league.',
  },
  {
    franchiseId: 'lavender',
    name: 'Jack Ringrose',
    joined: 2020,
    bio: "The Inaugural Champion. The Finest Wagyu. The man with the league's most disputed trophy. Jack Ringrose won the very first MAC 12 title in 2020 — an 11-3 masterclass that would be legendary if it weren't for two inconvenient truths: there were only eight teams in the league, and half of them are still convinced he auto-drafted.\n\nIt's the Mickey Mouse trophy of MAC 12, and the group chat will never let him forget it. But a ring is a ring, and nobody can take it off his finger.\n\nWhat followed was a long, steady decline — fifth, fifth, ninth — before 2024 brought the ultimate indignity: the Wall of Shame and a calendar photo shoot recreating iconic Sports Illustrated covers, with every pose chosen by the league. To his credit, he took it like a champion.\n\nThen came the plot twist nobody expected. A 9-5 campaign in 2025 put Ringrose back in the playoffs and into the semi-finals. The Finest Wagyu went from leftover rump to prime cut again — or at least back on the shelf. Whether it's a genuine revival or a dead-cat bounce remains to be seen, but the OG with the disputed ring just proved he's not finished yet.",
  },
  {
    franchiseId: 'purple',
    name: 'Andrew Keenan',
    joined: 2020,
    bio: "If Burns is the commissioner, Keenan is the co-pilot nobody asked for. The two have been shadow-boxing at the top of the all-time table since day one, and Keenan actually got to the mountaintop first — runner-up in the 2020 inaugural before claiming the 2021 crown with another 11-3 blitz.\n\nBack-to-back championship finals in the league's first two years. That's a dynasty-calibre start that should have launched a decade of dominance. Instead, it launched a slow, respectable plateau. Third in 2023 kept the podium count ticking, but back-to-back 6-8 seasons and ninth-place finishes in 2024 and 2025 have opened a gap between Keenan and the commissioner that didn't exist before.\n\nFrom New York Giant Eggs to Cooper Kupp Mah Balls, the rebrand stuck even as the results dipped. Four playoff appearances in six years, three podiums, and a ring — the CV still reads like a top-tier franchise, but the recent chapters are gathering dust.\n\nThe question hanging over Cooper Kupp Mah Balls is simple: was 2021 the peak, or is there another run left? The record says he belongs at the top. The trend says he's sliding. MAC 12 is watching.",
  },
  {
    franchiseId: 'salmon',
    name: 'Shane Marmion',
    joined: 2020,
    bio: "Shane Marmion is a man who peaked in the middle and has been coasting off the memory ever since. The 2022 championship — a 10-4 steamroll to the title — remains the high-water mark. Everything else has been a masterclass in inconsistency.\n\nThe 2024 incident tells you everything. Out of the playoff race and checked out, Marmion forgot to set his lineup — leaving a player on the bench that cost him a result and handed Jack Ringrose the league's worst finish and the Wall of Shame calendar shoot. Had he bothered to make the sub, Karl Moroney would have taken the fall instead. Karl sent his thanks. Jack sent something far less polite. It's the kind of chaos only a manager who knows enough about football to be dangerous — but not enough to care when his season's already dead — could produce.\n\nTwo podiums. Two playoff appearances in six seasons. A championship in the middle and three consecutive finishes of 8th, 12th, and 10th to close it out. When the 'who's throwing Diggs' owner is locked in, he's a genuine threat. When he's not, he's a ghost who might accidentally destroy your season on the way out.\n\nStreaky, unpredictable, and hovering right around .500. The most Shane Marmion stat imaginable.",
  },
  {
    franchiseId: 'red',
    name: "Tommy O'Brien",
    joined: 2020,
    bio: "Nobody in MAC 12 knows more about football and has less to show for it. Tommy O'Brien is the league's great contradiction — the most knowledgeable manager in the room and a two-time resident of the Wall of Shame. He can break down a player's snap count, target share, and red zone usage. He just can't seem to pick one who actually scores points.\n\nThe problem is potential. O'Brien doesn't draft players — he drafts futures. Every roster is a bet that this is the year the breakout happens, the upside materialises, the talent matches the opportunity. Sometimes it works — he was the 2023 runner-up, one game away from the ultimate vindication. Most of the time it doesn't, and the result is a record that sits firmly below .500.\n\nThe lows have been legendary. Back-to-back last-place finishes in 2021 and 2022 made him the only manager to earn consecutive Wall of Shame appearances. First came a five-minute stand-up comedy set at an open mic night. Then Comic Con, dressed as Shark Boy from Shark Boy and Lava Girl, interviewing strangers. He took both like a champion — ironic, since that's the one title he's never earned. And 2025 added insult to injury: a respectable 7-7 record that somehow still ended in a 12th-place finish after the losers bracket chewed him up.\n\nFour team names across six seasons. An overthinker who rebrands as often as he rebuilds. Always 'due a big season.' Still waiting.",
  },
  {
    franchiseId: 'mint',
    name: 'Niall Murray',
    joined: 2020,
    bio: "Niall Murray is proof that in MAC 12, the only thing more dangerous than missing the playoffs is winning the whole thing. The 2024 champion — an 8-6 regular season that turned into a playoff run nobody saw coming — walked into 2025 as the reigning king and walked out with a 4-10 record, the worst in the league, and a one-way ticket to the Wall of Shame.\n\nThe championship hangover hit like a freight train. From lifting the trophy to the 50 Challenge — miles run, pints drank, and donuts eaten totalling fifty, all within 24 hours. It's the kind of punishment that only feels fair when it happens to the defending champion.\n\nMurray is a competitor through and through. Heavily invested, always engaged, always dangerous when the pieces fall into place. Runner-up in 2021. Champion in 2024. Four playoff appearances in six seasons. The talent and the effort have never been in question. But the gap between his best and worst is wider than anyone else's in the league — from the mountaintop to the basement in twelve months flat.\n\nThree different team names across six seasons, each one a reflection of whatever obsession is driving the roster that year. The Wet Bandits. You scratched my CeeDee. Mahomes-lander and The Boys. The name changes. The competitive fire doesn't.",
  },
  {
    franchiseId: 'magenta',
    name: 'Alan Horgan',
    joined: 2020,
    bio: "For four years, Alan Horgan was the punchline. The league's resident clown, its lovable punching bag, the man who took a bus from Dublin to Belfast with two bottles of wine and did the Titanic tour twice in an Irish rugby jersey because he finished last in the league's very first season. His all-time record still sits below .500. He has lost more games than anyone in MAC 12 history. And he is the reigning champion.\n\nNobody saw it coming. Nobody still quite believes it. Horgan's trajectory reads like a typo — seventh, ninth, eighth, twelfth, then suddenly runner-up in 2024 and champion in 2025 with a 9-5 campaign. Same Alan. Same approach. Same Tampa B-AH name he's never changed in six years. He just bet on CMC, got lucky that he stayed healthy, and rode the wave all the way to the trophy.\n\nBeyond the results, Horgan is the heartbeat of MAC 12. The weekly newsletter writer. The man who shows up every single week — win or lose — to give the league its content, its trades, its banter. Six seasons of being everyone's easy target, and he never stopped engaging.\n\nThe worst all-time record in the league. The best story in the league. Tampa B-AH forever.",
  },
  {
    franchiseId: 'navy',
    name: 'Joe Ennis',
    joined: 2020,
    bio: "Joe Ennis is the most fourth-place man in fantasy football. Three consecutive fourth-place finishes from 2022 to 2024 — always in the playoffs, never on the podium, never even close to the trophy. It's a streak so specific, so aggressively mediocre at the top end, that it almost feels intentional.\n\nA strategist by nature, Ennis thinks carefully about every move. The draft picks are calculated. The trades are considered. The waiver claims are deliberate. And somehow, despite all that careful planning, the ceiling has been a first-round playoff exit three years running. Fourth is fourth, and fourth is where Joe lives.\n\nThe early years weren't any better — eighth and tenth in the league's first two seasons, languishing in the bottom half while the OGs around him collected rings. The middle years brought respectability. The 2025 collapse — 6-8 and eleventh place — brought reality crashing back down.\n\nZero championships. Zero podiums. Zero Wall of Shame appearances. Joe Ennis has never been the best and never been the worst. He is the mathematical centre of MAC 12, a .512 win rate wrapped in four different team names and a résumé that screams 'solid but not spectacular.'\n\nFrom Alistair Donaldson's XV to D'onta FourMore!, the names keep changing. The glass ceiling doesn't.",
  },
  {
    franchiseId: 'yellow',
    name: 'Aidan Murphy',
    joined: 2021,
    bio: "Aidan Murphy is a statistical miracle. The second-best win rate in MAC 12 history. A perfect five-for-five playoff record. Two podium finishes. And absolutely no idea how he keeps doing it.\n\nMurphy is the league's ultimate set-and-forget manager. Draft day is his Super Bowl — he picks his squad, sets his lineup, and largely leaves it alone. No waiver wire hustle. No trade market manoeuvring. No mid-season pivots. Just vibes, autopilot, and a record that makes the managers who actually try look foolish.\n\nThe trouble starts in the postseason. Five playoff appearances, zero deep runs to show for it. Runner-up in 2022. Third in 2024. But most years, he's a first-round casualty — a regular season machine that stalls the moment the stakes go up. The regular season rewards consistency. The playoffs reward adaptation. Murphy doesn't adapt. Murphy trusts the draft.\n\nThe team name hasn't changed in five years. The approach hasn't changed either. BurrowMeDickinYoAss is a franchise built on inertia and inexplicable good fortune — a .586 win rate powered by draft-day luck and a complete refusal to overthink anything.\n\nSomeday the luck will run out and the playoff drought will become a regular season one. Until then, MAC 12's luckiest manager keeps falling upward.",
  },
  {
    franchiseId: 'cyan',
    name: 'David Sharpe',
    joined: 2021,
    bio: "If Aidan Murphy is the set-and-forget manager who somehow keeps winning, David Sharpe is the set-and-forget manager who doesn't. Same philosophy — draft, deploy, and disappear. Same limited knowledge of the player pool. Wildly different results.\n\nSharpe joined MAC 12 in 2021 and has spent the majority of his tenure in the bottom half of the standings. One playoff appearance in five seasons — a 2023 campaign that saw him sneak into fourth before normal service resumed. The rest has been a steady diet of 5-9 seasons and late-table finishes, the kind of record that would land most managers on the Wall of Shame if they ever had the misfortune of finishing dead last.\n\nThe remarkable thing about Burkeys Teur is the consistency of the mediocrity. Never quite bad enough to earn a forfeit. Never close to good enough to contend. Just perpetually hovering in the 7th-to-11th range, doing enough to avoid embarrassment but not enough to threaten anyone.\n\nNo trades. No waiver wire magic. No deep knowledge of who's breaking out or who's breaking down. Just a draft-day roster and a prayer. The name hasn't changed in five years, and neither has the approach.\n\nDavid Sharpe: the man who proves that in fantasy football, you actually do need to know the players.",
  },
  {
    franchiseId: 'lime',
    name: 'Karl Moroney',
    joined: 2023,
    bio: "Karl Moroney has an excuse for everything and a trophy for nothing. The self-proclaimed king of bad scheduling, Moroney has spent three seasons explaining to anyone who'll listen why the results don't reflect the talent. The schedule was unfair. The matchups were brutal. The points-against were historic. If excuses were worth fantasy points, Pronouns Who Dey would be a dynasty.\n\nTo be fair, the 2025 campaign proved there might be something behind the noise. A 10-4 regular season — the best record in the entire league — and a run to the championship final suggest that Moroney actually knows what he's doing. He trades. He works the wire. He knows the players. He just spent his first two years going 5-9 twice while insisting the universe was conspiring against him.\n\nThe 2024 near-miss deserves a mention. Moroney was heading for the Wall of Shame until Shane Marmion forgot to set his lineup and inadvertently saved Karl's skin, sending Jack Ringrose to the punishment instead. The luckiest escape in league history, and Moroney has Shane to thank for his clean record.\n\nThree seasons in. Runner-up in 2025. Now he says he's 'due a win.' In fairness, the numbers are starting to back it up. But in MAC 12, Karl Moroney will always be the king of excuses first and a contender second.",
  },
  {
    franchiseId: 'bright-yellow',
    name: 'Hugo Walsh',
    joined: 2023,
    bio: "Hugo Walsh's MAC 12 career began on Grafton Street with a guitar and whatever was left of his dignity. A 2-12 debut season — the worst record in league history — earned him the Wall of Shame in his very first year, and the punishment was public: busking for strangers on Dublin's most famous shopping street. Welcome to the league.\n\nWhat happened next is the kind of trajectory that makes you wonder if the 2-12 was the outlier, not the norm. A 7-7 campaign in 2024 put Walsh into the top half of the table and within touching distance of the playoffs. An 8-6 season in 2025 finished fifth — back-to-back respectable finishes from a manager who looked like a guaranteed annual forfeit after year one.\n\nFrom McGintys Dementors to Hawk Tuas Binatsos, the rebrand matched the rebuild. The expansion-year punching bag is starting to look like a legitimate mid-table competitor. Two playoff appearances in three seasons — a record that would satisfy most managers, let alone one who went 2-12 in his debut.\n\nThe all-time record still carries the scars of that first season, but the direction of travel is clear. Hugo Walsh is no longer the league's easy target. He might not be a title contender yet, but he's a long way from Grafton Street.",
  },
];

export function getManager(franchiseId: string): Manager | undefined {
  return managers.find((m) => m.franchiseId === franchiseId);
}
