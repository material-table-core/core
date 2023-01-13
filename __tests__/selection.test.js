import * as React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import MaterialTable from '../src';
import '@testing-library/jest-dom';

describe('Selection tests', () => {
  test('Basic selection', async () => {
    render(
      <MaterialTable
        data={[
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' },
          { name: 'Smith', notes: 'A common name' }
        ]}
        columns={[
          { title: 'Name', field: 'name' },
          { title: 'Notes', field: 'notes' }
        ]}
        options={{
          selection: true
        }}
      />
    );
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes).toHaveLength(4);
    boxes.forEach((box) => expect(box).not.toBeChecked());
    const [all, first, second, third] = screen.getAllByRole('checkbox');
    fireEvent.click(first);
    expect(first).toBeChecked();
    screen.getByRole('heading', {
      name: /1 row\(s\) selected/i
    });
    expect(all).toHaveAttribute('data-indeterminate', 'true');

    fireEvent.click(second);
    expect(second).toBeChecked();

    fireEvent.click(third);
    expect(third).toBeChecked();
    expect(all).toBeChecked();
    expect(all).not.toHaveAttribute('data-indeterminate', 'true');
    screen.getByRole('heading', {
      name: /3 row\(s\) selected/i
    });
    boxes.forEach((box) => expect(box).toBeChecked());

    fireEvent.click(all);
    boxes.forEach((box) => expect(box).not.toBeChecked());

    expect(
      screen.queryByRole('heading', {
        name: /3 row\(s\) selected/i
      })
    ).toBeNull();
  });
});
