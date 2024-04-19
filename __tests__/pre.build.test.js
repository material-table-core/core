import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
  within
} from '@testing-library/react';

import MaterialTable from '../src';

import { makeData, columns } from './test.helper';

/**
 * Uses '../src' for MaterialTable
 */
describe.skip('Render Table : Pre Build', () => {
  // Render empty table
  describe('when attempting to render an empty table', () => {
    it('renders without crashing', () => {
      render(<MaterialTable />);
      screen.getByRole('heading', {
        name: /table title/i
      });
      screen.getByTestId(/search/i);
      screen.getByRole('textbox', {
        name: /search/i
      });
      screen.getByRole('button', {
        name: /clear search/i
      });
      screen.getByRole('row', {
        name: /no records to display/i
      });
      screen.getByRole('button', { name: /rows per page: 5 rows/i });
      screen.getByRole('button', { name: /first page/i });
      screen.getByRole('button', { name: /previous page/i });
      screen.getByRole('button', { name: /next page/i });
      screen.getByRole('button', { name: /last page/i });
      expect(screen.getAllByRole('table')).toHaveLength(2);
    });
  });

  // Render table with data
  describe('when attempting to render a table with data', () => {
    it('renders without crashing', () => {
      const data = makeData();
      render(<MaterialTable data={data} columns={columns} />);

      screen.getAllByRole('columnheader', { name: /first name/i });
      screen.getAllByRole('columnheader', { name: /last name/i });
      screen.getAllByRole('columnheader', { name: /age/i });
      expect(
        screen.getAllByRole('button', { name: /first name/i })
      ).toHaveLength(1);
      expect(
        screen.getAllByRole('button', { name: /last name/i })
      ).toHaveLength(1);

      expect(screen.getAllByTestId('mtableheader-sortlabel')).toHaveLength(3);
      expect(screen.getAllByRole('button', { name: 'Age' })).toHaveLength(1);
      expect(screen.getAllByRole('row')).toHaveLength(7);
      screen.getByRole('row', {
        name: /first name last name age/i
      });

      screen.getByRole('row', {
        name: /oliver smith 0/i
      });
      screen.getByRole('row', {
        name: /elijah johnson 1/i
      });
      screen.getByRole('row', {
        name: /william williams 2/i
      });
      screen.getByRole('row', {
        name: /james brown 3/i
      });
      screen.getByText(/1-5 of 99/i);
    });

    it('navigates between the pages', () => {
      const data = makeData();
      render(<MaterialTable data={data} columns={columns} />);

      screen.getByRole('row', {
        name: /oliver smith 0/i
      });
      screen.getByRole('row', {
        name: /elijah johnson 1/i
      });
      screen.getByRole('row', {
        name: /william williams 2/i
      });
      screen.getByRole('row', {
        name: /james brown 3/i
      });
      screen.getByText(/1-5 of 99/i);

      fireEvent.click(screen.getByTestId(/chevron_right/i));
      screen.getByRole('row', {
        name: /lucas miller 5/i
      });
      screen.getByRole('row', {
        name: /henry davis 6/i
      });
      screen.getByRole('row', {
        name: /michael wilson 9/i
      });
      screen.getByText(/6-10 of 99/i);
      fireEvent.click(screen.getByTestId(/last_page/i));
      screen.getByRole('row', {
        name: /Daniel Martinez 95/i
      });
      screen.getByRole('row', {
        name: /Oliver Anderson 96/i
      });
      screen.getByRole('row', {
        name: /William Thomas 98/i
      });
      screen.getByText(/96-99 of 99/i);
      screen.getByText(/5 rows/i);
      screen.getByRole('button', {
        name: /next page/i
      });
      screen.getByRole('button', {
        name: /last page/i
      });
      screen.getByRole('button', {
        name: /previous page/i
      });
      screen.getByRole('button', {
        name: /first page/i
      });
      expect(screen.getAllByRole('row')).toHaveLength(8);
    });

    it('filters data by search input', async () => {
      const data = makeData();
      render(<MaterialTable data={data} columns={columns} />);
      screen.getByRole('row', {
        name: /oliver smith 0/i
      });
      fireEvent.input(
        screen.getByRole('textbox', {
          name: /search/i
        }),
        { target: { value: 'test' } }
      );
      screen.getByDisplayValue(/test/i);
      await waitForElementToBeRemoved(
        screen.getByRole('row', {
          name: /oliver smith 0/i
        })
      );
      screen.getByRole('row', {
        name: /no records to display/i
      });
      fireEvent.input(
        screen.getByRole('textbox', {
          name: /search/i
        }),
        { target: { value: 'john' } }
      );
      screen.getByDisplayValue(/john/i);
      await waitForElementToBeRemoved(
        screen.getByRole('row', {
          name: /no records to display/i
        })
      );
      screen.getByRole('row', {
        name: /elijah johnson 1/i
      });
      screen.getByRole('row', {
        name: /henry johnson 18/i
      });
      screen.getByRole('row', {
        name: /daniel johnson 35/i
      });
      screen.getByRole('row', {
        name: /benjamin johnson 52/i
      });
      screen.getByRole('row', {
        name: /michael johnson 69/i
      });

      screen.getByText(/1-5 of 6/i);
      screen.getByText(/5 rows/i);
      screen.getByRole('button', {
        name: /next page/i
      });
      screen.getByRole('button', {
        name: /last page/i
      });
      screen.getByRole('button', {
        name: /previous page/i
      });
      screen.getByRole('button', {
        name: /first page/i
      });
      fireEvent.click(
        screen.getByRole('button', {
          name: /clear search/i
        })
      );
      expect(screen.getByRole('textbox')).toHaveDisplayValue('');
      expect(
        screen.getByRole('button', {
          name: /clear search/i
        })
      ).toBeDisabled();
    });
  });
  // Render table with column render function
  it('renders the render function in column', () => {
    const data = makeData();
    render(
      <MaterialTable
        data={data}
        columns={columns.map((col) => ({
          ...col,
          field: '', // Removes the field to force the render to show
          render: (val) => val[col.field]
        }))}
      />
    );

    screen.getByRole('row', {
      name: /oliver smith 0/i
    });
    screen.getByRole('row', {
      name: /elijah johnson 1/i
    });
    screen.getByRole('row', {
      name: /william williams 2/i
    });
    screen.getByRole('row', {
      name: /james brown 3/i
    });
    screen.getByText(/1-5 of 99/i);
  });
});

