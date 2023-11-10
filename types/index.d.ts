import React from 'react';
import { IconProps } from '@mui/material/Icon';
import { CheckboxProps, ChipProps, SxProps } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import { OnHandlers } from './helper';

type SvgIconComponent = typeof SvgIcon;

export type ALL_COLUMNS = 'all_columns';

export interface OrderByCollection {
  orderBy: number;
  orderDirection: string;
  sortOrder: number;
}

export interface MaterialTableProps<RowData extends object> {
  sx?: SxProps;
  actions?: (
    | Action<RowData>
    | ((rowData: RowData) => Action<RowData>)
    | { action: (rowData: RowData) => Action<RowData>; position: string }
  )[];
  cellEditable?: {
    cellStyle?: CellStyle<RowData>;
    onCellEditApproved: (
      newValue: any,
      oldValue: any,
      rowData: RowData,
      columnDef: Column<RowData>
    ) => Promise<void>;
    isCellEditable: (rowData: RowData, columnDef: Column<RowData>) => boolean;
  };
  columns: Column<RowData>[];
  components?: Components;
  data: RowData[] | ((query: Query<RowData>) => Promise<QueryResult<RowData>>);
  detailPanel?:
    | (({ rowData }: { rowData: RowData }) => React.ReactNode)
    | (DetailPanel<RowData> | ((rowData: RowData) => DetailPanel<RowData>))[];
  editable?: {
    isEditable?: (rowData: RowData) => boolean;
    isBulkEditable?: () => boolean;
    isDeletable?: (rowData: RowData) => boolean;
    onBulkUpdate?: (
      changes: Record<number, { oldData: RowData; newData: RowData }>
    ) => Promise<unknown>;
    onRowAdd?: (newData: RowData) => Promise<unknown>;
    onRowUpdate?: (newData: RowData, oldData?: RowData) => Promise<unknown>;
    onRowDelete?: (oldData: RowData) => Promise<unknown>;
    editTooltip?: (rowData: RowData) => string;
    deleteTooltip?: (rowData: RowData) => string;
    onRowAddCancelled?: (rowData: RowData) => void;
    onRowUpdateCancelled?: (rowData: RowData) => void;
    isEditHidden?: (rowData: RowData) => boolean;
    isDeleteHidden?: (rowData: RowData) => boolean;
  };
  icons?: Icons<RowData>;
  initialFormData?: object;
  isLoading?: boolean;
  title?: React.ReactNode;
  options?: Options<RowData>;
  parentChildData?: (row: RowData, rows: RowData[]) => RowData | undefined;
  localization?: Localization;
  onRowsPerPageChange?: (pageSize: number) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onChangeColumnHidden?: (column: Column<RowData>, hidden: boolean) => void;
  onColumnDragged?: (sourceIndex: number, destinationIndex: number) => void;
  onColumnResized?: (
    changedColumns: ColumnSize[],
    allColumns: ColumnSize[]
  ) => void;
  /**
   * @deprecated this property is deprecated use onOrderCollectionChange instead.
   */
  onOrderChange?: (orderBy: number, orderDirection: 'asc' | 'desc') => void;
  onOrderCollectionChange?: (orderByCollection: OrderByCollection[]) => void;
  onGroupRemoved?: (column: Column<RowData>, index: number) => void;
  onGroupChange?: (columns: Column<RowData>[]) => void;
  onRowClick?: (
    event?: React.MouseEvent,
    rowData?: RowData,
    action?: RowAction
  ) => void;
  onRowDoubleClick?: (
    event?: React.MouseEvent,
    rowData?: RowData,
    toggleDetailPanel?: (panelIndex?: number) => void
  ) => void;
  onRowSelected?: (rowData: RowData) => void;
  onSearchChange?: (searchText: string) => void;
  /** An event fired when the table has finished filtering data
   * @param {Filter<RowData>[]} filters All the filters that are applied to the table
   */
  onFilterChange?: (filters: Filter<RowData>[]) => void;
  onSelectionChange?: (data: RowData[], rowData?: RowData) => void;
  onTreeExpandChange?: (data: any, isExpanded: boolean) => void;
  onQueryChange?: (query?: Query<RowData>) => void;
  onBulkEditOpen?: (isOpen: boolean) => void;
  onDetailPanelChange?: (row: RowData, state: 'open' | 'closed') => void;
  renderSummaryRow?: ({
    columns,
    column,
    index,
    data,
    currentData
  }: {
    columns: Column<RowData>[];
    column: Column<RowData>;
    index: number;
    data: RowData[];
    currentData: RowData[];
  }) =>
    | { value?: React.ReactNode; style?: React.CSSProperties }
    | React.ReactNode;
  style?: React.CSSProperties;
  tableRef?: React.RefObject<any> | React.MutableRefObject<undefined>;
  page?: number;
  totalCount?: number;
}

