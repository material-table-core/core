import React from 'react';
import { render } from 'react-dom';

import {
  BasicFiltering,
  NonFilteringField,
  CustomFilteringAlgorithm,
} from './MTableFilterRow.test.js';

const DemoApp = () => (
  <div>
    <BasicFiltering />
    <NonFilteringField />
    <CustomFilteringAlgorithm />
  </div>
);

render(<DemoApp />, document.getElementById('root'));
