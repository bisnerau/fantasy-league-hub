export type Manager = {
  franchiseId: string;
  name: string;
  joined: number;
};

export const managers: Manager[] = [
  { franchiseId: 'burns', name: 'Emmet Burns', joined: 2020 },
  { franchiseId: 'lavender', name: 'Jack Ringrose', joined: 2020 },
  { franchiseId: 'purple', name: 'Andrew Keenan', joined: 2020 },
  { franchiseId: 'salmon', name: 'Shane Marmion', joined: 2020 },
  { franchiseId: 'red', name: "Tommy O'Brien", joined: 2020 },
  { franchiseId: 'mint', name: 'Niall Murray', joined: 2020 },
  { franchiseId: 'magenta', name: 'Alan Horgan', joined: 2020 },
  { franchiseId: 'navy', name: 'Joe Ennis', joined: 2020 },
  { franchiseId: 'yellow', name: 'Aidan Murphy', joined: 2021 },
  { franchiseId: 'cyan', name: 'David Sharpe', joined: 2021 },
  { franchiseId: 'lime', name: 'Karl Moroney', joined: 2023 },
  { franchiseId: 'bright-yellow', name: 'Hugo Walsh', joined: 2023 },
];

export function getManager(franchiseId: string): Manager | undefined {
  return managers.find((m) => m.franchiseId === franchiseId);
}
