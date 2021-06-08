/* eslint-disable react/display-name */

// Default export at bottom of file! FYI.

import React, { forwardRef, createContext } from 'react';
import { Icon, TablePagination } from '@material-ui/core';
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
} from '../../../components';

// Default table state
export const tableState = {
  components: {
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
  },
  icons: {
    Add: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        add_box
      </Icon>
    )),
    Check: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        check
      </Icon>
    )),
    Clear: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        clear
      </Icon>
    )),
    Delete: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        delete_outline
      </Icon>
    )),
    DetailPanel: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        chevron_right
      </Icon>
    )),
    Edit: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        edit
      </Icon>
    )),
    Export: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        save_alt
      </Icon>
    )),
    Filter: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        filter_list
      </Icon>
    )),
    FirstPage: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        first_page
      </Icon>
    )),
    LastPage: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        last_page
      </Icon>
    )),
    NextPage: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        chevron_right
      </Icon>
    )),
    PreviousPage: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        chevron_left
      </Icon>
    )),
    ResetSearch: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        clear
      </Icon>
    )),
    Resize: forwardRef((props, ref) => (
      <Icon
        {...props}
        ref={ref}
        // eslint-disable-next-line react/prop-types
        style={{ ...props.style, transform: 'rotate(90deg)' }}
      >
        drag_handle
      </Icon>
    )),
    Search: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        search
      </Icon>
    )),
    SortArrow: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        arrow_downward
      </Icon>
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        remove
      </Icon>
    )),
    ViewColumn: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        view_column
      </Icon>
    )),
    Retry: forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        replay
      </Icon>
    ))
  },
  localization: {
    error: 'Data could not be retrieved',
    grouping: {
      groupedBy: 'Grouped By:',
      placeholder: 'Drag headers here to group by'
    },
    pagination: {
      labelDisplayedRows: '{from}-{to} of {count}',
      labelRowsPerPage: 'Rows per page:',
      labelRowsSelect: 'rows'
    },
    toolbar: {},
    header: {},
    body: {
      filterRow: {},
      editRow: {
        saveTooltip: 'Save',
        cancelTooltip: 'Cancel',
        deleteText: 'Are you sure you want to delete this row?'
      },
      addTooltip: 'Add',
      deleteTooltip: 'Delete',
      editTooltip: 'Edit',
      bulkEditTooltip: 'Edit All',
      bulkEditApprove: 'Save all changes',
      bulkEditCancel: 'Discard all changes'
    }
  },
  options: {
    actionsColumnIndex: 0,
    addRowPosition: 'last',
    columnsButton: false,
    detailPanelType: 'multiple',
    debounceInterval: 200,
    doubleHorizontalScroll: false,
    emptyRowsWhenPaging: true,
    exportAllData: false,
    exportMenu: [],
    filtering: false,
    groupTitle: false,
    header: true,
    headerSelectionProps: {},
    hideFilterIcons: false,
    loadingType: 'overlay',
    padding: 'default',
    searchAutoFocus: false,
    paging: true,
    pageSize: 5,
    pageSizeOptions: [5, 10, 20],
    paginationType: 'normal',
    paginationPosition: 'bottom',
    showEmptyDataSourceMessage: true,
    showFirstLastPageButtons: true,
    showSelectAllCheckbox: true,
    search: true,
    showTitle: true,
    showTextRowsSelected: true,
    showDetailPanelIcon: true,
    tableLayout: 'auto',
    toolbarButtonAlignment: 'right',
    searchFieldAlignment: 'right',
    searchFieldStyle: {},
    searchFieldVariant: 'standard',
    selection: false,
    selectionProps: {},
    sorting: true,
    toolbar: true,
    defaultExpanded: false,
    detailPanelColumnAlignment: 'left',
    thirdSortClick: true,
    overflowY: 'auto'
  }
};

// Default export
const tableContext = createContext(tableState);
export default tableContext;
