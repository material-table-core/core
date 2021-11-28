import React from 'react';
import { debounce } from 'debounce';
import equal from 'fast-deep-equal/react';
import {
  Table,
  TableFooter,
  TableRow,
  LinearProgress
} from '@material-ui/core';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import DataManager from '@utils/data-manager';
import * as CommonValues from '@utils/common-values';
import {
  MTablePagination,
  MTableSteppedPagination,
  MTableScrollbar
} from '@components';

export default class MaterialTable extends React.Component {
  dataManager = new DataManager();
  checkedForFunctions = false;
  constructor(props) {
    super(props);

    const calculatedProps = this.getProps(props);
    this.setDataManagerFields(calculatedProps, true);
    const renderState = this.dataManager.getRenderState();

    this.state = {
      data: [],
      errorState: undefined,
      ...renderState,
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
      showAddRow: false,
      bulkEditOpen: false,
      width: 0
    };

    this.tableContainerDiv = React.createRef();
  }

  componentDidMount() {
    this.setState(
      {
        ...this.dataManager.getRenderState(),
        width: this.tableContainerDiv.current.scrollWidth
      },
      () => {
        if (this.isRemoteData()) {
          this.onQueryChange({
            ...this.state.query,
            page: this.props.options.initialPage || 0
          });
        }
        /**
         * THIS WILL NEED TO BE REMOVED EVENTUALLY.
         * Warn consumer of renamed prop.
         */
        if (this.props.onDoubleRowClick !== undefined) {
          console.error(
            'Property `onDoubleRowClick` has been renamed to `onRowDoubleClick`'
          );
        }
      }
    );
  }

  setDataManagerFields(props, isInit, prevColumns) {
    const savedColumns = {};
    if (props.options.persistentGroupingsId) {
      let materialTableGroupings = localStorage.getItem(
        'material-table-groupings'
      );
      if (materialTableGroupings) {
        materialTableGroupings = JSON.parse(materialTableGroupings);

        if (materialTableGroupings[props.options.persistentGroupingsId]) {
          materialTableGroupings[props.options.persistentGroupingsId].forEach(
            (savedGrouping) => {
              savedColumns[savedGrouping.field] = {
                groupOrder: savedGrouping.groupOrder,
                groupSort: savedGrouping.groupSort,
                columnOrder: savedGrouping.columnOrder
              };
            }
          );
        }
      }
    }

    this.dataManager.setColumns(props.columns, prevColumns, savedColumns);
    this.dataManager.setDefaultExpanded(props.options.defaultExpanded);
    this.dataManager.changeRowEditing();

    if (this.isRemoteData(props)) {
      this.dataManager.changeApplySearch(false);
      this.dataManager.changeApplyFilters(false);
      this.dataManager.changeApplySort(false);
    } else {
      this.dataManager.changeApplySearch(true);
      this.dataManager.changeApplyFilters(true);
      this.dataManager.changeApplySort(true);
      this.dataManager.setData(props.data);
    }

    let defaultSortColumnIndex = -1;
    let defaultSortDirection = '';
    let prevSortColumnIndex = -1;
    let prevSortDirection = '';
    if (props && props.options.sorting !== false) {
      defaultSortColumnIndex = props.columns.findIndex(
        (a) => a.defaultSort && a.sorting !== false
      );
      defaultSortDirection =
        defaultSortColumnIndex > -1
          ? props.columns[defaultSortColumnIndex].defaultSort
          : '';
    }
    if (prevColumns) {
      prevSortColumnIndex = prevColumns.findIndex(
        (a) => a.defaultSort && a.sorting !== false
      );
      prevSortDirection =
        prevSortColumnIndex > -1
          ? props.columns[prevSortColumnIndex].defaultSort
          : '';
    }

    // If the default sorting changed and differs from the current default sorting, it will trigger a new sorting
    const shouldReorder =
      isInit ||
      (!this.isRemoteData() &&
        // Only if a defaultSortingDirection is passed, it will evaluate for changes
        defaultSortDirection &&
        // Default sorting has changed
        (defaultSortColumnIndex !== prevSortColumnIndex ||
          defaultSortDirection !== prevSortDirection) &&
        // Default sorting differs from current sorting
        (defaultSortColumnIndex !== this.dataManager.orderBy ||
          defaultSortDirection !== this.dataManager.orderDirection));

    shouldReorder &&
      this.dataManager.changeOrder(
        defaultSortColumnIndex,
        defaultSortDirection
      );
    isInit && this.dataManager.changeSearchText(props.options.searchText || '');
    isInit &&
      this.dataManager.changeSearchDebounce(props.options.searchDebounceDelay);
    isInit &&
      this.dataManager.changeCurrentPage(
        props.options.initialPage ? props.options.initialPage : 0
      );
    isInit && this.dataManager.changePageSize(props.options.pageSize);
    this.dataManager.changePaging(
      this.isRemoteData() ? false : props.options.paging
    );
    isInit && this.dataManager.changeParentFunc(props.parentChildData);
    this.dataManager.changeDetailPanelType(props.options.detailPanelType);
  }

