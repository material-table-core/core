import React from 'react';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import {
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
  MTableToolbar,
  OverlayError,
  OverlayLoading
} from './components';

const Container = (props) => <Paper elevation={2} {...props} />;

export const defaultProps = {
  actions: [],
  classes: {},
  columns: [],
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
    Toolbar: MTableToolbar
  },
  data: [],
  icons: {
    /* eslint-disable react/display-name */
    Add: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        add_box
      </Icon>
    )),
    Check: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        check
      </Icon>
    )),
    Clear: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        clear
      </Icon>
    )),
    Delete: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        delete_outline
      </Icon>
    )),
    DetailPanel: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        chevron_right
      </Icon>
    )),
    Edit: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        edit
      </Icon>
    )),
    Export: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        save_alt
      </Icon>
    )),
    Filter: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        filter_list
      </Icon>
    )),
    FirstPage: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        first_page
      </Icon>
    )),
    LastPage: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        last_page
      </Icon>
    )),
    NextPage: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        chevron_right
      </Icon>
    )),
    PreviousPage: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        chevron_left
      </Icon>
    )),
    ResetSearch: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        clear
      </Icon>
    )),
    Resize: React.forwardRef((props, ref) => (
      <Icon
        {...props}
        ref={ref}
        style={{ ...props.style, transform: 'rotate(90deg)' }}
      >
        drag_handle
      </Icon>
    )),
    Search: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        search
      </Icon>
    )),
    SortArrow: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        arrow_downward
      </Icon>
    )),
    ThirdStateCheck: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        remove
      </Icon>
    )),
    ViewColumn: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        view_column
      </Icon>
    )),
    Retry: React.forwardRef((props, ref) => (
      <Icon {...props} ref={ref}>
        replay
      </Icon>
    ))
    /* eslint-enable react/display-name */
  },
  isLoading: false,
  title: 'Table Title',
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
  style: {}
};
