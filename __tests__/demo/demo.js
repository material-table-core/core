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

import { Basic, ExportData, CustomExport } from './demo-components';

module.hot.accept();

render(
  <div>
    {/*
      <h1>Basic</h1>
      <Basic />
    */}
    <h1>Export Data</h1>
    <ExportData />
    <h1>Custom Export </h1>
    <CustomExport />

    {/*
    <h1>Editable</h1>
    <EditableCells />
    */}
  </div>,
  document.querySelector('#app')
);
