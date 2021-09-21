import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved
} from '@testing-library/react';

import MaterialTable from '../src';

import { makeData, columns } from './test.helper';

/**
 * Uses '../src' for MaterialTable
 */
describe('Render Table : Pre Build', () => {
  // Render empty table
  describe('when attempting to render an empty table', () => {
    it('renders without crashing', () => {
      render(<MaterialTable />);
      screen.getByRole('heading', {
        name: /table title/i
      });
      screen.getByText(/search/i);
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

      screen.getByRole('columnheader', { name: /first name/i });
      screen.getByRole('columnheader', { name: /last name/i });
      screen.getByRole('columnheader', { name: /age/i });
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
      screen.getByRole('row', {
        name: /5 rows First Page Previous Page 1-5 of 99 Next Page Last Page/i
      });
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
      screen.getByRole('row', {
        name: /5 rows First Page Previous Page 1-5 of 99 Next Page Last Page/i
      });
      fireEvent.click(screen.getByText(/chevron_right/i));
      screen.getByRole('row', {
        name: /lucas miller 5/i
      });
      screen.getByRole('row', {
        name: /henry davis 6/i
      });
      screen.getByRole('row', {
        name: /michael wilson 9/i
      });
      screen.getByRole('row', {
        name: /5 rows First Page Previous Page 6-10 of 99 Next Page Last Page/i
      });
      fireEvent.click(screen.getByText(/last_page/i));
      screen.getByRole('row', {
        name: /Daniel Martinez 95/i
      });
      screen.getByRole('row', {
        name: /Oliver Anderson 96/i
      });
      screen.getByRole('row', {
        name: /William Thomas 98/i
      });
      screen.getByRole('row', {
        name: /5 rows First Page Previous Page 96-99 of 99 Next Page Last Page/i
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
      screen.getByRole('row', {
        name: /5 rows First Page Previous Page 1-5 of 6 Next Page Last Page/i
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
});
