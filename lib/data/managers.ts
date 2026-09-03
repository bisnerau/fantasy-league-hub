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
    bio: 'The Commissioner. The man who built MAC 12 from the ground up and who conveniently happens to sit atop it. Six seasons, six playoff appearances. The only manager in league history with a perfect postseason streak. Never finished below sixth. Never visited the Wall of Shame. Never changed his team name. Consistency is the brand, and the brand is unshakeable.\n\nOne of the most active managers on the waiver wire, Burns is always tinkering, always looking for an edge. The trade offers have earned him a reputation as a dodgy dealer that he will probably never shake, but the results speak louder than the group chat complaints.\n\nFour podiums in six seasons. Bronze in 2020, bronze in 2022, gold in 2023 with a dominant 11-3 run, and bronze again in 2025. The commissioner was always lurking near the top, and the 2023 title finally gave him the hardware to back up the ego.\n\nJudge, jury, and champion. Welcome to his league.',
  },
  {
    franchiseId: 'lavender',
    name: 'Jack Ringrose',
    joined: 2020,
    bio: "The Inaugural Champion. The Finest Wagyu. The man with the league's most disputed trophy. Jack Ringrose won the very first MAC 12 title in 2020 with an 11-3 masterclass that would be legendary if it weren't for two inconvenient truths: there were only eight teams in the league, and half of them are still convinced he auto-drafted.\n\nIt is the Mickey Mouse trophy of MAC 12, and the group chat will never let him forget it. But a ring is a ring, and nobody can take it off his finger.\n\nWhat followed was a long, steady decline. Fifth, fifth, ninth. Then 2024 brought the ultimate indignity: the Wall of Shame, courtesy of Shane Marmion, who could not be bothered to set his lineup and accidentally condemned Jack to last place. Jack got his revenge the only way he knew how. The forfeit was a calendar photo shoot and one of the pages featured Shane. Naked. Uninvited. Unaware. Rivalry settled.\n\nThen came 2025. A 9-5 campaign put Ringrose back in the playoffs and into the semi-finals. The Finest Wagyu went from leftover rump to prime cut again. Whether it is a genuine revival or a dead cat bounce remains to be seen, but the OG with the disputed ring just proved he is not finished yet.",
  },
  {
    franchiseId: 'purple',
    name: 'Andrew Keenan',
    joined: 2020,
    bio: "If Burns is the commissioner, Keenan is the co-pilot nobody asked for. The two have been shadow-boxing at the top of the all-time table since day one, and Keenan got to the mountaintop first. Runner-up in 2020. Champion in 2021. Back-to-back finals in the league's opening two years. Dynasty material, on paper.\n\nThe asterisk? Neither run came against a full-strength league. The 2020 final was an eight-man affair. The 2021 title was ten teams. Keenan has never made a championship game since MAC 12 became a proper twelve-team league. Whether that matters depends on who you ask, but the group chat has opinions.\n\nThird in 2023 kept the podium count respectable, but back-to-back 6-8 seasons and ninth-place finishes in 2024 and 2025 have opened a gap between him and the commissioner that did not exist before. Four playoff appearances in six years, three podiums, and a ring. The CV reads well until you check the dates.\n\nFrom New York Giant Eggs to Cooper Kupp Mah Balls, the rebrand stuck even as the results dipped. Was 2021 the peak, or is there another run left in him? The trend says he is sliding. MAC 12 is watching.",
  },
  {
    franchiseId: 'salmon',
    name: 'Shane Marmion',
    joined: 2020,
    bio: 'Shane Marmion is a man who peaked in the middle and has been living off the memory ever since. The 2022 championship, a 10-4 steamroll to the title, remains the high water mark. Everything before it was forgettable. Everything after it has been worse.\n\nHe knows enough about football to be dangerous and not enough to care when his season is dead. That is when Shane becomes everyone else\'s problem. The 2024 incident is now league folklore. Out of the race and checked out, Marmion forgot to set his lineup, left a player on the bench, and single-handedly decided who got the Wall of Shame. Jack Ringrose took the fall. Karl Moroney dodged a bullet. Shane went back to not checking his phone.\n\nTwo podiums. Two playoff appearances in six seasons. A championship sandwiched between three consecutive finishes of 8th, 12th, and 10th. When the "who\'s throwing Diggs" owner is locked in, he is a genuine threat. When he is not, he is a ghost who might accidentally destroy your season on the way out.\n\nStreaky, unpredictable, and hovering right around .500. The most Shane Marmion stat imaginable.',
  },
  {
    franchiseId: 'red',
    name: "Tommy O'Brien",
    joined: 2020,
    bio: "Nobody in MAC 12 knows more about football and has less to show for it. Tommy O'Brien is the league's great contradiction. The most knowledgeable manager in the room and a two-time resident of the Wall of Shame. He can break down a player's snap count, target share, and red zone usage. He just cannot pick one who actually scores points.\n\nThe problem is potential. O'Brien does not draft players. He drafts futures. Every roster is a bet that this is the year the breakout happens, the upside materialises, the talent matches the opportunity. Sometimes it works. He was the 2023 runner-up, one game away from the ultimate vindication. Most of the time it does not, and the result is a record that sits firmly below .500.\n\nThe lows have been legendary. Back-to-back last-place finishes in 2021 and 2022 made him the only manager to earn consecutive Wall of Shame appearances. First came a five-minute stand-up comedy set at an open mic night. Then Comic Con, dressed as Shark Boy from Shark Boy and Lava Girl, interviewing strangers. He took both like a champion, which is ironic, since that is the one title he has never earned.\n\nFour team names across six seasons. An overthinker who rebrands as often as he rebuilds. Always due a big season. Still waiting.",
  },
  {
    franchiseId: 'mint',
    name: 'Niall Murray',
    joined: 2020,
    bio: 'Niall Murray is proof that in MAC 12, the only thing more dangerous than missing the playoffs is winning the whole thing. The 2024 champion walked into 2025 as the reigning king and walked out with a 4-10 record, the worst in the league, and a one-way ticket to the Wall of Shame.\n\nThe championship hangover hit like a freight train. From lifting the trophy to the 50 Challenge, miles run, pints drank, and donuts eaten totalling fifty, all within 24 hours. Champion to punished in twelve months flat.\n\nMurray is a competitor through and through. Heavily invested, always engaged, always dangerous when the pieces fall into place. Runner-up in 2021. Champion in 2024. Four playoff appearances in six seasons. The effort has never been in question. The consistency has. The gap between his best and his worst is wider than anyone else in the league.\n\nThree team names across six seasons, each one chasing whatever player obsession is driving the roster that year. The Wet Bandits. You scratched my CeeDee. Mahomes-lander and The Boys. The name changes. The competitive fire does not.',
  },
  {
    franchiseId: 'magenta',
    name: 'Alan Horgan',
    joined: 2020,
    bio: "For four years, Alan Horgan was the punchline. The league's resident clown, its lovable punching bag, the man who took a bus from Dublin to Belfast with two bottles of wine and did the Titanic tour twice in an Irish rugby jersey because he finished last in the league's very first season. His all-time record still sits below .500. He has lost more games than anyone in MAC 12 history. And he is the reigning champion.\n\nNobody saw it coming. Nobody still quite believes it. Seventh, ninth, eighth, twelfth, then suddenly runner-up in 2024 and champion in 2025 with a 9-5 campaign. Same Alan. Same Tampa B-AH. He bet on CMC, got lucky that he stayed healthy, and rode it all the way to the trophy. Sometimes that is all it takes.\n\nThe man writes a weekly newsletter that nobody asked for and everyone eagerly awaits come Tuesday. He knows ball, he makes trades, he is active on the wire. He has been doing it all for six years. It just took five of them for any of it to actually work.\n\nThe worst all-time win rate in the league. A championship ring on his finger. Tampa B-AH forever.",
  },
  {
    franchiseId: 'navy',
    name: 'Joe Ennis',
    joined: 2020,
    bio: "Joe Ennis is the most fourth-place man in fantasy football. Three consecutive fourth-place finishes from 2022 to 2024. Always in the playoffs, never on the podium, never even close to the trophy. It is a streak so specific, so aggressively mediocre at the top end, that it almost feels intentional.\n\nA strategist by nature, Ennis thinks carefully about every move. The draft picks are calculated. The trades are considered. The waiver claims are deliberate. He even managed to draft a better team for Aidan Murphy than Murphy could draft for himself. And somehow, despite all that careful planning, the ceiling has been a first round playoff exit three years running. Fourth is fourth, and fourth is where Joe lives.\n\nThe early years were worse. Eighth and tenth in the league's first two seasons while the OGs around him collected rings. The middle years brought respectability. The 2025 collapse, 6-8 and eleventh place, brought reality crashing back down.\n\nZero championships. Zero podiums. Zero Wall of Shame appearances. Joe Ennis has never been the best and never been the worst. He is the mathematical centre of MAC 12. From Alistair Donaldson's XV to D'onta FourMore!, the names keep changing. The glass ceiling does not.",
  },
  {
    franchiseId: 'yellow',
    name: 'Aidan Murphy',
    joined: 2021,
    bio: "Aidan Murphy is a statistical miracle. The second best win rate in MAC 12 history. A perfect five-for-five playoff record. Two podium finishes. And absolutely no idea how he keeps doing it.\n\nDraft day is his Super Bowl. Or at least it should be. Joe Ennis picked his team one year and nobody noticed. The record stayed the same. That tells you everything you need to know about the BurrowMeDickinYoAss operation. Set the lineup, forget it exists, let fate do the rest.\n\nThe trouble starts in the postseason. Five playoff appearances, zero deep runs. Runner-up in 2022. Third in 2024. But most years he is a first round casualty, a regular season machine that stalls the moment the stakes go up. The regular season rewards consistency. The playoffs reward adaptation. Murphy does not adapt. Murphy trusts the draft. Or Joe's draft. Hard to tell.\n\nThe team name has not changed in five years. The approach has not changed either. Someday the luck runs out. Until then, MAC 12's luckiest manager keeps falling upward.",
  },
  {
    franchiseId: 'cyan',
    name: 'David Sharpe',
    joined: 2021,
    bio: 'If Aidan Murphy is the set-and-forget manager who somehow keeps winning, David Sharpe is the set-and-forget manager who does not. Same philosophy. Draft, deploy, disappear. Same limited knowledge of the player pool. Wildly different results.\n\nSharpe joined MAC 12 in 2021 and has spent the majority of his time in the bottom half of the standings. One playoff appearance in five seasons, a 2023 campaign that saw him sneak into fourth before normal service resumed. The rest has been a steady diet of 5-9 seasons and late-table finishes, the kind of record that would land most managers on the Wall of Shame if they ever had the misfortune of finishing dead last.\n\nThe remarkable thing about Burkeys Teur is the consistency of the mediocrity. Never quite bad enough to earn a forfeit. Never close to good enough to contend. Just perpetually hovering in the 7th to 11th range, doing enough to avoid embarrassment but not enough to threaten anyone.\n\nNo trades. No waiver wire magic. No deep knowledge of who is breaking out or who is breaking down. Just a draft-day roster and a prayer. The name has not changed in five years, and neither has the approach.\n\nDavid Sharpe: the man who proves that in fantasy football, you actually do need to know the players.',
  },
  {
    franchiseId: 'lime',
    name: 'Karl Moroney',
    joined: 2023,
    bio: 'Karl Moroney has an excuse for everything and a trophy for nothing. The self-proclaimed king of bad scheduling, Moroney has spent three seasons explaining to anyone who will listen why the results do not reflect the talent. The schedule was unfair. The matchups were brutal. The points against were historic. If excuses were worth fantasy points, Pronouns Who Dey would be a dynasty.\n\nTo be fair, the 2025 campaign proved there might be something behind the noise. A 10-4 regular season, the best record in the entire league, and a run to the championship final suggest that Moroney actually knows what he is doing. He trades. He works the wire. He knows the players. He just spent his first two years going 5-9 twice while insisting the universe was conspiring against him.\n\nThe 2024 near miss deserves a mention. Moroney was heading for the Wall of Shame until Shane Marmion forgot to set his lineup and sent Jack Ringrose to the punishment instead. Karl owes Shane a pint. Jack owes Shane a slap.\n\nThree seasons in. Runner-up in 2025. Now he says he is due a win. The numbers are starting to back it up. But in MAC 12, Karl Moroney will always be the king of excuses first and a contender second.',
  },
  {
    franchiseId: 'bright-yellow',
    name: 'Hugo Walsh',
    joined: 2023,
    bio: "Hugo Walsh's MAC 12 career began on Grafton Street with a guitar and whatever was left of his dignity. A 2-12 debut season, the worst record in league history, earned him the Wall of Shame in his very first year. The punishment was public: busking for strangers on Dublin's most famous shopping street. Welcome to the league.\n\nWhat happened next makes you wonder if the 2-12 was the outlier, not the norm. A 7-7 campaign in 2024 put Walsh into the top half of the table. An 8-6 season in 2025 finished fifth. Back-to-back respectable finishes from a manager who looked like a guaranteed annual forfeit after year one.\n\nFrom McGintys Dementors to Hawk Tuas Binatsos, the rebrand matched the rebuild. Two playoff appearances in three seasons, a record that would satisfy most managers, let alone one who went 2-12 in his debut.\n\nThe all-time record still carries the scars of that first season, but the direction of travel is clear. Hugo Walsh is no longer the league's easy target. He might not be a title contender yet, but he is a long way from Grafton Street.",
  },
];

export function getManager(franchiseId: string): Manager | undefined {
  return managers.find((m) => m.franchiseId === franchiseId);
}
