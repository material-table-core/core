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

import {
  Basic,
  OneDetailPanel,
  TestingNewActionHandlersProp,
  BulkEdit,
  BulkEditWithDetailPanel,
  ExportData,
  CustomExport,
  EditableRow,
  EditableCells,
  FrankensteinDemo,
  HidingColumns,
  Resizable
} from './demo-components';

module.hot.accept();

render(
  <div>
    <h1>Basic</h1>
    <Basic />

    {/*
    <h1>Export Data</h1>
    <ExportData />
    */}

    {/*
    <h1>Custom Export </h1>
    <CustomExport />
    */}

    <h1>Bulk Edit</h1>
    <BulkEdit />

    <h1>Bulk Edit With Detail Panel</h1>
    <BulkEditWithDetailPanel />

    <h1>Hiding Columns</h1>
    <HidingColumns />

    <h1>TestingNewActionHandlersProp</h1>
    <TestingNewActionHandlersProp />

    <h1>Editable Rows</h1>
    <EditableRow />

    <h1>One Detail Panel</h1>
    <OneDetailPanel />

    <h1>Editable</h1>
    <EditableCells />

    <h1>Frankenstein</h1>
    <FrankensteinDemo />

    <h1>Resizable Columns</h1>
    <Resizable />
  </div>,
  document.querySelector('#app')
);
