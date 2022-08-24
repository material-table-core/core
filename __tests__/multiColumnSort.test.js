import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import MaterialTable from '../src';

const columns = [
  {
    title: 'Number',
    field: 'number',
    minWidth: 140,
    maxWidth: 400
  },
  {
    title: 'Title',
    field: 'title',
    minWidth: 140,
    maxWidth: 400,
    sorting: true
  },
  {
    title: 'Name',
    field: 'name',
    minWidth: 140,
    maxWidth: 400,
    sorting: true
  },
  {
    title: 'Last Name',
    field: 'lastName',
    minWidth: 140,
    maxWidth: 400,
    sorting: true
  }
];

const data = [
  {
    number: 1,
    title: 'Developer',
    name: 'Mehmet',
    lastName: 'Baran',
    id: '1231'
  },
  {
    number: 22,
    title: 'Developer',
    name: 'Pratik',
    lastName: 'N',
    id: '1234'
  },
  {
    number: 25,
    title: 'Human Resources',
    name: 'Juan',
    lastName: 'Lopez',
    id: '1235'
  },
  {
    number: 3,
    title: 'Consultant',
    name: 'Raul',
    lastName: 'Barak',
    id: '1236'
  }
];

describe('Multi Column Sort', () => {
  let initialOrderCollection = [];
  let onOrderCollectionChangeSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    onOrderCollectionChangeSpy = jest.fn();
    initialOrderCollection = [
      {
        orderBy: 1,
        orderDirection: 'asc',
        columnIndex: 1
      },
      {
        orderBy: 2,
        orderDirection: 'desc',
        columnIndex: 2
      }
    ];
  });

  test('should update table by multi column', () => {
    const { queryAllByTestId } = render(
      <MaterialTable
        data={data}
        columns={columns}
        title="Multi Column Sort"
        options={{
          maxColumnSort: 3
        }}
        onOrderCollectionChange={onOrderCollectionChangeSpy}
      />
    );

    const numberColumn = queryAllByTestId('mtableheader-sortlabel')[0];
    fireEvent.click(numberColumn);

    expect(onOrderCollectionChangeSpy).toHaveBeenCalledWith([
      { columnIndex: 0, orderBy: 0, orderDirection: 'asc' }
    ]);

    const titleColumn = queryAllByTestId('mtableheader-sortlabel')[1];
    fireEvent.click(titleColumn);

    expect(onOrderCollectionChangeSpy).toHaveBeenCalledWith([
      { columnIndex: 0, orderBy: 0, orderDirection: 'asc' },
      { columnIndex: 1, orderBy: 1, orderDirection: 'asc' }
    ]);
  });

  test('should update table by multi column and replace first if reach the maximum order columns', () => {
    const { queryAllByTestId } = render(
      <MaterialTable
        data={data}
        columns={columns}
        title="Multi Column Sort"
        options={{
          maxColumnSort: 3
        }}
        onOrderCollectionChange={onOrderCollectionChangeSpy}
      />
    );

    const numberColumn = queryAllByTestId('mtableheader-sortlabel')[0];
    fireEvent.click(numberColumn);

    expect(onOrderCollectionChangeSpy).toHaveBeenCalledWith([
      { columnIndex: 0, orderBy: 0, orderDirection: 'asc' }
    ]);

    fireEvent.click(queryAllByTestId('mtableheader-sortlabel')[1]);
    fireEvent.click(queryAllByTestId('mtableheader-sortlabel')[2]);
    fireEvent.click(queryAllByTestId('mtableheader-sortlabel')[3]);

    expect(onOrderCollectionChangeSpy).toHaveBeenCalledWith([
      { columnIndex: 1, orderBy: 1, orderDirection: 'asc' },
      { columnIndex: 2, orderBy: 2, orderDirection: 'asc' },
      { columnIndex: 3, orderBy: 3, orderDirection: 'asc' }
    ]);
  });

  test('should order desc when secon click', () => {
    const { queryAllByTestId } = render(
      <MaterialTable
        data={data}
        columns={columns}
        title="Multi Column Sort"
        options={{
          maxColumnSort: 3
        }}
        onOrderCollectionChange={onOrderCollectionChangeSpy}
      />
    );

    const numberColumn = queryAllByTestId('mtableheader-sortlabel')[0];
    fireEvent.click(numberColumn);
    fireEvent.click(numberColumn);

    expect(onOrderCollectionChangeSpy).toHaveBeenCalledWith([
      { columnIndex: 0, orderBy: 0, orderDirection: 'desc' }
    ]);
  });

  test('should have being initialized by defaultOrderByCollection', () => {
    const { queryAllByTestId } = render(
      <MaterialTable
        data={data}
        columns={columns}
        title="Multi Column Sort"
        options={{
          maxColumnSort: 3,
          defaultOrderByCollection: initialOrderCollection
        }}
        onOrderCollectionChange={onOrderCollectionChangeSpy}
      />
    );

    const numberColumn = queryAllByTestId('mtableheader-sortlabel')[0];
    fireEvent.click(numberColumn);

    expect(onOrderCollectionChangeSpy).toHaveBeenCalledWith([
      { columnIndex: 1, orderBy: 1, orderDirection: 'asc' },
      { columnIndex: 2, orderBy: 2, orderDirection: 'desc' },
      { columnIndex: 0, orderBy: 0, orderDirection: 'asc' }
    ]);
  });
});
