import * as React from 'react';
import {
  screen,
  render,
  waitForElementToBeRemoved
} from '@testing-library/react';
import MaterialTable from '../src';
import '@testing-library/jest-dom';

describe('Show Pagination Buttons', () => {
  test('Show no buttons', async () => {
    render(
      <MaterialTable
        data={[
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' }
        ]}
        columns={[
          { title: 'Name', field: 'name', width: 40 },
          { title: 'Notes', field: 'notes', width: 200 }
        ]}
        options={{
          showFirstLastPageButtons: false
        }}
      />
    );
    screen.getByRole('button', { name: /previous page/i });
    screen.getByRole('button', { name: /next page/i });
    expect(screen.queryByRole('button', { name: /first page/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /last page/i })).toBeNull();
  });
  test('Show first buttons', async () => {
    render(
      <MaterialTable
        data={[
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' }
        ]}
        columns={[
          { title: 'Name', field: 'name', width: 40 },
          { title: 'Notes', field: 'notes', width: 200 }
        ]}
        options={{
          showFirstLastPageButtons: { last: false }
        }}
      />
    );
    screen.getByRole('button', { name: /previous page/i });
    screen.getByRole('button', { name: /next page/i });
    screen.getByRole('button', { name: /first page/i });
    expect(screen.queryByRole('button', { name: /last page/i })).toBeNull();
  });
  test('Show last buttons', async () => {
    render(
      <MaterialTable
        data={[
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' }
        ]}
        columns={[
          { title: 'Name', field: 'name', width: 40 },
          { title: 'Notes', field: 'notes', width: 200 }
        ]}
        options={{
          showFirstLastPageButtons: { first: false }
        }}
      />
    );
    screen.getByRole('button', { name: /previous page/i });
    screen.getByRole('button', { name: /next page/i });
    screen.getByRole('button', { name: /last page/i });
    expect(screen.queryByRole('button', { name: /first page/i })).toBeNull();
  });
  test('Show all buttons', async () => {
    render(
      <MaterialTable
        data={[
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' }
        ]}
        columns={[
          { title: 'Name', field: 'name', width: 40 },
          { title: 'Notes', field: 'notes', width: 200 }
        ]}
        options={{}}
      />
    );

    screen.getByRole('button', { name: /previous page/i });
    screen.getByRole('button', { name: /next page/i });
    screen.getByRole('button', { name: /first page/i });
    screen.getByRole('button', { name: /last page/i });
  });
});
