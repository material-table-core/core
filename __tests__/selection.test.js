import * as React from 'react';
import {
  screen,
  render,
  fireEvent,
  within,
  waitFor
} from '@testing-library/react';
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
  test('Parent Child Selection', async () => {
    const words = ['Paper', 'Rock', 'Scissors'];

    const rawData = [];
    for (let i = 0; i < 5; i++) {
      rawData.push({ id: i, word: words[i % words.length] });
    }

    const columns = [
      { title: 'Id', field: 'id' },
      { title: 'Word', field: 'word' }
    ];
    render(
      <MaterialTable
        parentChildData={(row, rows) => rows.find((a) => a.id === row.parentId)}
        data={[
          ...rawData,
          { id: 11, word: 'test', parentId: 0 },
          { id: 12, word: 'test', parentId: 1 }
        ]}
        columns={columns}
        options={{
          selection: true
        }}
      />
    );
    expect(screen.getAllByRole('checkbox')).toHaveLength(6);
    screen
      .getAllByRole('checkbox')
      .forEach((box) => expect(box).not.toBeChecked());
    const [all, first, second, third, fourth, fifth] =
      screen.getAllByRole('checkbox');

    fireEvent.click(first);
    screen.getByRole('heading', {
      name: /2 row\(s\) selected/i
    });
    expect(first).toBeChecked();
    expect(all).toHaveAttribute('data-indeterminate', 'true');
    const row = screen.getByRole('row', {
      name: /0 paper/i
    });

    const firstToggle = within(row).getByRole('button', {
      name: /detail panel visibility toggle/i
    });
    expect(
      screen.queryByRole('cell', {
        name: /11/i
      })
    ).toBeNull;

    fireEvent.click(firstToggle);

    screen.getByRole('cell', {
      name: /11/i
    });
    expect(screen.getAllByRole('checkbox')).toHaveLength(7);
    fireEvent.click(second);
    screen.getByRole('heading', {
      name: /4 row\(s\) selected/i
    });
    fireEvent.click(third);
    fireEvent.click(fourth);
    fireEvent.click(fifth);
    screen.getByRole('heading', {
      name: /7 row\(s\) selected/i
    });
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked();
  });
  test('Parent Child Selection with search', async () => {
    const words = ['Paper', 'Rock', 'Scissors'];

    const rawData = [];
    for (let i = 0; i < 5; i++) {
      rawData.push({ id: i, word: words[i % words.length] });
    }

    const columns = [
      { title: 'Id', field: 'id' },
      { title: 'Word', field: 'word' }
    ];
    render(
      <MaterialTable
        parentChildData={(row, rows) => rows.find((a) => a.id === row.parentId)}
        data={[
          ...rawData,
          { id: 11, word: 'test', parentId: 0 },
          { id: 12, word: 'test', parentId: 1 }
        ]}
        columns={columns}
        options={{
          selection: true
        }}
      />
    );
    expect(screen.getAllByRole('checkbox')).toHaveLength(6);
    screen
      .getAllByRole('checkbox')
      .forEach((box) => expect(box).not.toBeChecked());
    const search = screen.getByRole('textbox', {
      name: /search/i
    });
    fireEvent.change(search, { target: { value: '1' } });
    expect(search.value).toBe('1');
    await waitFor(() =>
      expect(screen.getAllByRole('checkbox')).toHaveLength(5)
    );
    const [all] = screen.getAllByRole('checkbox');
    fireEvent.click(all);
    screen
      .getAllByRole('checkbox')
      .forEach((box, i) => (i !== 1 ? expect(box).toBeChecked() : null));

    fireEvent.click(all);
    screen
      .getAllByRole('checkbox')
      .forEach((box) => expect(box).not.toBeChecked());

    const [a, b, third, d, fifth] = screen.getAllByRole('checkbox');
    fireEvent.click(third);
    fireEvent.click(fifth);
    expect(all).not.toBeChecked();
  });
});
