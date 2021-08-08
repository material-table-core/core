import { createContext } from 'react';

// Default table state

// This needs to be exported so we have access to the 'raw' context
export const tableState = {
  bulkEditOpen: false,
  // columns: [], // columns (and data) have been moved to the core context
  currentPage: 1,
  // data: [], // data (and columns) have been moved to the core context
  errorState: undefined,
  groupedDataLength: undefined, // int
  lastEditingRow: undefined,
  orderBy: undefined,
  orderDirection: undefined,
  originalData: [], // Not sure why this is here?
  pageSize: 5,
  renderData: undefined, // this.pagedData,
  searchText: '',
  selectedCount: undefined,
  showAddRow: false,
  treeDataMaxLevel: undefined,
  treefiedDataLength: undefined,
  width: 0
  //
  // TODO:
  // query Should be an action
  //
  /*
  query: {
    filters: renderState.columns
      .filter((a) => a.tableData.filterValue)
      .map((a) => ({
        column: a,
        operator: '=',
        value: a.tableData.filterValue
      })),
    orderBy: renderState.columns.find(
      (a) => a.tableData.id === renderState.orderBy
    ),
    orderDirection: renderState.orderDirection,
    page: 0,
    pageSize: calculatedProps.options.pageSize,
    search: renderState.searchText,
    totalCount: 0
  },
  */
};

const tableContext = createContext(tableState);

export default tableContext;
