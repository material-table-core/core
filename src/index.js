import './utils/polyfill';
import React from 'react';
import { defaultProps } from './defaults';
import { propTypes } from './prop-types';
import MaterialTable from './material-table';
import { useTheme } from '@mui/material/styles';

MaterialTable.defaultProps = defaultProps;
MaterialTable.propTypes = propTypes;

export default function Table(props) {
  const theme = useTheme();
  return <MaterialTable theme={theme} {...props} ref={props.tableRef} />;
}

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
