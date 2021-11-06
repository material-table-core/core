import * as React from 'react';
import { screen, render } from '@testing-library/react';
import MaterialTable from '../src';
import '@testing-library/jest-dom';

const columns = [
  { title: 'Enum', field: 'enum' },
  { title: 'Name', field: 'id' }
];

const data = [
  { id: 1, enum: 1 },
  { id: 2, enum: 2 }
];

describe('Summary row of table', () => {
  test('renders summary row if renderSummaryRow prop is present', () => {
    render(
      <MaterialTable
        data={data}
        columns={columns}
        renderSummaryRow={({ column }) => `Summary_${column.title}`}
      />
    );

    expect(
      screen.getByRole('row', { name: 'Summary_Enum Summary_Name' })
    ).toBeTruthy();
  });

  test('calls renderSummaryRow function for each column of table', () => {
    const renderSummaryMock = jest.fn();
    render(
      <MaterialTable
        data={data}
        columns={columns}
        renderSummaryRow={renderSummaryMock}
      />
    );

    columns.forEach((column, index) => {
      expect(renderSummaryMock).toHaveBeenCalledWith(
        expect.objectContaining({
          index: index,
          column: column,
          data: data.map((rowData) => expect.objectContaining(rowData))
        })
      );
    });
  });

  test('renders summary cells given value and style', () => {
    render(
      <MaterialTable
        data={data}
        columns={columns}
        renderSummaryRow={({ column }) => {
          return { value: `Summary_${column.title}`, style: { color: 'red' } };
        }}
      />
    );

    expect(screen.getByText('Summary_Enum')).toHaveStyle({ color: 'red' });
  });
});
