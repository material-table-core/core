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
  CustomExport,
  OneDetailPanel,
  MultipleDetailPanels,
  DefaultOrderIssue,
  TestingNewActionHandlersProp,
  BulkEdit,
  BasicRef,
  BulkEditWithDetailPanel,
  EditableRow,
  EditableCells,
  FrankensteinDemo,
  HidingColumns,
  Resizable,
  ResizableTableWidthVariable,
  EditableRowDateColumnIssue,
  PersistentGroupings,
  DataSwitcher,
  DetailPanelIssuesProgrammaticallyHidingWhenOpen,
  EventTargetErrorOnRowClick,
  SelectionOnRowClick,
  DetailPanelRemounting,
  TreeData,
  TableWithSummary,
  TableWithNumberOfPagesAround,
  FixedColumnWithEdit
} from './demo-components';
import { I1353, I1941, I122 } from './demo-components/RemoteData';

module.hot.accept();

render(
  <div>
    <h1>DetailPanelRemounting</h1>
    <OneDetailPanel />
  </div>,
  document.querySelector('#app')
);
