import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import MaterialTable from '../src';

const columns = [
  {
    title: 'Number',
    field: 'number',
    minWidth: 140,
    maxWidth: 400,
    sorting: true
  }
];

const data = [
  {
    number: 9
  },
  {
    number: 22
  },
  {
    number: 25
  },
  {
    number: 3
  }
];

describe('Disabled Client Sorting', () => {
  let initialOrderCollection = [];
  let onOrderCollectionChangeSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    onOrderCollectionChangeSpy = jest.fn();
    initialOrderCollection = [
      {
        orderBy: 0,
        orderDirection: 'asc',
        sortOrder: 0
      }
    ];
  });

  test('should not update order of rows when clientSorting false', () => {
    const { queryAllByTestId } = render(
      <MaterialTable
        data={data}
        columns={columns}
        title="Disabled Client Sort"
        options={{
          maxColumnSort: 1,
          clientSorting: false
        }}
        onOrderCollectionChange={onOrderCollectionChangeSpy}
      />
    );

    const numberColumn = queryAllByTestId('mtableheader-sortlabel')[0];
    fireEvent.click(numberColumn);

    expect(onOrderCollectionChangeSpy).toHaveBeenCalledWith([
      { sortOrder: 1, orderBy: 0, orderDirection: 'asc' }
    ]);

    const cells = queryAllByTestId('mtablebodyrow').map((row) =>
      row.querySelectorAll('[data-testid=mtablecell]')
    );
    expect(cells.length).toBe(4);
    expect(cells[0][0].innerHTML).toBe('9');
    expect(cells[1][0].innerHTML).toBe('22');
    expect(cells[2][0].innerHTML).toBe('25');
    expect(cells[3][0].innerHTML).toBe('3');
  });

  test('should update order of rows when clientSorting true', () => {
    const { queryAllByTestId } = render(
      <MaterialTable
        data={data}
        columns={columns}
        title="Disabled Client Sort"
        options={{
          maxColumnSort: 1,
          clientSorting: true
        }}
        onOrderCollectionChange={onOrderCollectionChangeSpy}
      />
    );

    const numberColumn = queryAllByTestId('mtableheader-sortlabel')[0];
    fireEvent.click(numberColumn);

    expect(onOrderCollectionChangeSpy).toHaveBeenCalledWith([
      { sortOrder: 1, orderBy: 0, orderDirection: 'asc' }
    ]);

    const cells = queryAllByTestId('mtablebodyrow').map((row) =>
      row.querySelectorAll('[data-testid=mtablecell]')
    );
    expect(cells.length).toBe(4);
    expect(cells[0][0].innerHTML).toBe('3');
    expect(cells[1][0].innerHTML).toBe('9');
    expect(cells[2][0].innerHTML).toBe('22');
    expect(cells[3][0].innerHTML).toBe('25');
  });
});
