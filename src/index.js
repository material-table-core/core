import './utils/polyfill';
import React from 'react';
import { defaultProps } from './defaults';
import { propTypes } from './props/prop-types';
import MaterialTable from './components/MaterialTable';
import { withStyles } from '@material-ui/core';

import { MTableProvider } from './store/providers';

MaterialTable.defaultProps = defaultProps;
MaterialTable.propTypes = propTypes;

const styles = (theme) => ({
  paginationRoot: {
    width: '100%'
  },
  paginationToolbar: {
    padding: 0,
    width: '100%'
  },
  paginationCaption: {
    display: 'none'
  },
  paginationSelectRoot: {
    margin: 0
  }
});

export default withStyles(styles, { withTheme: true })((props) => (
  <MTableProvider>
    <MaterialTable {...props} ref={props.tableRef} />
  </MTableProvider>
));

export {
  MTableAction,
  MTableActions,
  MTableBody,
  MTableBodyRow,
  MTableCell,
  MTableEditCell,
  MTableEditField,
  MTableEditRow,
  MTableFilterRow,
  MTableGroupRow,
  MTableGroupbar,
  MTableHeader,
  MTablePagination,
  MTableSteppedPagination,
  MTableToolbar
} from './components';