export interface RowAction {
  toggleDetailPanel: (panelIndex?: number) => void;
  enableEditMode: () => void;
}

export interface Filter<RowData extends object> {
  column: Column<RowData>;
  operator: '=';
  value: any;
}
export interface ErrorState {
  message: string;
  errorCause: 'query' | 'add' | 'update' | 'delete';
}

export interface Query<RowData extends object> {
  filters: Filter<RowData>[];
  page: number;
  pageSize: number;
  totalCount: number;
  search: string;
  /**
   * @deprecated this property is deprecated use orderByCollection instead.
   */
  orderBy: Column<RowData>;
  /**
   * @deprecated this property is deprecated use orderByCollection instead.
   */
  orderDirection: 'asc' | 'desc';
  orderByCollection: OrderByCollection[];
  error?: ErrorState;
}

export interface QueryResult<RowData extends object> {
  data: RowData[];
  page: number;
  totalCount: number;
}

export interface DetailPanel<RowData extends object> {
  disabled?: boolean;
  icon?: string | React.ComponentType<any>;
  openIcon?: string | React.ComponentType<any>;
  tooltip?: string;
  render: ({ rowData }: { rowData: RowData }) => string | React.ReactNode;
}

export interface Action<RowData extends object> {
  disabled?: boolean;
  icon: string | (() => React.ReactNode) | SvgIconComponent;
  isFreeAction?: boolean;
  position?: 'auto' | 'toolbar' | 'toolbarOnSelect' | 'row';
  tooltip?: string;
  onClick: (event: any, data: RowData | RowData[]) => void;
  handlers?: OnHandlers<RowData>;
  iconProps?: IconProps;
  hidden?: boolean;
}

export interface EditComponentProps<RowData extends object> {
  rowData: RowData;
  value: any;
  onChange: (newValue: any) => void;
  onRowDataChange: (newValue: RowData) => void;
  columnDef: EditCellColumnDef;
  error: boolean;
}

export interface EditCellColumnDef {
  field: string | string[];
  title: string;
  tableData: {
    columnOrder: number;
    filterValue: any;
    groupOrder: any;
    groupSort: string;
    id: number;
    width: string;
  };
}

export interface Column<RowData extends object> {
  align?: 'center' | 'inherit' | 'justify' | 'left' | 'right';
  cellStyle?: CellStyle<RowData>;
  currencySetting?: {
    locale?: string;
    currencyCode?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  };
  dateSetting?: { locale?: string; format?: string };
  customFilterAndSearch?: (
    filter: any,
    rowData: RowData,
    columnDef: Column<RowData>
  ) => boolean;
  draggable?: boolean;
  customSort?: (
    data1: RowData,
    data2: RowData,
    type: 'row' | 'group',
    sortDirection?: 'desc' | 'asc'
  ) => number;
  //customExport prop handle flattening of data at column level before passing data to exporter. Note exportMenu.exportFunc is an alternative to handle data change at exporter level
  customExport?: (rowData: RowData) => unknown;
  defaultFilter?: any;
  filterOnItemSelect?: boolean;
  defaultGroupOrder?: number;
  id?: unknown;
  defaultGroupSort?: 'asc' | 'desc';
  defaultSort?: 'asc' | 'desc';
  disableClick?: boolean;
  editComponent?: (props: EditComponentProps<RowData>) => React.ReactNode;
  emptyValue?:
    | string
    | React.ReactNode
    | ((data: any) => React.ReactNode | string);
  export?: boolean;
  field?: keyof RowData | string | Array<keyof RowData | string>;
  filtering?: boolean;
  filterComponent?: (props: {
    columnDef: Column<RowData>;
    // The columnId can be extracted from columnDef.tableData.id
    onFilterChanged: (columnId: number, value: any) => void;
  }) => React.ReactNode;
  filterPlaceholder?: string;
  filterCellStyle?: React.CSSProperties;
  grouping?: boolean;
  groupTitle?: string | ((groupData: any) => any) | React.ReactNode;
  headerStyle?: React.CSSProperties;
  hidden?: boolean;
  hiddenByColumnsButton?: boolean;
  hideFilterIcon?: boolean;
  initialEditValue?: any;
  lookup?: object;
  editPlaceholder?: string;
  editable?:
    | 'always'
    | 'onUpdate'
    | 'onAdd'
    | 'never'
    | ((columnDef: Column<RowData>, rowData: RowData) => boolean);
  removable?: boolean;
  resizable?: boolean;
  validate?: (
    rowData: RowData
  ) => { isValid: boolean; helperText?: string } | string | boolean;
  /**
   * Overrides the display of the cell for the column. It passes the rowData and expects a react node to render
   *
   * @memberof Column
   */
  render?: (data: RowData) => React.ReactNode;
  /**
   * Overrides the display of the group title for the column. It passes the grouped key as string and expects a react node to render
   *
   * @memberof Column
   */
  groupRender?: (groupKey: string) => React.ReactNode;
  // A function to be called for each column during the csv export to manipulate the exported data
  exportTransformer?: (row: RowData) => unknown;
  searchable?: boolean;
  sorting?: boolean;
  title?: React.ReactNode;
  tooltip?: string;
  type?:
    | 'string'
    | 'boolean'
    | 'numeric'
    | 'date'
    | 'datetime'
    | 'time'
    | 'currency';
  width?: string | number;
  minWidth?: number;
}

