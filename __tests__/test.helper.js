export const columns = [
  { field: 'firstName', title: 'First Name' },
  { field: 'lastName', title: 'Last Name' },
  { field: 'age', title: 'Age' }
];

export function makeData() {
  const runtime = Math.floor(Math.random() * 100);
  const datas = [];
  for (let i = 0; i < runtime; i++) {
    datas.push({
      firstName: makeFirstName(),
      lastName: makeLastName(),
      age: makeAge()
    });
  }
  return datas;
}

export function makeFirstName() {
  const names = [
    'Oliver',
    'Elijah',
    'William',
    'James',
    'Benjamin',
    'Lucas',
    'Henry',
    'Alexander',
    'Mason',
    'Michael',
    'Ethan',
    'Daniel'
  ];
  return names[Math.floor(Math.random() * names.length)];
}

export function makeLastName() {
  const lastnames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Miller',
    'Davis',
    'Garcia',
    'Rodriguez',
    'Wilson',
    'Martinez',
    'Anderson',
    'Taylor',
    'Thomas',
    'Hernandez',
    'Moore',
    'Martin'
  ];
  return lastnames[Math.floor(Math.random() * lastnames.length)];
}

export function makeAge() {
  return Math.floor(Math.random() * 99);
}