  cleanColumns(columns) {
    return columns.map((col) => {
      const colClone = { ...col };
      delete colClone.tableData;
      return colClone;
    });
  }

  componentDidUpdate(prevProps) {
    // const propsChanged = Object.entries(this.props).reduce((didChange, prop) => didChange || prop[1] !== prevProps[prop[0]], false);

    const fixedPrevColumns = this.cleanColumns(prevProps.columns);
    const fixedPropsColumns = this.cleanColumns(this.props.columns);

    const columnPropsChanged = !equal(fixedPrevColumns, fixedPropsColumns);
    let propsChanged =
      columnPropsChanged || !equal(prevProps.options, this.props.options);
    if (!this.isRemoteData()) {
      propsChanged = propsChanged || !equal(prevProps.data, this.props.data);
    }

    if (propsChanged) {
      const props = this.getProps(this.props);
      this.setDataManagerFields(props, false, prevProps.columns);
      this.setState(this.dataManager.getRenderState());
      if (
        process.env.NODE_ENV === 'development' &&
        columnPropsChanged &&
        !this.checkedForFunctions &&
        prevProps.columns.length !== 0 &&
        props.data[0] &&
        props.data[0].id !== undefined
      ) {
        const bothContainFunctions =
          fixedPropsColumns.some((column) =>
            Object.values(column).some((val) => typeof val === 'function')
          ) &&
          fixedPrevColumns.some((column) =>
            Object.values(column).some((val) => typeof val === 'function')
          );
        if (bothContainFunctions) {
          this.checkedForFunctions = true;
          const currentColumnsWithoutFunctions = functionlessColumns(
            fixedPropsColumns
          );
          const prevColumnsWithoutFunctions = functionlessColumns(
            fixedPrevColumns
          );
          const columnsEqual = equal(
            currentColumnsWithoutFunctions,
            prevColumnsWithoutFunctions
          );
          if (columnsEqual) {
            console.warn(
              'The columns provided to material table are static, but contain functions which update on every render, resetting the table state. Provide a stable function or column reference or an row id to prevent state loss.'
            );
          }
        }
      }
    }

    const count = this.isRemoteData()
      ? this.state.query.totalCount
      : this.state.data.length;
    const currentPage = this.isRemoteData()
      ? this.state.query.page
      : this.state.currentPage;
    const pageSize = this.isRemoteData()
      ? this.state.query.pageSize
      : this.state.pageSize;

    if (count <= pageSize * currentPage && currentPage !== 0) {
      this.onPageChange(null, Math.max(0, Math.ceil(count / pageSize) - 1));
    }
  }