export interface Components {
  Action?: React.ComponentType<any>;
  Actions?: React.ComponentType<any>;
  Body?: React.ComponentType<any>;
  Cell?: React.ComponentType<any>;
  Container?: React.ComponentType<any>;
  EditField?: React.ComponentType<any>;
  EditRow?: React.ComponentType<any>;
  FilterRow?: React.ComponentType<any>;
  Groupbar?: React.ComponentType<any>;
  GroupRow?: React.ComponentType<any>;
  Header?: React.ComponentType<any>;
  Pagination?: React.ComponentType<any>;
  OverlayLoading?: React.ComponentType<any>;
  OverlayError?: React.ComponentType<any>;
  Row?: React.ComponentType<any>;
  Toolbar?: React.ComponentType<any>;
}

export const MTableAction: (props: any) => React.ReactElement;
export const MTableActions: (props: any) => React.ReactElement;
export const MTableBody: (props: any) => React.ReactElement;
export const MTableBodyRow: (props: any) => React.ReactElement;
export const MTableCell: (props: any) => React.ReactElement;
export const MTableEditField: (props: any) => React.ReactElement;
export const MTableEditRow: (props: any) => React.ReactElement;
export const MTableFilterRow: (props: any) => React.ReactElement;
export const MTableGroupbar: (props: any) => React.ReactElement;
export const MTableGroupRow: (props: any) => React.ReactElement;
export const MTableHeader: (props: any) => React.ReactElement;
export const MTablePagination: (props: any) => React.ReactElement;
export const MTableToolbar: (props: any) => React.ReactElement;
export const MTable: (props: any) => React.ReactElement;

export interface Icons<RowData extends object> {
  Add?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  Check?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  Clear?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  Delete?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  DetailPanel?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement> & { level?: number; row?: RowData };
  Edit?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  Export?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  Filter?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  FirstPage?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  SortArrow?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  LastPage?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  NextPage?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  PreviousPage?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  ResetSearch?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  Search?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  ThirdStateCheck?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  ViewColumn?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
  Retry?: React.ForwardRefExoticComponent<any> &
    React.RefAttributes<SVGSVGElement>;
}

