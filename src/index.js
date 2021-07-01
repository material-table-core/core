import './utils/polyfill';
import React from 'react';
import { defaultProps } from './defaults';
import { propTypes } from './prop-types';
import MaterialTable from './material-table';
import { makeStyles } from '@material-ui/styles';
import { useTheme } from '@material-ui/core';

MaterialTable.defaultProps = defaultProps;
MaterialTable.propTypes = propTypes;

const useStyles = makeStyles({
  paginationRoot: {
    width: '100%'
  },
  paginationToolbar: {
    padding: '0 !important',
    width: '100%'
  },
  paginationCaption: {
    display: 'none'
  },
  paginationSelectRoot: {
    margin: 0
  }
});

export default function Table(props) {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <MaterialTable
      classes={classes}
      theme={theme}
      {...props}
      ref={props.tableRef}
    />
  );
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
