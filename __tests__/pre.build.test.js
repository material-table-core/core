import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import MaterialTable from '../src';

import { makeData, columns } from './test.helper';

configure({ adapter: new Adapter() });

/**
 * Uses '../src' for MaterialTable
 */
describe('Render Table : Pre Build', () => {
  // Render empty table
  describe('when attempting to render an empty table', () => {
    it('renders without crashing', () => {
      shallow(<MaterialTable />);
    });
  });
  // Render table with random data
  describe('when attempting to render a table with data', () => {
    it('renders without crashing', () => {
      const data = makeData();
      shallow(<MaterialTablePostBuild data={data} columns={columns} />);
    });
  });
});