export interface Options<RowData extends object> {
  actionsCellStyle?: React.CSSProperties;
  detailPanelColumnStyle?: React.CSSProperties;
  editCellStyle?: React.CSSProperties;
  // A key to override the default `id` tag to persist state between rerenders
  idSynonym?: string | number;
  actionsColumnIndex?: number;
  addRowPosition?: 'first' | 'last';
  columnsButton?: boolean;
  columnResizable?: boolean;
  defaultExpanded?: boolean | ((rowData: RowData) => boolean);
  debounceInterval?: number;
  detailPanelType?: 'single' | 'multiple';
  doubleHorizontalScroll?: boolean;
  draggable?: boolean;
  emptyRowsWhenPaging?: boolean;
  exportAllData?: boolean;
  exportMenu?: {
    label: string;
    exportFunc: (
      columns: Column<RowData>[],
      renderData: RowData[],
      tableData: {
        searchedData: RowData[];
        filteredData: RowData[];
        groupedData: RowData[];
        selectedData: RowData[];
      }
    ) => void;
  }[];
  filtering?: boolean;
  filterCellStyle?: React.CSSProperties;
  filterRowStyle?: React.CSSProperties;
  fixedColumns?: { left?: number; right?: number };
  groupRowSeparator?: string;
  header?: boolean;
  headerSelectionProps?: CheckboxProps;
  headerStyle?: React.CSSProperties;
  hideFilterIcons?: boolean;
  initialPage?: number;
  loadingType?: 'overlay' | 'linear';
  maxBodyHeight?: number | string;
  minBodyHeight?: number | string;
  numberOfPagesAround?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  padding?: 'default' | 'dense';
  paging?: boolean;
  grouping?: boolean;
  // Allows to override the grouping chip props
  groupChipProps?: ChipProps;
  // Show the sub rows of a group in brackets Name: Dominik (20)
  showGroupingCount?: boolean;
  groupTitle?: (groupData: object) => React.ReactNode;
  overflowY?:
    | 'visible'
    | 'hidden'
    | 'scroll'
    | 'auto'
    | 'initial'
    | 'inherit'
    | 'overlay';
  pageSize?: number;
  pageSizeOptions?: number[];
  paginationAlignment?: React.CSSProperties['justifyContent'];
  paginationType?: 'normal' | 'stepped';
  paginationPosition?: 'bottom' | 'top' | 'both';
  persistentGroupingsId?: string;
  rowStyle?:
    | React.CSSProperties
    | ((data: RowData, index: number, level: number) => React.CSSProperties);
  showEmptyDataSourceMessage?: boolean;
  showFirstLastPageButtons?:
    | boolean
    | Partial<{ first: boolean; last: boolean }>;
  showSelectAllCheckbox?: boolean;
  showSelectGroupCheckbox?: boolean;
  showTitle?: boolean;
  showTextRowsSelected?: boolean;
  showDetailPanelIcon?: boolean;
  search?: boolean;
  searchText?: string;
  searchDebounceDelay?: number;
  searchFieldAlignment?: 'left' | 'right';
  searchFieldStyle?: React.CSSProperties;
  searchFieldVariant?: 'standard' | 'filled' | 'outlined';
  searchAutoFocus?: boolean;
  selection?: boolean;
  selectionProps?: CheckboxProps | ((data: RowData) => CheckboxProps);
  /**
   * @deprecated this property is deprecated use maxColumnSort instead.
   */
  sorting?: boolean;
  keepSortDirectionOnColumnSwitch?: boolean;
  tableLayout?: 'auto' | 'fixed';
  tableWidth?: 'full' | 'variable';
  thirdSortClick?: boolean;
  toolbar?: boolean;
  toolbarButtonAlignment?: 'left' | 'right';
  detailPanelColumnAlignment?: 'left' | 'right';
  detailPanelOffset?: { left?: number; right?: number };
  cspNonce?: string;
  defaultOrderByCollection?: OrderByCollection[];
  maxColumnSort?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | ALL_COLUMNS;
  showColumnSortOrder?: boolean;
  sortOrderIndicatorStyle?: React.CSSProperties;
  /**
   * Allow reordering rows if `true` (default). Set to `false` when original row ordering is to preserved (eg. data sorted from server).
   **/
  clientSorting?: boolean;
}

export interface Localization {
  error?: React.ReactNode;
  body?: {
    dateTimePickerLocalization?: object; // The date-fns locale object applied to the datepickers
    emptyDataSourceMessage?: React.ReactNode;
    filterRow?: {
      filterPlaceHolder?: React.ReactNode;
      filterTooltip?: React.ReactNode;
    };
    editRow?: {
      saveTooltip?: React.ReactNode;
      cancelTooltip?: React.ReactNode;
      deleteText?: React.ReactNode;
    };
    addTooltip?: React.ReactNode;
    deleteTooltip?: React.ReactNode;
    editTooltip?: React.ReactNode;
  };
  header?: {
    actions?: React.ReactNode;
  };
  grouping?: {
    groupedBy?: React.ReactNode;
    placeholder?: React.ReactNode;
  };
  pagination?: {
    firstTooltip?: React.ReactNode;
    firstAriaLabel?: string;
    previousTooltip?: React.ReactNode;
    previousAriaLabel?: string;
    nextTooltip?: React.ReactNode;
    nextAriaLabel?: string;
    labelDisplayedRows?: React.ReactNode;
    labelRowsPerPage?: React.ReactNode;
    lastTooltip?: React.ReactNode;
    lastAriaLabel?: string;
    labelRows?: React.ReactNode;
  };
  toolbar?: {
    addRemoveColumns?: React.ReactNode;
    nRowsSelected?: React.ReactNode | ((rowCount: number) => React.ReactNode);
    showColumnsTitle?: React.ReactNode;
    showColumnsAriaLabel?: string;
    exportTitle?: React.ReactNode;
    exportAriaLabel?: string;
    exportCSVName?: React.ReactNode;
    exportPDFName?: React.ReactNode;
    searchTooltip?: React.ReactNode;
    searchPlaceholder?: React.ReactNode;
    searchAriaLabel?: string;
    clearSearchAriaLabel?: string;
  };
}

export type CellStyle<RowData extends object> =
  | React.CSSProperties
  | ((
      data: any,
      rowData: RowData,
      column?: Column<RowData>
    ) => React.CSSProperties);

export type ColumnSize = {
  field: string;
  width: string;
  widthPx: number;
  id?: string;
  minWidth?: string;
  maxWidth?: string;
};

export default class MaterialTable<
  RowData extends object
> extends React.Component<MaterialTableProps<RowData>> {
  onQueryChange: (
    query: Partial<Query<RowData>>,
    callback?: () => void
  ) => void;
  clearCriteria: () => void;
}
