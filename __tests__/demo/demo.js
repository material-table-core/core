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

import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme
} from '@mui/material/styles';
import React, { StrictMode } from 'react';

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
  PersistentGroupings,
  DataSwitcher,
  DetailPanelIssuesProgrammaticallyHidingWhenOpen,
  EventTargetErrorOnRowClick,
  SelectionOnRowClick,
  DetailPanelRemounting,
  TreeData,
  TableWithSummary,
  TableWithNumberOfPagesAround,
  FixedColumnWithEdit,
  TableMultiSorting
} from './demo-components';
import { createRoot } from 'react-dom/client';
import { I1353, I1941, I122 } from './demo-components/RemoteData';

module.hot.accept();

const container = document.querySelector('#app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={createTheme()}>
        <h1>DetailPanelRemounting</h1>
        {/* <h1>Switcher</h1>
    <DataSwitcher />

  <h1>SelectionOnRowClick</h1>
  <SelectionOnRowClick />

    <h1>EventTargetErrorOnRowClick</h1>
    <EventTargetErrorOnRowClick
      onSelectionChange={(d) => console.log('onSelectionChange', d)}
    />

    <h1>DetailPanelIssuesProgrammaticallyHidingWhenOpen</h1>
    <DetailPanelIssuesProgrammaticallyHidingWhenOpen />

    <h1>Basic</h1>
    <Basic />

    <h1>Basic Ref</h1>
    <BasicRef />

    {/*
    <h1>Export Data</h1>
    <ExportData />
    */}
        {/*
   <h1>Custom Export </h1>
   <CustomExport />
   */}
        <h1>Tree data</h1>
        <TreeData />
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>
);
