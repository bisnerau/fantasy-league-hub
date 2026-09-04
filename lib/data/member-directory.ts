export type LeagueMember = {
  franchiseId: string;
  displayName: string;
  loginSlug: string;
  sleeperUserId: string;
  rosterId: number;
  isAdmin?: boolean;
};

export const leagueMembers: LeagueMember[] = [
  {
    franchiseId: 'burns',
    displayName: 'Emmet Burns',
    loginSlug: 'emmet-burns',
    sleeperUserId: '718453786330365952',
    rosterId: 1,
    isAdmin: true,
  },
  {
    franchiseId: 'mint',
    displayName: 'Niall Murray',
    loginSlug: 'niall-murray',
    sleeperUserId: '738061436835819520',
    rosterId: 2,
  },
  {
    franchiseId: 'purple',
    displayName: 'Andrew Keenan',
    loginSlug: 'andrew-keenan',
    sleeperUserId: '739055047446568960',
    rosterId: 3,
  },
  {
    franchiseId: 'red',
    displayName: "Tommy O'Brien",
    loginSlug: 'tommy-obrien',
    sleeperUserId: '737758275193470976',
    rosterId: 4,
  },
  {
    franchiseId: 'lime',
    displayName: 'Karl Moroney',
    loginSlug: 'karl-moroney',
    sleeperUserId: '1004602947642167296',
    rosterId: 5,
  },
  {
    franchiseId: 'magenta',
    displayName: 'Alan Horgan',
    loginSlug: 'alan-horgan',
    sleeperUserId: '740522659250663424',
    rosterId: 6,
  },
  {
    franchiseId: 'navy',
    displayName: 'Joe Ennis',
    loginSlug: 'joe-ennis',
    sleeperUserId: '740323403877249024',
    rosterId: 7,
  },
  {
    franchiseId: 'bright-yellow',
    displayName: 'Hugo Walsh',
    loginSlug: 'hugo-walsh',
    sleeperUserId: '985665799148875776',
    rosterId: 8,
  },
  {
    franchiseId: 'lavender',
    displayName: 'Jack Ringrose',
    loginSlug: 'jack-ringrose',
    sleeperUserId: '1135343784256192512',
    rosterId: 9,
  },
  {
    franchiseId: 'salmon',
    displayName: 'Shane Marmion',
    loginSlug: 'shane-marmion',
    sleeperUserId: '740276106103533568',
    rosterId: 10,
  },
  {
    franchiseId: 'cyan',
    displayName: 'David Sharpe',
    loginSlug: 'david-sharpe',
    sleeperUserId: '1135908140857552896',
    rosterId: 11,
  },
  {
    franchiseId: 'yellow',
    displayName: 'Aidan Murphy',
    loginSlug: 'aidan-murphy',
    sleeperUserId: '1135900845381681152',
    rosterId: 12,
  },
];

export function memberLoginEmail(loginSlug: string) {
  return `${loginSlug}@mac12.example`;
}
