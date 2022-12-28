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

describe('Localization', () => {
  test('Renders the pagination', () => {
    render(
      <MaterialTable
        data={data}
        columns={columns}
        localization={{
          pagination: {
            labelDisplayedRows: 'Test_labelDisplayedRows',
            labelRowsPerPage: 'Test_labelRowsPerPage',
            labelRows: 'Test_labelRows'
          }
        }}
      />
    );
    screen.getByText(/test_labeldisplayedrows/i);
    screen.getByText(/test_labelrowsperpage/i);
    screen.getByText(/5 Test_labelRows/i);
  });
});