  getProps(props, prevColumns) {
    const calculatedProps = { ...(props || this.props) };
    calculatedProps.components = {
      ...MaterialTable.defaultProps.components,
      ...calculatedProps.components
    };
    calculatedProps.icons = {
      ...MaterialTable.defaultProps.icons,
      ...calculatedProps.icons
    };
    calculatedProps.options = {
      ...MaterialTable.defaultProps.options,
      ...calculatedProps.options
    };

    const localization = {
      ...MaterialTable.defaultProps.localization.body,
      ...calculatedProps.localization.body
    };

    calculatedProps.actions = [...(calculatedProps.actions || [])];

    if (calculatedProps.options.selection) {
      calculatedProps.actions = calculatedProps.actions
        .filter((a) => a)
        .map((action) => {
          if (
            action.position === 'auto' ||
            action.isFreeAction === false ||
            (action.position === undefined && action.isFreeAction === undefined)
          ) {
            if (typeof action === 'function') {
              return { action: action, position: 'toolbarOnSelect' };
            } else return { ...action, position: 'toolbarOnSelect' };
          } else if (action.isFreeAction) {
            if (typeof action === 'function') {
              return { action: action, position: 'toolbar' };
            } else return { ...action, position: 'toolbar' };
          } else return action;
        });
    } else {
      calculatedProps.actions = calculatedProps.actions
        .filter((a) => a)
        .map((action) => {
          if (
            action.position === 'auto' ||
            action.isFreeAction === false ||
            (action.position === undefined && action.isFreeAction === undefined)
          ) {
            if (typeof action === 'function') {
              return { action: action, position: 'row' };
            } else return { ...action, position: 'row' };
          } else if (action.isFreeAction) {
            if (typeof action === 'function') {
              return { action: action, position: 'toolbar' };
            } else return { ...action, position: 'toolbar' };
          } else return action;
        });
    }

    if (calculatedProps.editable) {
      if (calculatedProps.editable.onRowAdd) {
        calculatedProps.actions.push({
          icon: calculatedProps.icons.Add,
          tooltip: localization.addTooltip,
          position: 'toolbar',
          disabled: !!this.dataManager.lastEditingRow,
          onClick: () => {
            this.dataManager.changeRowEditing();
            if (this.state.showAddRow) {
              this.props.editable.onRowAddCancelled &&
                this.props.editable.onRowAddCancelled();
            }
            this.setState({
              ...this.dataManager.getRenderState(),
              showAddRow: !this.state.showAddRow
            });
          }
        });
      }
      if (calculatedProps.editable.onRowUpdate) {
        calculatedProps.actions.push((rowData) => ({
          icon: calculatedProps.icons.Edit,
          tooltip: calculatedProps.editable.editTooltip
            ? calculatedProps.editable.editTooltip(rowData)
            : localization.editTooltip,
          disabled:
            calculatedProps.editable.isEditable &&
            !calculatedProps.editable.isEditable(rowData),
          hidden:
            calculatedProps.editable.isEditHidden &&
            calculatedProps.editable.isEditHidden(rowData),
          onClick: (e, rowData) => {
            this.dataManager.changeRowEditing(rowData, 'update');
            this.setState({
              ...this.dataManager.getRenderState(),
              showAddRow: false
            });
          }
        }));
      }
      if (calculatedProps.editable.onRowDelete) {
        calculatedProps.actions.push((rowData) => ({
          icon: calculatedProps.icons.Delete,
          tooltip: calculatedProps.editable.deleteTooltip
            ? calculatedProps.editable.deleteTooltip(rowData)
            : localization.deleteTooltip,
          disabled:
            calculatedProps.editable.isDeletable &&
            !calculatedProps.editable.isDeletable(rowData),
          hidden:
            calculatedProps.editable.isDeleteHidden &&
            calculatedProps.editable.isDeleteHidden(rowData),
          onClick: (e, rowData) => {
            this.dataManager.changeRowEditing(rowData, 'delete');
            this.setState({
              ...this.dataManager.getRenderState(),
              showAddRow: false
            });
          }
        }));
      }
      if (calculatedProps.editable.onBulkUpdate) {
        calculatedProps.actions.push({
          icon: calculatedProps.icons.Edit,
          tooltip: localization.bulkEditTooltip,
          position: 'toolbar',
          hidden: this.dataManager.bulkEditOpen,
          onClick: () => {
            this.dataManager.changeBulkEditOpen(true);
            this.props.onBulkEditOpen && this.props.onBulkEditOpen(true);
            this.setState(this.dataManager.getRenderState());
          }
        });
        calculatedProps.actions.push({
          icon: calculatedProps.icons.Check,
          tooltip: localization.bulkEditApprove,
          position: 'toolbar',
          hidden: !this.dataManager.bulkEditOpen,
          onClick: () => this.onEditingApproved('bulk')
        });
        calculatedProps.actions.push({
          icon: calculatedProps.icons.Clear,
          tooltip: localization.bulkEditCancel,
          position: 'toolbar',
          hidden: !this.dataManager.bulkEditOpen,
          onClick: () => {
            this.dataManager.changeBulkEditOpen(false);
            this.props.onBulkEditOpen && this.props.onBulkEditOpen(false);
            this.dataManager.clearBulkEditChangedRows();
            this.setState(this.dataManager.getRenderState());
          }
        });
      }
    }

    return calculatedProps;
  }

  isRemoteData = (props) => !Array.isArray((props || this.props).data);

  isOutsidePageNumbers = (props) =>
    props.page !== undefined && props.totalCount !== undefined;

  onAllSelected = (checked) => {
    this.dataManager.changeAllSelected(
      checked,
      this.props.options.selectionProps
    );
    this.setState(this.dataManager.getRenderState(), () =>
      this.onSelectionChange()
    );
  };

  onGroupSelected = (checked, path) => {
    this.dataManager.changeGroupSelected(checked, path);
    this.setState(this.dataManager.getRenderState(), () =>
      this.onSelectionChange()
    );
  };

  onChangeColumnHidden = (column, hidden) => {
    this.dataManager.changeColumnHidden(column, hidden);
    this.setState(this.dataManager.getRenderState(), () => {
      this.props.onChangeColumnHidden &&
        this.props.onChangeColumnHidden(column, hidden);
    });
  };

  onChangeGroupOrder = (groupedColumn) => {
    this.dataManager.changeGroupOrder(groupedColumn.tableData.id);
    this.setState(this.dataManager.getRenderState());
  };

  onChangeOrder = (orderBy, orderDirection) => {
    const newOrderBy = orderDirection === '' ? -1 : orderBy;
    this.dataManager.changeOrder(newOrderBy, orderDirection);

    if (this.isRemoteData()) {
      const query = { ...this.state.query };
      query.page = 0;
      query.orderBy = this.state.columns.find(
        (a) => a.tableData.id === newOrderBy
      );
      query.orderDirection = orderDirection;
      this.onQueryChange(query, () => {
        this.props.onOrderChange &&
          this.props.onOrderChange(newOrderBy, orderDirection);
      });
    } else {
      this.setState(this.dataManager.getRenderState(), () => {
        this.props.onOrderChange &&
          this.props.onOrderChange(newOrderBy, orderDirection);
      });
    }
  };

