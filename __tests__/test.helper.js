import '@testing-library/jest-dom/extend-expect';

export const columns = [
  { field: 'firstName', title: 'First Name' },
  { field: 'lastName', title: 'Last Name' },
  { field: 'age', title: 'Age' }
];

export function makeData() {
  const runtime = 99;
  const datas = [];
  for (let i = 0; i < runtime; i++) {
    datas.push({
      firstName: makeFirstName(i),
      lastName: makeLastName(i),
      age: makeAge(i)
    });
  }
  return datas;
}

export function makeFirstName(runtime) {
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
  return names[runtime % names.length];
}

export function makeLastName(runtime) {
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
  return lastnames[runtime % lastnames.length];
}

export function makeAge(runtime) {
  return runtime;
}
