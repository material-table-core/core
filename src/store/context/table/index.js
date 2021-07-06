import { createContext } from 'react';

// Default table state
export const tableState = {
  bulkEditOpen: false,
  columns: [],
  currentPage: 1,
  data: [],
  errorState: undefined,
  groupedDataLength: undefined, // int
  lastEditingRow: undefined,
  orderBy: undefined, // this.orderBy,
  orderDirection: undefined, // this.orderDirection,
  originalData: [], // Not sure why this is here? //// this.data,
  pageSize: 5, // this.pageSize,
  renderData: undefined, // this.pagedData,
  searchText: '', //  this.searchText,
  selectedCount: undefined, // this.selectedCount,
  showAddRow: false,
  treeDataMaxLevel: undefined, // this.treeDataMaxLevel,
  treefiedDataLength: undefined, // this.treefiedDataLength,
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

// Create context and export
const tableContext = createContext(tableState);
export default tableContext;