  onPageChange = (event, page) => {
    if (this.isRemoteData()) {
      const query = { ...this.state.query };
      query.page = page;
      this.onQueryChange(query, () => {
        this.props.onPageChange &&
          this.props.onPageChange(page, query.pageSize);
      });
    } else {
      if (!this.isOutsidePageNumbers(this.props)) {
        this.dataManager.changeCurrentPage(page);
      }
      this.setState(this.dataManager.getRenderState(), () => {
        this.props.onPageChange &&
          this.props.onPageChange(page, this.state.pageSize);
      });
    }
  };

  onRowsPerPageChange = (event) => {
    const pageSize = event.target.value;

    this.dataManager.changePageSize(pageSize);

    this.props.onPageChange && this.props.onPageChange(0, pageSize);

    if (this.isRemoteData()) {
      const query = { ...this.state.query };
      query.pageSize = event.target.value;
      query.page = 0;
      this.onQueryChange(query, () => {
        this.props.onRowsPerPageChange &&
          this.props.onRowsPerPageChange(pageSize);
      });
    } else {
      this.dataManager.changeCurrentPage(0);
      this.setState(this.dataManager.getRenderState(), () => {
        this.props.onRowsPerPageChange &&
          this.props.onRowsPerPageChange(pageSize);
      });
    }
  };

  onDragEnd = (result) => {
    if (!result || !result.source || !result.destination) return;
    this.dataManager.changeByDrag(result);
    this.setState(this.dataManager.getRenderState(), () => {
      if (
        this.props.onColumnDragged &&
        result.destination.droppableId === 'headers' &&
        result.source.droppableId === 'headers'
      ) {
        this.props.onColumnDragged(
          result.source.index,
          result.destination.index
        );
      }
    });
  };

  onGroupExpandChanged = (path) => {
    this.dataManager.changeGroupExpand(path);
    this.setState(this.dataManager.getRenderState());
  };

  onGroupRemoved = (groupedColumn, index) => {
    const result = {
      combine: null,
      destination: { droppableId: 'headers', index: 0 },
      draggableId: groupedColumn.tableData.id,
      mode: 'FLUID',
      reason: 'DROP',
      source: { index, droppableId: 'groups' },
      type: 'DEFAULT'
    };
    this.dataManager.changeByDrag(result);
    this.setState(this.dataManager.getRenderState(), () => {
      this.props.onGroupRemoved &&
        this.props.onGroupRemoved(groupedColumn, index);
    });
  };

  onEditingApproved = (mode, newData, oldData) => {
    if (mode === 'add' && this.props.editable && this.props.editable.onRowAdd) {
      this.setState({ isLoading: true }, () => {
        this.props.editable
          .onRowAdd(newData)
          .then((result) => {
            this.setState({ isLoading: false, showAddRow: false }, () => {
              if (this.isRemoteData()) {
                this.onQueryChange(this.state.query);
              }
            });
          })
          .catch((reason) => {
            const errorState = {
              message: reason,
              errorCause: 'add'
            };
            this.setState({ isLoading: false, errorState });
          });
      });
    } else if (
      mode === 'update' &&
      this.props.editable &&
      this.props.editable.onRowUpdate
    ) {
      this.setState({ isLoading: true }, () => {
        this.props.editable
          .onRowUpdate(newData, oldData)
          .then((result) => {
            this.dataManager.changeRowEditing(oldData);
            this.setState(
              {
                isLoading: false,
                ...this.dataManager.getRenderState()
              },
              () => {
                if (this.isRemoteData()) {
                  this.onQueryChange(this.state.query);
                }
              }
            );
          })
          .catch((reason) => {
            const errorState = {
              message: reason,
              errorCause: 'update'
            };
            this.setState({ isLoading: false, errorState });
          });
      });
    } else if (
      mode === 'delete' &&
      this.props.editable &&
      this.props.editable.onRowDelete
    ) {
      this.setState({ isLoading: true }, () => {
        this.props.editable
          .onRowDelete(oldData)
          .then((result) => {
            this.dataManager.changeRowEditing(oldData);
            this.setState(
              {
                isLoading: false,
                ...this.dataManager.getRenderState()
              },
              () => {
                if (this.isRemoteData()) {
                  this.onQueryChange(this.state.query);
                }
              }
            );
          })
          .catch((reason) => {
            const errorState = {
              message: reason,
              errorCause: 'delete'
            };
            this.setState({ isLoading: false, errorState });
          });
      });
    } else if (
      mode === 'bulk' &&
      this.props.editable &&
      this.props.editable.onBulkUpdate
    ) {
      this.setState({ isLoading: true }, () => {
        this.props.editable
          .onBulkUpdate(this.dataManager.bulkEditChangedRows)
          .then((result) => {
            this.dataManager.changeBulkEditOpen(false);
            this.props.onBulkEditOpen && this.props.onBulkEditOpen(false);
            this.dataManager.clearBulkEditChangedRows();
            this.setState(
              {
                isLoading: false,
                ...this.dataManager.getRenderState()
              },
              () => {
                if (this.isRemoteData()) {
                  this.onQueryChange(this.state.query);
                }
              }
            );
          })
          .catch((reason) => {
            const errorState = {
              message: reason,
              errorCause: 'bulk edit'
            };
            this.setState({ isLoading: false, errorState });
          });
      });
    }
  };

