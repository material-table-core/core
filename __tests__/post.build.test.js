import React from 'react';

import MaterialTable from '../dist';
import { render } from '@testing-library/react';

import { makeData, columns } from './test.helper';

/**
 * Uses '../dist' for MaterialTable
 */
describe('Render Table : Post Build', () => {
  // Render empty table
  describe('when attempting to render an empty table', () => {
    it('renders without crashing', () => {
      render(<MaterialTable />);
    });
  });
  // Render table with random data
  describe('when attempting to render a table with data', () => {
    it('renders without crashing', () => {
      const data = makeData();
      render(<MaterialTable data={data} columns={columns} />);
    });
  });
});
