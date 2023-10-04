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
  TableMultiSorting,
  LocalizationWithCustomComponents
} from './demo-components';
import { createRoot } from 'react-dom/client';
import { I1353, I1941, I122 } from './demo-components/RemoteData';
import { Switch, FormControlLabel, CssBaseline } from '@mui/material';

module.hot.accept();

const container = document.querySelector('#app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

function Demo() {
  const [darkMode, setMode] = React.useState(false);
  return (
    <StrictMode>
      <StyledEngineProvider injectFirst>
        <ThemeProvider
          theme={createTheme({
            palette: { mode: darkMode ? 'dark' : 'light' }
          })}
        >
          <CssBaseline />
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(e) => {
                  setMode(e.target.checked);
                }}
              />
            }
            label="Dark Mode"
          />

          <h1>DetailPanelRemounting</h1>
          <DetailPanelRemounting />
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
          <h1>Bulk Edit</h1>
          <BulkEdit />
          <h1>Default Order Issue</h1>
          <DefaultOrderIssue />
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
          <h1>Multiple Detail Panels</h1>
          <MultipleDetailPanels />
          <h1>Editable</h1>
          <EditableCells />
          <h1>Frankenstein</h1>
          <FrankensteinDemo />
          <h1>Resizable Columns</h1>
          <Resizable />
          <h1>Persistent Groupings</h1>
          <PersistentGroupings persistentGroupingsId="persistence-id" />
          <h1>Persistent Groupings Same ID</h1>
          <PersistentGroupings persistentGroupingsId="persistence-id" />
          <h1>Persistent Groupings unshared</h1>
          <PersistentGroupings persistentGroupingsId="some-other-id" />
          <h1>Tree data</h1>
          <TreeData />
          <h1>Table with Summary Row</h1>
          <TableWithSummary />
          <h1>
            Table with custom numbers of pages around current page in stepped
            navigation
          </h1>
          <TableWithNumberOfPagesAround />
          <h1>Fixed Column with Row Edits</h1>
          <FixedColumnWithEdit />
          <h1>Localization with Custom Components</h1>
          <LocalizationWithCustomComponents />
          <h1>Remote Data Related</h1>
          <ol>
            <li>
              <h3>
                mbrn{' '}
                <a href="https://github.com/mbrn/material-table/issues/1353">
                  #1353
                </a>
              </h3>
              <I1353 />
            </li>
            <li>
              <h3>
                mbrn{' '}
                <a href="https://github.com/mbrn/material-table/issues/1941">
                  #1941
                </a>
              </h3>
              <I1941 />
            </li>
            <li>
              <h3>
                <a href="https://github.com/material-table-core/core/issues/122">
                  #122
                </a>
              </h3>
              <I122 />
            </li>
          </ol>
        </ThemeProvider>
      </StyledEngineProvider>
    </StrictMode>
  );
}
root.render(<Demo />);
