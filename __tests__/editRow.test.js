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

describe('Edit Row Row Add', () => {
  test('Renders the table with add functionally', () => {
    render(
      <MaterialTable
        data={data}
        columns={columns}
        editable={{
          onRowAdd: jest.fn()
        }}
      />
    );
    screen.getByRole('button', {
      name: /add/i
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

  test('the toggle of add', async () => {
    const onRowAdd = jest.fn();
    const onRowAddCancelled = jest.fn();
    render(
      <MaterialTable
        data={data}
        columns={columns}
        editable={{
          onRowAdd,
          onRowAddCancelled
        }}
      />
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /add/i
      })
    );

    screen.getByTestId('check');
    const cancelButton = screen.getByRole('button', {
      name: /cancel/i
    });

    within(cancelButton).getByTestId('clear');

    screen.getByRole('textbox', {
      name: /name/i,
      value: ''
    });
    const cell = screen.getByRole('cell', {
      name: /​/i,
      value: ''
    });

    within(cell).getByRole('textbox', {
      hidden: true
    });

    fireEvent.click(cancelButton);

    screen.getByRole('cell', {
      name: /one/i
    });

    expect(onRowAdd.mock.calls.length).toBe(0);

    expect(onRowAddCancelled.mock.calls.length).toBe(1);

    fireEvent.click(
      screen.getByRole('button', {
        name: /add/i
      })
    );

    screen.getByTestId('check');

    fireEvent.click(
      screen.getByRole('button', {
        name: /add/i
      })
    );

    expect(
      screen.queryByRole('button', {
        name: /check/i
      })
    ).toBeNull();

    expect(onRowAdd.mock.calls.length).toBe(0);

    expect(onRowAddCancelled.mock.calls.length).toBe(2);
  });

  test('add a row', async () => {
    const onRowAdd = jest.fn(async () => {});
    render(
      <MaterialTable
        data={data}
        columns={columns}
        editable={{
          onRowAdd
        }}
      />
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /add/i
      })
    );

    const checkButton = screen.getByTestId('check');

    expect(onRowAdd.mock.calls.length).toBe(0);
    fireEvent.change(
      screen.getByRole('textbox', {
        name: /name/i,
        value: ''
      }),
      { target: { value: 'testName' } }
    );

    screen.getByDisplayValue(/testname/i);
    fireEvent.mouseDown(
      screen.getAllByRole('button', {
        name: /enum/i,
        value: ''
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

    await waitFor(() => screen.getAllByRole('textbox').length === 0);

    expect(onRowAdd.mock.calls[0]).toMatchObject([
      { id: 'testName', enum: '2' }
    ]);
  });
});

describe('Edit Row Row Update', () => {
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
    const onRowUpdateCancelled = jest.fn();
    render(
      <MaterialTable
        data={data}
        columns={columns}
        editable={{
          onRowUpdate,
          onRowUpdateCancelled
        }}
      />
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /edit/i
      })
    );

    screen.getByTestId('check');
    const cancelButton = screen.getByRole('button', {
      name: /cancel/i
    });

    within(cancelButton).getByTestId('clear');
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

    screen.getByTestId('edit');

    screen.getByRole('cell', {
      name: /one/i
    });
    expect(onRowUpdate.mock.calls.length).toBe(0);
    expect(onRowUpdateCancelled.mock.calls.length).toBe(1);
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

    const checkButton = screen.getByTestId('check');

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

    await waitFor(() => screen.getByTestId('edit'));

    expect(onRowUpdate.mock.calls[0]).toMatchObject([
      { id: 'testName', enum: '2' },
      {
        id: 1,
        enum: 1
      }
    ]);
  });
});