describe.skip('Test event loop and flows', () => {
  it('calls onRowChange and onPageSizeChange during the same event loop', async () => {
    const apiCall = jest.fn(() => null);
    const data = makeData();
    const Component = () => {
      const [{ page, pageSize }, setPage] = React.useState({
        page: 0,
        pageSize: 5
      });

      React.useEffect(() => {
        apiCall(page, pageSize);
      }, [page, pageSize]);

      return (
        <MaterialTable
          data={data}
          columns={columns}
          onRowsPerPageChange={(size) => {
            setPage((prev) => ({ ...prev, pageSize: size }));
          }}
          onPageChange={(page) => {
            setPage((prev) => ({ ...prev, page }));
          }}
        />
      );
    };
    render(<Component />);
    expect(apiCall.mock.calls).toHaveLength(1);
    expect(apiCall.mock.calls[0]).toEqual([0, 5]);
    fireEvent.click(
      screen.getByRole('button', {
        name: /next page/i
      })
    );

    expect(apiCall.mock.calls).toHaveLength(2);
    expect(apiCall.mock.calls[1]).toEqual([1, 5]);
    fireEvent.mouseDown(
      screen.getByRole('button', {
        name: 'Rows per page: 5 rows'
      })
    );
    const listbox = within(screen.getByRole('presentation')).getByRole(
      'listbox'
    );
    const options = within(listbox).getAllByRole('option');
    const optionValues = options.map((li) => li.getAttribute('data-value'));

    expect(optionValues).toEqual(['5', '10', '20']);

    fireEvent.click(options[1]);

    expect(apiCall.mock.calls).toHaveLength(3);
    expect(apiCall.mock.calls[2]).toEqual([0, 10]);
  });
});
