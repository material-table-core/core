/**
 * --- IMPORTANT NOTE FOR CONTRIBUTORS ---
 * Please try to keep this file as
 * clean and clutter free as possible
 * by placing demo components/code at:
 * `./demo-components/index.js`, or if
 * you need a place to store many demo
 * files, `./demo-components/MyComponent/foo.js`
 *
 *
 */

/**
 * --- README ---
 * This file is the entrypoint to the
 * built-in dev server (run `npm start`)
 */

import React from 'react';
import { render } from 'react-dom';
import ErrorBoundary from './errorBoundary';

import {
  FrankensteinDemo,
  OneDetailPanel,
  ExportData,
  Basic,
  EditableCells
} from './demo-components';

const App = () => {};

module.hot.accept();

render(
  <div>
    {/*
      <h1>Basic</h1>
      <Basic />
    */}
    <h1>Editable</h1>
    <EditableCells />
  </div>,
  document.querySelector('#app')
);
