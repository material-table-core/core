import * as React from 'react';
import * as CommonValues from '@utils/common-values';
import {
  screen,
  within,
  waitFor,
  fireEvent,
  render
} from '@testing-library/react';
import MaterialTable from '../src';
import '@testing-library/jest-dom';

describe('Resize Column', () => {
  let windowInnerWidth;
  let windowOrigGet;

  // jsdom doesn't know about layout/widths
  // this is simple implementation for testing

  const windowGetComputedStyle = (el) => {
    const style = windowOrigGet(el);
    const width = style?.width;
    return width && width.startsWith('calc(')
      ? {
          ...style,
          getPropertyValue: style.getPropertyValue,
          width: `${evalCalc(width)}px`
        }
      : style;
  };

  const evalCalc = (width) =>
    eval(
      width
        .replace(/calc\(/g, '(')
        .replace(/px/g, '')
        .replace(/%/g, `/100*${windowInnerWidth}`)
    );

  beforeAll(() => {
    const orig = CommonValues.reducePercentsInCalc;
    CommonValues.reducePercentsInCalc = (calc, scrollWidth) => {
      return orig(simplifyCalc(calc), windowInnerWidth);
    };

    windowInnerWidth = window.innerWidth;
    windowOrigGet = window.getComputedStyle;
    window.getComputedStyle = windowGetComputedStyle;
  });

  afterAll(() => {
    window.getComputedStyle = windowOrigGet;
  });

  describe('Test altering width field', () => {
    test('calc((100% - 195px) / 2)', () => {
      expect(simplifyCalc('calc((100% - 195px) / 2)')).toBe(
        'calc(100% / 2 - 195px / 2)'
      );
    });

    test('calc(calc(300px - 150px) + 5px)', () => {
      expect(simplifyCalc('calc(calc(300px - 150px) + 5px)')).toBe(
        'calc(300px - 150px + 5px)'
      );
    });
  });

  describe('tableWidth variable', () => {
    test('Reduce width in steps', () => {
      render(
        <MaterialTable
          data={[{ name: 'Smith', notes: 'A common name' }]}
          columns={[
            { title: 'Name', field: 'name', width: 40 },
            { title: 'Notes', field: 'notes', width: 200 }
          ]}
          options={{
            ...base,
            tableWidth: 'variable'
          }}
        />
      );

      const thNotes = screen.getByRole('columnheader', {
        name: /Notes/i
      });
      const table = thNotes.closest('table');

      //screen.debug(thNotes);
      expect(table).toHaveStyle({ width: '240px' });
      expect(thNotes).toHaveStyle({ width: '200px' });

      const drag = within(thNotes).getByTestId('drag_handle');

      fireEvent.focus(drag);
      fireEvent.mouseDown(drag, { clientX: 1000 });
      fireEvent.mouseMove(drag, { clientX: 990 });
      expect(thNotes).toHaveStyle({ width: '190px' });
      expect(table).toHaveStyle({ width: '230px' });
      fireEvent.mouseMove(drag, { clientX: 989 });
      expect(thNotes).toHaveStyle({ width: '189px' });
      expect(table).toHaveStyle({ width: '229px' });

      fireEvent.mouseUp(drag);
      expect(thNotes).toHaveStyle({ width: '189px' });
      expect(table).toHaveStyle({ width: '229px' });
    });

    test('onColumnResize', async () => {
      const onColumnResized = jest.fn();
      render(
        <MaterialTable
          data={[{ name: 'Smith', notes: 'A common name' }]}
          columns={[
            { title: 'Name', field: 'name', width: 40 },
            { title: 'Notes', field: 'notes', width: 200 }
          ]}
          options={{
            ...base,
            tableWidth: 'variable'
          }}
          onColumnResized={onColumnResized}
        />
      );

      const thNotes = screen.getByRole('columnheader', {
        name: /Notes/i
      });
      const table = thNotes.closest('table');

      expect(table).toHaveStyle({ width: '240px' });
      expect(thNotes).toHaveStyle({ width: '200px' });
      expect(onColumnResized.mock.calls).toHaveLength(0);

      resize(thNotes, [-10, -20]);

      expect(thNotes).toHaveStyle({ width: '170px' });
      expect(table).toHaveStyle({ width: '210px' });
      await waitFor(() => expect(onColumnResized).toHaveBeenCalledTimes(1));

      expect(onColumnResized).lastCalledWith(
        [
          {
            field: 'notes',
            width: '170px',
            widthPx: 170
          }
        ],
        [
          {
            field: 'name',
            width: '40px',
            widthPx: 40
          },
          {
            field: 'notes',
            width: '170px',
            widthPx: 170
          }
        ]
      );
    });

    test('1 column with width not specified', async () => {
      const widthName = 25;
      const columns = [
        { title: 'Name', field: 'name', width: widthName },
        { title: 'Notes', field: 'notes' }
      ];
      render(
        <MaterialTable
          data={[{ name: 'Smith', notes: 'A common name' }]}
          columns={columns}
          options={{
            ...base,
            tableWidth: 'variable',
            columnResizable: true
          }}
        />
      );

      const thNotes = screen.getByRole('columnheader', {
        name: /Notes/i
      });
      const table = thNotes.closest('table');

      expect(table).toHaveStyle({ width: '100%' });
      expect(evalCalc(thNotes.style.width)).toBe(1024 - widthName);

      resize(thNotes, [-1]);
      expect(table).toHaveStyle({ width: '1023px' });
      expect(thNotes).toHaveStyle({ width: `${1024 - widthName - 1}px` });

      // Props are changed by material table, with tableData added
      // Not good practice
      columns.forEach((col) => {
        console.log(col);
      });
    });

    test('min width', async () => {
      const widthName = 25;
      const widthNotes = 200;
      const minWidthNotes = 50;

      render(
        <MaterialTable
          data={[{ name: 'Smith', notes: 'A common name' }]}
          columns={[
            { title: 'Name', field: 'name', width: widthName },
            {
              title: 'Notes',
              field: 'notes',
              width: widthNotes,
              minWidth: minWidthNotes
            }
          ]}
          options={{
            ...base,
            tableWidth: 'variable'
          }}
        />
      );

      const thNotes = screen.getByRole('columnheader', {
        name: /Notes/i
      });

      expect(thNotes.style.width).toBe(`${widthNotes}px`);

      resize(thNotes, [-160]);
      expect(thNotes).toHaveStyle({ width: `${minWidthNotes}px` });
    });

    test('reduce gracefully to max', () => {
      render(
        <MaterialTable
          data={[{ name: 'Smith', notes: 'A common name' }]}
          columns={[
            { title: 'Name', field: 'name', width: 40 },
            { title: 'Notes', field: 'notes', width: 300, maxWidth: 250 }
          ]}
          options={{
            ...base,
            tableWidth: 'variable'
          }}
        />
      );
      // maxWidth is less than width, can't increase width
      // when reducing won't jump to maxWidth

      const thNotes = screen.getByRole('columnheader', { name: /Notes/i });

      expect(thNotes).toHaveStyle({ width: '300px' });

      const drag = within(thNotes).getByTestId('drag_handle');
      fireEvent.focus(drag);
      fireEvent.mouseDown(drag, { clientX: 1000 });

      fireEvent.mouseMove(drag, { clientX: 990 });
      expect(thNotes).toHaveStyle({ width: '290px' });

      fireEvent.mouseMove(drag, { clientX: 950 });
      expect(thNotes).toHaveStyle({ width: '250px' });

      // Can't increase past max
      fireEvent.mouseMove(drag, { clientX: 960 });
      expect(thNotes).toHaveStyle({ width: '250px' });

      fireEvent.mouseMove(drag, { clientX: 940 });
      expect(thNotes).toHaveStyle({ width: '230px' });

      fireEvent.mouseUp(drag);
      expect(thNotes).toHaveStyle({ width: '230px' });
    });
  });

  describe('tableWidth full', () => {
    test('1 column with width not specified', async () => {
      const widthName = 45;
      const widthSurname = 150;
      const columns = [
        { title: 'Name', field: 'name', width: widthName },
        { title: 'Notes', field: 'notes' },
        { title: 'Surname', field: 'surname', width: widthSurname }
      ];
      render(
        <MaterialTable
          data={[{ name: 'John', surname: 'Smith', notes: 'A common name' }]}
          columns={columns}
          options={{
            ...base
          }}
        />
      );

      const thNotes = screen.getByRole('columnheader', { name: /Notes/i });
      const thSurname = screen.getByRole('columnheader', { name: /Surname/i });
      const table = thNotes.closest('table');

      expect(table).toHaveStyle({ width: '100%' });
      expect(evalCalc(thNotes.style.width)).toBe(
        1024 - widthName - widthSurname
      );
      expect(thSurname.style.width).toBe(`${widthSurname}px`);
      resize(thNotes, [-5]);

      expect(table).toHaveStyle({ width: '100%' });
      expect(evalCalc(thNotes.style.width)).toBe(
        1024 - widthName - widthSurname - 5
      );
      expect(evalCalc(thSurname.style.width)).toBe(widthSurname + 5);
    });

    test('2 columns with width not specified', async () => {
      const widthName = 55;
      const columns = [
        { title: 'Name', field: 'name', width: `${widthName}` },
        { title: 'Notes', field: 'notes' },
        { title: 'Surname', field: 'surname' }
      ];
      render(
        <MaterialTable
          data={[{ name: 'John', surname: 'Smith', notes: 'A common name' }]}
          columns={columns}
          options={{
            ...base,
            tableWidth: 'full'
          }}
        />
      );

      const thNotes = screen.getByRole('columnheader', { name: /Notes/i });
      const thSurname = screen.getByRole('columnheader', { name: /Surname/i });
      const table = thNotes.closest('table');

      expect(table).toHaveStyle({ width: '100%' });
      expect(evalCalc(thNotes.style.width)).toBe((1024 - widthName) / 2);
      expect(evalCalc(thSurname.style.width)).toBe((1024 - widthName) / 2);

      resize(thNotes, [-15]);
      expect(table).toHaveStyle({ width: '100%' });
      expect(evalCalc(thNotes.style.width)).toBe((1024 - widthName) / 2 - 15);
      expect(evalCalc(thSurname.style.width)).toBe((1024 - widthName) / 2 + 15);
    });

    test('satisfying max on column to right', async () => {
      render(
        <MaterialTable
          data={[{ name: 'John', surname: 'Smith', notes: 'A common name' }]}
          columns={[
            { title: 'Name', field: 'name', width: 40 },
            { title: 'Surname', field: 'surname', width: 60, maxWidth: 65 },
            { title: 'Notes', field: 'notes' }
          ]}
          options={{
            ...base,
            tableWidth: 'full'
          }}
        />
      );

      const thName = screen.getByRole('columnheader', { name: /^Name$/i });
      const thSurname = screen.getByRole('columnheader', { name: /Surname/i });

      resize(thName, [-10]);
      // Only move 5 because of maxWidth on surname
      expect(evalCalc(thName.style.width)).toBe(35);
      expect(evalCalc(thSurname.style.width)).toBe(65);
    });
  });
});

const base = {
  tableLayout: 'fixed',
  columnResizable: true,
  paging: false,
  toolbar: false,
  showTitle: false,
  search: false
};

// Side-step cssstyle in jsdom not supporting calc with nested parentheses
const simplifyCalc = (width) => {
  let newWidth = width;
  const innerCalc = newWidth.match(
    /^calc\(calc\((?<calc>.+)\)(?<extra>\s*[+-]\s*.+)\)$/
  );
  if (innerCalc) {
    newWidth = `calc(${innerCalc.groups.calc}${innerCalc.groups.extra})`;
  }
  const innerPara = newWidth.match(
    /^calc\(\((?<calc1>.*)\)\s*\/\s*(?<denom>\d+)(?<extra>.*)\)$/
  );
  if (innerPara) {
    const denom = innerPara.groups.denom;
    const innerCalc = innerPara.groups.calc1
      .split(/\s+/)
      .map((term) => {
        if (term.match(/[-+]/)) {
          return `${term}`;
        } else {
          return `${term} / ${denom}`;
        }
      })
      .join(' ');
    newWidth = `calc(${innerCalc}${innerPara.groups.extra})`;
  }
  return newWidth;
};

const resize = (th, moves) => {
  let moved = 0;
  const drag = within(th).getByTestId('drag_handle');

  let clientX = 1000;
  fireEvent.focus(drag);
  fireEvent.mouseDown(drag, { clientX: clientX });
  moves.forEach((move) => {
    clientX += move;
    fireEvent.mouseMove(drag, { clientX: clientX });
    moved += move;
  });
  fireEvent.mouseUp(drag);
};