  onEditingCanceled = (mode, rowData) => {
    if (mode === 'add') {
      this.props.editable.onRowAddCancelled &&
        this.props.editable.onRowAddCancelled();
      this.setState({ showAddRow: false });
    } else if (mode === 'update') {
      this.props.editable.onRowUpdateCancelled &&
        this.props.editable.onRowUpdateCancelled();
      this.dataManager.changeRowEditing(rowData);
      this.setState(this.dataManager.getRenderState());
    } else if (mode === 'delete') {
      this.dataManager.changeRowEditing(rowData);
      this.setState(this.dataManager.getRenderState());
    }
  };

  retry = () => {
    this.onQueryChange(this.state.query);
  };

  onQueryChange = (query, callback) => {
    query = { ...this.state.query, ...query, error: this.state.errorState };
    this.setState({ isLoading: true, errorState: undefined }, () => {
      this.props
        .data(query)
        .then((result) => {
          query.totalCount = result.totalCount;
          query.page = result.page;
          const nextQuery = {
            ...query,
            totalCount: result.totalCount,
            page: result.page
          };
          this.dataManager.setData(result.data);
          this.setState(
            {
              isLoading: false,
              errorState: false,
              ...this.dataManager.getRenderState(),
              query: nextQuery
            },
            () => {
              callback && callback();
            }
          );
        })
        .catch((error) => {
          const localization = {
            ...MaterialTable.defaultProps.localization,
            ...this.props.localization
          };
          const errorState = {
            message:
              typeof error === 'object'
                ? error.message
                : error !== undefined
                ? error
                : localization.error,
            errorCause: 'query'
          };
          this.setState({
            isLoading: false,
            errorState,
            ...this.dataManager.getRenderState()
          });
        });
    });
  };

  onRowSelected = (event, path, dataClicked) => {
    this.dataManager.changeRowSelected(event.target.checked, path);
    this.setState(this.dataManager.getRenderState(), () =>
      this.onSelectionChange(dataClicked)
    );
  };

  onSelectionChange = (dataClicked) => {
    if (this.props.onSelectionChange) {
      const selectedRows = [];

      const findSelecteds = (list) => {
        list.forEach((row) => {
          if (row.tableData.checked) {
            selectedRows.push(row);
          }
        });
      };

      findSelecteds(this.state.originalData);
      this.props.onSelectionChange(selectedRows, dataClicked);
    }
  };

  onSearchChangeDebounce = debounce((searchText) => {
    if (this.isRemoteData()) {
      const query = { ...this.state.query };
      query.page = 0;
      query.search = searchText;

      this.onQueryChange(query, () => {
        this.props.onSearchChange && this.props.onSearchChange(searchText);
      });
    } else {
      this.setState(this.dataManager.getRenderState(), () => {
        this.props.onSearchChange && this.props.onSearchChange(searchText);
      });
    }
  }, this.props.options.debounceInterval);

  onFilterChange = (columnId, value) => {
    this.dataManager.changeFilterValue(columnId, value);
    this.setState({}, this.onFilterChangeDebounce);
  };

  onFilterChangeDebounce = debounce(() => {
    if (this.isRemoteData()) {
      const query = { ...this.state.query };
      query.page = 0;
      query.filters = this.state.columns
        .filter((a) => a.tableData.filterValue)
        .map((a) => ({
          column: a,
          operator: '=',
          value: a.tableData.filterValue
        }));

      this.onQueryChange(query, () => {
        this.props.onFilterChange && this.props.onFilterChange(query.filters);
      });
    } else {
      this.setState(this.dataManager.getRenderState(), () => {
        if (this.props.onFilterChange) {
          const appliedFilters = this.state.columns
            .filter((a) => a.tableData.filterValue)
            .map((a) => ({
              column: a,
              operator: '=',
              value: a.tableData.filterValue
            }));
          this.props.onFilterChange(appliedFilters);
        }
      });
    }
  }, this.props.options.debounceInterval);

