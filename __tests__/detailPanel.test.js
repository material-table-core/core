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

describe('Detailpanel render', () => {
  test('It displays and hides the detail with function', async () => {
    render(
      <MaterialTable
        data={data}
        columns={columns}
        detailPanel={({ rowData }) => {
          return <div>Detail Panel Test</div>;
        }}
      />
    );
    screen.getByRole('cell', {
      name: /one/i
    });

    const panelIsHidden = screen.queryByText(/Detail Panel Test/i);

    expect(panelIsHidden).toBeNull();

    const toggleButton = screen.getByRole('button', {
      name: /detail panel visibility toggle/i
    });

    fireEvent.click(toggleButton);

    screen.findByText(/Detail Panel Test/i);

    fireEvent.click(toggleButton);

    expect(screen.queryByText(/Detail Panel Test/i)).toBeNull();
  });

  test.skip('It displays the detail as is array', async () => {
    render(
      <MaterialTable
        data={data}
        columns={columns}
        detailPanel={[
          {
            tooltip: 'Show Name',
            render: ({ rowData }) => {
              return <div>Detail Panel Test</div>;
            }
          }
        ]}
      />
    );
    screen.getByRole('cell', {
      name: /one/i
    });
    const toggleButton = await screen.findByRole('button', {
      name: /detail panel visibility toggle/i
    });

    fireEvent.click(toggleButton);

    await waitFor(() => screen.findByText(/Detail Panel Test/i));

    fireEvent.click(toggleButton);

    await waitFor(() =>
      expect(screen.queryByText(/Detail Panel Test/i)).toBeNull()
    );
  });
});
