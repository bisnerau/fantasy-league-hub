export type Forfeit = {
  year: number;
  franchiseId: string;
  managerName: string;
  teamName: string;
  record: string;
  forfeit: string;
  image: string | null;
};

export const forfeits: Forfeit[] = [
  {
    year: 2025,
    franchiseId: 'mint',
    managerName: 'Niall',
    teamName: 'Mahomes-lander and The Boys',
    record: '',
    forfeit:
      'The 50 Challenge - miles run, pints drank, and donuts eaten must total 50, all within 24 hours.',
    image: '/shame/2025.png',
  },
  {
    year: 2024,
    franchiseId: 'lavender',
    managerName: 'Jack',
    teamName: 'The Finest Wagyu',
    record: '5-9',
    forfeit:
      'Had to do a calendar photo shoot recreating iconic Sports Illustrated covers, with every photo chosen by the league.',
    image: '/shame/2024.png',
  },
  {
    year: 2023,
    franchiseId: 'bright-yellow',
    managerName: 'Hugo',
    teamName: 'McGintys Dementors',
    record: '2-12',
    forfeit: 'Had to go busking on Grafton Street.',
    image: '/shame/2023.png',
  },
  {
    year: 2022,
    franchiseId: 'red',
    managerName: "Tommy O'Brien",
    teamName: 'Show me the Mooney',
    record: '3-11',
    forfeit:
      'Had to go to Comic Con dressed as Shark Boy from Shark Boy and Lava Girl and do interviews with other attendees.',
    image: '/shame/2022.png',
  },
  {
    year: 2021,
    franchiseId: 'red',
    managerName: "Tommy O'Brien",
    teamName: 'All I do is Winston',
    record: '4-10',
    forfeit: 'Had to do a 5-minute comedy stand-up set at an open mic night.',
    image: '/shame/2021.png',
  },
  {
    year: 2020,
    franchiseId: 'magenta',
    managerName: 'Alan Horgan',
    teamName: 'Tampa B-AH',
    record: '4-10',
    forfeit:
      'Bus from Dublin to Belfast, two bottles of wine on the way down, the Titanic tour twice back to back, all recorded on video. Had to wear an Irish rugby jersey the entire time.',
    image: '/shame/2020.png',
  },
];