  onTreeExpandChanged = (path, data) => {
    this.dataManager.changeTreeExpand(path);
    this.setState(this.dataManager.getRenderState(), () => {
      this.props.onTreeExpandChange &&
        this.props.onTreeExpandChange(data, data.tableData.isTreeExpanded);
    });
  };

  onToggleDetailPanel = (path, render) => {
    this.dataManager.changeDetailPanelVisibility(path, render);
    this.setState(this.dataManager.getRenderState());
  };

  onCellEditStarted = (rowData, columnDef) => {
    this.dataManager.startCellEditable(rowData, columnDef);
    this.setState(this.dataManager.getRenderState());
  };

  onCellEditFinished = (rowData, columnDef) => {
    this.dataManager.finishCellEditable(rowData, columnDef);
    this.setState(this.dataManager.getRenderState());
  };

  onEditRowDataChanged = (rowData, newData) => {
    this.dataManager.setEditRowData(rowData, newData);
    this.setState(this.dataManager.getRenderState());
  };

  onColumnResized = (id, additionalWidth) => {
    this.dataManager.onColumnResized(id, additionalWidth);
    this.setState(this.dataManager.getRenderState());
  };

  renderFooter() {
    const props = this.getProps();
    if (props.options.paging) {
      const localization = {
        ...MaterialTable.defaultProps.localization.pagination,
        ...this.props.localization.pagination
      };

      const isOutsidePageNumbers = this.isOutsidePageNumbers(props);
      const currentPage = isOutsidePageNumbers
        ? Math.min(
            props.page,
            Math.floor(props.totalCount / this.state.pageSize)
          )
        : this.state.currentPage;
      const totalCount = isOutsidePageNumbers
        ? props.totalCount
        : this.state.data.length;

      return (
        <Table>
          <TableFooter style={{ display: 'grid' }}>
            <TableRow>
              <props.components.Pagination
                classes={{
                  root: props.classes.paginationRoot,
                  toolbar: props.classes.paginationToolbar,
                  caption: props.classes.paginationCaption,
                  selectRoot: props.classes.paginationSelectRoot
                }}
                style={{
                  float: props.theme.direction === 'rtl' ? '' : 'right',
                  overflowX: 'auto'
                }}
                colSpan={3}
                count={
                  this.isRemoteData() ? this.state.query.totalCount : totalCount
                }
                icons={props.icons}
                rowsPerPage={this.state.pageSize}
                rowsPerPageOptions={props.options.pageSizeOptions}
                SelectProps={{
                  renderValue: (value) => (
                    <div style={{ padding: '0px 5px' }}>
                      {value + ' ' + localization.labelRowsSelect + ' '}
                    </div>
                  )
                }}
                page={this.isRemoteData() ? this.state.query.page : currentPage}
                onPageChange={this.onPageChange}
                onRowsPerPageChange={this.onRowsPerPageChange}
                ActionsComponent={(subProps) =>
                  props.options.paginationType === 'normal' ? (
                    <MTablePagination
                      {...subProps}
                      icons={props.icons}
                      localization={localization}
                      showFirstLastPageButtons={
                        props.options.showFirstLastPageButtons
                      }
                    />
                  ) : (
                    <MTableSteppedPagination
                      {...subProps}
                      icons={props.icons}
                      localization={localization}
                      showFirstLastPageButtons={
                        props.options.showFirstLastPageButtons
                      }
                    />
                  )
                }
                labelDisplayedRows={(row) =>
                  localization.labelDisplayedRows
                    .replace('{from}', row.from)
                    .replace('{to}', row.to)
                    .replace('{count}', row.count)
                }
                labelRowsPerPage={localization.labelRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      );
    }
  }

  renderTable = (props) => (
    <Table
      style={{
        tableLayout:
          props.options.fixedColumns &&
          (props.options.fixedColumns.left || props.options.fixedColumns.right)
            ? 'fixed'
            : props.options.tableLayout
      }}
    >
      {props.options.header && (
        <props.components.Header
          actions={props.actions}
          localization={{
            ...MaterialTable.defaultProps.localization.header,
            ...this.props.localization.header
          }}
          columns={this.state.columns}
          hasSelection={props.options.selection}
          headerStyle={props.options.headerStyle}
          icons={props.icons}
          selectedCount={this.state.selectedCount}
          dataCount={
            props.parentChildData
              ? this.state.treefiedDataLength
              : this.state.columns.filter(
                  (col) => col.tableData.groupOrder > -1
                ).length > 0
              ? this.state.groupedDataLength
              : this.state.data.length
          }
          hasDetailPanel={!!props.detailPanel}
          detailPanelColumnAlignment={props.options.detailPanelColumnAlignment}
          showActionsColumn={
            !this.dataManager.bulkEditOpen &&
            props.actions &&
            props.actions.filter(
              (a) => a.position === 'row' || typeof a === 'function'
            ).length > 0
          }
          showSelectAllCheckbox={props.options.showSelectAllCheckbox}
          showSelectGroupCheckbox={props.options.showSelectGroupCheckbox}
          orderBy={this.state.orderBy}
          orderDirection={this.state.orderDirection}
          onAllSelected={this.onAllSelected}
          onOrderChange={this.onChangeOrder}
          actionsHeaderIndex={props.options.actionsColumnIndex}
          sorting={props.options.sorting}
          keepSortDirectionOnColumnSwitch={
            props.options.keepSortDirectionOnColumnSwitch
          }
          grouping={props.options.grouping}
          isTreeData={this.props.parentChildData !== undefined}
          draggable={props.options.draggable}
          thirdSortClick={props.options.thirdSortClick}
          treeDataMaxLevel={this.state.treeDataMaxLevel}
          options={props.options}
          onColumnResized={this.onColumnResized}
          scrollWidth={this.state.width}
        />
      )}
      <props.components.Body
        actions={props.actions}
        components={props.components}
        icons={props.icons}
        renderData={this.state.renderData}
        data={this.state.data}
        renderSummaryRow={this.props.renderSummaryRow}
        currentPage={this.state.currentPage}
        initialFormData={props.initialFormData}
        pageSize={this.state.pageSize}
        columns={this.state.columns}
        errorState={this.state.errorState}
        detailPanel={props.detailPanel}
        options={props.options}
        getFieldValue={this.dataManager.getFieldValue}
        isTreeData={this.props.parentChildData !== undefined}
        onFilterChanged={this.onFilterChange}
        onRowSelected={this.onRowSelected}
        onGroupSelected={this.onGroupSelected}
        onToggleDetailPanel={this.onToggleDetailPanel}
        onGroupExpandChanged={this.onGroupExpandChanged}
        onTreeExpandChanged={this.onTreeExpandChanged}
        onEditingCanceled={this.onEditingCanceled}
        onEditingApproved={this.onEditingApproved}
        localization={{
          ...MaterialTable.defaultProps.localization.body,
          ...this.props.localization.body
        }}
        onRowClick={this.props.onRowClick}
        onRowDoubleClick={this.props.onRowDoubleClick}
        showAddRow={this.state.showAddRow}
        hasAnyEditingRow={
          !!(this.state.lastEditingRow || this.state.showAddRow)
        }
        hasDetailPanel={!!props.detailPanel}
        treeDataMaxLevel={this.state.treeDataMaxLevel}
        cellEditable={props.cellEditable}
        onCellEditStarted={this.onCellEditStarted}
        onCellEditFinished={this.onCellEditFinished}
        bulkEditOpen={this.dataManager.bulkEditOpen}
        bulkEditChangedRows={this.dataManager.bulkEditChangedRows}
        onBulkEditRowChanged={this.dataManager.onBulkEditRowChanged}
        scrollWidth={this.state.width}
      />
    </Table>
  );

  getColumnsWidth = (props, count) => {
    const result = [];

    const actionsWidth = CommonValues.actionsColumnWidth(props);
    if (actionsWidth > 0) {
      if (
        count > 0 &&
        props.options.actionsColumnIndex >= 0 &&
        props.options.actionsColumnIndex < count
      ) {
        result.push(actionsWidth + 'px');
      } else if (
        count < 0 &&
        props.options.actionsColumnIndex < 0 &&
        props.options.actionsColumnIndex >= count
      ) {
        result.push(actionsWidth + 'px');
      }
    }

    // add selection action width only for left container div
    if (props.options.selection && count > 0) {
      const selectionWidth = CommonValues.selectionMaxWidth(
        props,
        this.state.treeDataMaxLevel
      );
      result.push(selectionWidth + 'px');
    }

    for (let i = 0; i < Math.abs(count) && i < this.state.columns.length; i++) {
      const colDef = this.state.columns[
        count >= 0 ? i : this.state.columns.length - 1 - i
      ];
      if (colDef.tableData) {
        if (typeof colDef.tableData.width === 'number') {
          result.push(colDef.tableData.width + 'px');
        } else {
          result.push(colDef.tableData.width);
        }
      }
    }

    return 'calc(' + result.join(' + ') + ')';
  };

  render() {
    const props = this.getProps();
    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
        nonce={props.options.cspNonce}
      >
        <props.components.Container
          style={{ position: 'relative', ...props.style }}
        >
          {props.options.paginationPosition === 'top' ||
          props.options.paginationPosition === 'both'
            ? this.renderFooter()
            : null}
          {props.options.toolbar && (
            <props.components.Toolbar
              actions={props.actions}
              components={props.components}
              selectedRows={
                this.state.selectedCount > 0
                  ? this.state.originalData.filter((a) => {
                      return a.tableData.checked;
                    })
                  : []
              }
              columns={this.state.columns}
              columnsButton={props.options.columnsButton}
              icons={props.icons}
              exportAllData={props.options.exportAllData}
              exportMenu={props.options.exportMenu}
              getFieldValue={this.dataManager.getFieldValue}
              data={this.state.data}
              renderData={this.state.renderData}
              search={props.options.search}
              showTitle={props.options.showTitle}
              showTextRowsSelected={props.options.showTextRowsSelected}
              toolbarButtonAlignment={props.options.toolbarButtonAlignment}
              searchFieldAlignment={props.options.searchFieldAlignment}
              searchAutoFocus={props.options.searchAutoFocus}
              searchFieldStyle={props.options.searchFieldStyle}
              searchFieldVariant={props.options.searchFieldVariant}
              title={props.title}
              searchText={this.dataManager.searchText}
              searchDebounceDelay={this.dataManager.searchDebounceDelay}
              onSearchChanged={this.onSearchChangeDebounce}
              isRemoteData={this.isRemoteData()}
              dataManager={this.dataManager}
              onColumnsChanged={this.onChangeColumnHidden}
              localization={{
                ...MaterialTable.defaultProps.localization.toolbar,
                ...this.props.localization.toolbar
              }}
            />
          )}
          {props.options.grouping && (
            <props.components.Groupbar
              icons={props.icons}
              localization={{
                ...MaterialTable.defaultProps.localization.grouping,
                ...props.localization.grouping
              }}
              groupColumns={this.state.columns
                .filter((col) => col.tableData.groupOrder > -1)
                .sort(
                  (col1, col2) =>
                    col1.tableData.groupOrder - col2.tableData.groupOrder
                )}
              onSortChanged={this.onChangeGroupOrder}
              onGroupRemoved={this.onGroupRemoved}
              persistentGroupingsId={props.options.persistentGroupingsId}
            />
          )}
          <MTableScrollbar double={props.options.doubleHorizontalScroll}>
            <Droppable droppableId="headers" direction="horizontal">
              {(provided, snapshot) => {
                const table = this.renderTable(props);
                return (
                  <div ref={provided.innerRef}>
                    <div
                      ref={this.tableContainerDiv}
                      style={{
                        maxHeight: props.options.maxBodyHeight,
                        minHeight: props.options.minBodyHeight,
                        overflowY: props.options.overflowY
                      }}
                    >
                      {this.state.width &&
                      props.options.fixedColumns &&
                      props.options.fixedColumns.right ? (
                        <div
                          style={{
                            width: this.getColumnsWidth(
                              props,
                              -1 * props.options.fixedColumns.right
                            ),
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            boxShadow: '-2px 0px 15px rgba(125,147,178,.25)',
                            overflowX: 'clip',
                            zIndex: 11
                          }}
                        >
                          <div
                            style={{
                              width: this.state.width,
                              background: 'white',
                              transform: `translateX(calc(${this.getColumnsWidth(
                                props,
                                -1 * props.options.fixedColumns.right
                              )} - 100%))`
                            }}
                          >
                            {table}
                          </div>
                        </div>
                      ) : null}

                      <div>{table}</div>

                      {this.state.width &&
                      props.options.fixedColumns &&
                      props.options.fixedColumns.left ? (
                        <div
                          style={{
                            width: this.getColumnsWidth(
                              props,
                              props.options.fixedColumns.left
                            ),
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            boxShadow: '2px 0px 15px rgba(125,147,178,.25)',
                            overflowX: 'hidden',
                            zIndex: 11
                          }}
                        >
                          <div
                            style={{
                              width: this.state.width,
                              background: 'white'
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Tab') {
                                e.preventDefault();
                              }
                            }}
                          >
                            {table}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </MTableScrollbar>
          {(this.state.isLoading || props.isLoading) &&
            props.options.loadingType === 'linear' && (
              <div style={{ position: 'relative', width: '100%' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%'
                  }}
                >
                  <LinearProgress />
                </div>
              </div>
            )}
          {props.options.paginationPosition === 'bottom' ||
          props.options.paginationPosition === 'both'
            ? this.renderFooter()
            : null}

          {(this.state.isLoading || props.isLoading) &&
            props.options.loadingType === 'overlay' && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: '100%',
                  zIndex: 11
                }}
              >
                <props.components.OverlayLoading theme={props.theme} />
              </div>
            )}
          {this.state.errorState &&
            this.state.errorState.errorCause === 'query' && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: '100%',
                  zIndex: 11
                }}
              >
                <props.components.OverlayError
                  error={this.state.errorState}
                  retry={this.retry}
                  theme={props.theme}
                  icon={props.icons.Retry}
                />
              </div>
            )}
        </props.components.Container>
      </DragDropContext>
    );
  }
}

function functionlessColumns(columns) {
  return columns.map((col) =>
    Object.entries(col).reduce((obj, [key, val]) => {
      if (typeof val !== 'function') {
        obj[key] = val;
      }
      return obj;
    }, {})
  );
}
