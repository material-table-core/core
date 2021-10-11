import * as React from 'react';
import {
  act,
  screen,
  render,
  waitForElementToBeRemoved,
  within,
  waitFor,
  fireEvent
} from '@testing-library/react';
import MaterialTable from '../src';

const lookup = { 1: 'One', 2: 'Two' };

const columns = [
  { title: 'Enum', field: 'enum', lookup },
  { title: 'Name', field: 'id' }
];

const data = [{ id: 1, enum: 1 }];

describe('Edit Row', () => {
  test('Renders the table with edit functionally', () => {
    render(
      <MaterialTable
        data={data}
        columns={columns}
        editable={{
          onRowUpdate: jest.fn()
        }}
      />
    );
    screen.getByRole('button', {
      name: /edit/i
    });

    const row = screen.getByRole('row', {
      name: /one 1/i
    });

    within(row).getByRole('cell', {
      name: /1/i
    });
    within(row).getByRole('cell', {
      name: /one/i
    });
  });

  test('the toggle of edit', () => {
    const onRowUpdate = jest.fn();
    render(
      <MaterialTable
        data={data}
        columns={columns}
        editable={{
          onRowUpdate
        }}
      />
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /edit/i
      })
    );

    screen.getByText(/check/i);
    const cancelButton = screen.getByRole('button', {
      name: /cancel/i
    });

    within(cancelButton).getByText(/clear/i);
    screen.getByRole('textbox', {
      name: /name/i
    });
    const cell = screen.getByRole('cell', {
      name: /one/i
    });

    within(cell).getByRole('textbox', {
      hidden: true
    });
    fireEvent.click(cancelButton);

    screen.getByText(/edit/i);

    screen.getByRole('cell', {
      name: /one/i
    });
    expect(onRowUpdate.mock.calls.length).toBe(0);
  });

  test('edit a row', async () => {
    const onRowUpdate = jest.fn(async () => {});
    render(
      <MaterialTable
        data={data}
        columns={columns}
        editable={{
          onRowUpdate
        }}
      />
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /edit/i
      })
    );

    const checkButton = screen.getByText(/check/i);

    expect(onRowUpdate.mock.calls.length).toBe(0);
    fireEvent.change(
      screen.getByRole('textbox', {
        name: /name/i
      }),
      { target: { value: 'testName' } }
    );

    screen.getByDisplayValue(/testname/i);
    fireEvent.mouseDown(
      screen.getAllByRole('button', {
        name: /enum/i
      })[1]
    );
    screen.getByRole('option', {
      name: /one/i
    });
    const option = screen.getByRole('option', {
      name: /two/i
    });
    fireEvent.mouseDown(option);
    act(() => {
      option.click();
    });
    expect(screen.queryAllByRole('option')).toHaveLength(0);

    await waitForElementToBeRemoved(
      screen.queryByRole('presentation', {
        hidden: true
      })
    );
    screen.getByRole('cell', {
      name: /two/i
    });

    fireEvent.click(checkButton);

    await waitFor(() => screen.getByText(/edit/i));

    expect(onRowUpdate.mock.calls[0]).toMatchObject([
      { id: 'testName', enum: '2' },
      {
        id: 1,
        enum: 1
      }
    ]);
  });
});
