/**
 * Default data for the `MaterialTable.components` attribute
 */

import { TablePagination } from '@mui/material';

import {
  Container,
  MTableAction,
  MTableActions,
  MTableBody,
  MTableCell,
  MTableEditCell,
  MTableEditField,
  MTableEditRow,
  MTableFilterRow,
  MTableGroupRow,
  MTableGroupbar,
  MTableHeader,
  MTableBodyRow,
  MTableSummaryRow,
  MTableToolbar,
  OverlayError,
  OverlayLoading
} from '../components';

export default {
  Action: MTableAction,
  Actions: MTableActions,
  Body: MTableBody,
  Cell: MTableCell,
  Container: Container,
  EditCell: MTableEditCell,
  EditField: MTableEditField,
  EditRow: MTableEditRow,
  FilterRow: MTableFilterRow,
  Groupbar: MTableGroupbar,
  GroupRow: MTableGroupRow,
  Header: MTableHeader,
  OverlayLoading: OverlayLoading,
  OverlayError: OverlayError,
  Pagination: TablePagination,
  Row: MTableBodyRow,
  SummaryRow: MTableSummaryRow,
  Toolbar: MTableToolbar
};
