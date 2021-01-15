import React, { createRef } from 'react';
import MaterialTable from '../src';
import { TEST_DATA, COLUMNS } from './utils';
import { configure, mount, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

describe('MTableFilterRow Tests', () => {
  let TABLE_REF = createRef();
  beforeEach(() => {
    // Needed to silence react-beautiful-dnd console warnings/errors
    global.window['__react-beautiful-dnd-disable-dev-warnings'] = true;
    TABLE_REF = createRef();
  });

  test('MaterialTable mounts successfully', () => {
    const wrapper = mount(
      <MaterialTable
        tableRef={TABLE_REF}
        data={TEST_DATA}
        columns={COLUMNS}
        options={{ filtering: true }}
      />
    );
    const { filtering } = TABLE_REF.current.props.options;
    expect(filtering).toBe(true);
    wrapper.unmount();
  });

  test('Custom Filter Algo', () => {
    // Update cols with custom search
    const cols = [
      {
        title: 'Given Name',
        field: 'name',
        customFilterAndSearch: (term, rowData) => term == rowData.name.length
      },
      { title: 'Sirname', field: 'sirname' },
      { title: 'Age', field: 'age' }
    ];

    const wrapper = mount(
      <MaterialTable
        tableRef={TABLE_REF}
        data={TEST_DATA}
        columns={cols}
        options={{ filtering: true }}
      />
    );
    const els = Array.from(wrapper.find('#m--table--filter--row')) || [];
    const el = els[0];
    // console.log(el.find('#m--table--filter--row'));
    expect(TABLE_REF.current.dataManager.filtered).toBe(true);
  });
});
