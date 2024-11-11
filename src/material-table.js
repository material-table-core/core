import React from 'react';
import { debounce } from 'debounce';
import deepEql from 'deep-eql';
import * as CommonValues from './utils/common-values';
import {
  Table,
  TableFooter,
  TableRow,
  LinearProgress,
  Box
} from '@mui/material';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import DataManager from '@utils/data-manager';
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
            operator: a.tableData.filterOperator,
            value: a.tableData.filterValue
          })),
        orderBy: renderState.columns.find(
          (a) => a.tableData.id === renderState.orderBy
        ),
        orderDirection: renderState.orderDirection,
        orderByCollection: renderState.orderByCollection,
        page: 0,
        pageSize: calculatedProps.options.pageSize,
        search: renderState.searchText,
        totalCount: 0
      },
      showAddRow: false,
      bulkEditOpen: false,
      width: 0,
      tableInitialWidthPx: undefined,
      tableStyleWidth: '100%',
      actions: calculatedProps.actions
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
          console.warn(
            'Property `onDoubleRowClick` has been renamed to `onRowDoubleClick`'
          );
        }
        /**
         * THIS WILL NEED TO BE REMOVED EVENTUALLY.
         * Warn consumer of deprecated prop.
         */
        if (this.props.options.sorting !== undefined) {
          console.warn(
            'Property `sorting` has been deprecated, please start using `maxColumnSort` instead. https://github.com/material-table-core/core/pull/619'
          );
        }
      }
    );
  }

  setDataManagerFields(props, isInit, prevColumns) {
    const savedColumns = {};
    if (props.options.persistentGroupingsId && localStorage) {
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

    this.dataManager.setTableWidth(props.options.tableWidth ?? 'full');
    this.dataManager.setColumns(props.columns, prevColumns, savedColumns);
    this.dataManager.setDefaultExpanded(props.options.defaultExpanded);
    this.dataManager.changeRowEditing();

    const { clientSorting, grouping, maxColumnSort } = props.options;
    this.dataManager.setClientSorting(clientSorting);
    this.dataManager.setMaxColumnSort(grouping ? 1 : maxColumnSort);
    this.dataManager.setOrderByCollection();

    if (this.isRemoteData(props)) {
      this.dataManager.changeApplySearch(false);
      this.dataManager.changeApplyFilters(false);
      this.dataManager.changeApplySort(false);
    } else {
      this.dataManager.changeApplySearch(true);
      this.dataManager.changeApplyFilters(true);
      this.dataManager.changeApplySort(true);
      this.dataManager.setData(props.data, props.options.idSynonym);
    }

    const prevDefaultOrderByCollection =
      this.dataManager.getDefaultOrderByCollection();
    const { defaultOrderByCollection } = props.options;
    let defaultCollectionSort = [];
    let defaultSort = '';
    let prevSort = '';

    if (defaultOrderByCollection && defaultOrderByCollection.length > 0) {
      defaultCollectionSort = [...defaultOrderByCollection].slice(
        0,
        maxColumnSort
      );
      defaultCollectionSort = this.dataManager.sortOrderCollection(
        defaultCollectionSort
      );

      defaultSort = JSON.stringify(defaultCollectionSort);
      prevSort = JSON.stringify(prevDefaultOrderByCollection);

      if (defaultSort !== prevSort) {
        this.dataManager.setDefaultOrderByCollection(defaultCollectionSort);
      }
    } else {
      const defaultSorts = getDefaultCollectionSort(
        props.columns,
        prevColumns,
        this.dataManager.maxColumnSort
      );
      defaultCollectionSort = [...defaultSorts[0]];
      defaultSort = JSON.stringify(defaultCollectionSort);
      prevSort = JSON.stringify([...defaultSorts[1]]);
    }

    const currentSort = JSON.stringify(this.dataManager.orderByCollection);
    // If the default sorting changed and differs from the current default sorting, it will trigger a new sorting
    const shouldReorder =
      isInit ||
      (!this.isRemoteData() &&
        // Only if a defaultSortingDirection is passed, it will evaluate for changes
        defaultCollectionSort.length &&
        // Default sorting has changed
        defaultSort !== prevSort &&
        // Default sorting differs from current sorting
        defaultSort !== currentSort);

    if (
      shouldReorder &&
      defaultCollectionSort.length > 0 &&
      maxColumnSort > 0
    ) {
      defaultCollectionSort.forEach(({ orderBy, orderDirection, sortOrder }) =>
        this.dataManager.changeColumnOrder(orderBy, orderDirection, sortOrder)
      );
    }

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

    const columnPropsChanged = !deepEql(fixedPrevColumns, fixedPropsColumns);
    let propsChanged =
      columnPropsChanged || !deepEql(prevProps.options, this.props.options);
    if (!this.isRemoteData()) {
      propsChanged = propsChanged || !deepEql(prevProps.data, this.props.data);
    }

    if (prevProps.options.pageSize !== this.props.options.pageSize) {
      this.dataManager.changePageSize(this.props.options.pageSize);
    }

    if (propsChanged) {
      const props = this.getProps(this.props);
      this.setDataManagerFields(props, false, prevProps.columns);
      this.setState({
        ...this.dataManager.getRenderState(),
        actions: props.actions
      });
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

    if (
      count <= pageSize * currentPage &&
      currentPage !== 0 &&
      !this.state.isLoading
    ) {
      this.onPageChange(null, Math.max(0, Math.ceil(count / pageSize) - 1));
    }
  }

  getProps(props) {
    const calculatedProps = { ...(props || this.props) };

    const localization = this.props.localization.body;

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
            this.onRowEditStarted(rowData);
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
          disabled:
            calculatedProps.isBulkEditable && calculatedProps.isBulkEditable(),
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

      // If only bulk update and add row are used, the columns do not align with the action column
      if (
        this.state?.showAddRow &&
        calculatedProps.editable.onRowAdd &&
        calculatedProps.actions.filter((action) => action.position === 'row')
          .length === 0
      ) {
        calculatedProps.actions.push({
          icon: undefined,
          position: 'row',
          onClick: () => {},
          disabled: true
        });
      }
    }
    return calculatedProps;
  }

  clearCriteria = () => {
    this.dataManager.clearCriteria();
    this.setState(this.dataManager.getRenderState());
  };

  isRemoteData = (props) => !Array.isArray((props || this.props).data);

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

  onChangeOrder = (orderBy, orderDirection, sortOrder) => {
    this.dataManager.changeColumnOrder(orderBy, orderDirection, sortOrder);
    const orderByCollection = this.dataManager.getOrderByCollection();

    if (this.isRemoteData()) {
      const query = { ...this.state.query };
      query.page = 0;
      query.orderBy = this.state.columns.find(
        (a) => a.tableData.id === orderBy
      );
      query.orderDirection = orderDirection;
      /**
       * THIS WILL NEED TO BE REMOVED EVENTUALLY.
       * Warn consumer of deprecated prop.
       */
      if (query.orderDirection !== undefined || query.orderBy !== undefined) {
        console.warn(
          'Properties orderBy and orderDirection had been deprecated when remote data, please start using orderByCollection instead'
        );
      }
      query.orderByCollection = orderByCollection;
      this.onQueryChange(query, () => {
        this.props.onOrderChange &&
          this.props.onOrderChange(orderBy, orderDirection);
        this.props.onOrderCollectionChange &&
          this.props.onOrderCollectionChange(orderByCollection);
      });
    } else {
      this.setState(this.dataManager.getRenderState(), () => {
        this.props.onOrderChange &&
          this.props.onOrderChange(orderBy, orderDirection);
        this.props.onOrderCollectionChange &&
          this.props.onOrderCollectionChange(orderByCollection);
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
      this.dataManager.changeCurrentPage(page);
      this.setState(this.dataManager.getRenderState(), () => {
        this.props.onPageChange &&
          this.props.onPageChange(page, this.state.pageSize);
      });
    }
  };

  onRowsPerPageChange = (event) => {
    const pageSize = event.target.value;

    this.dataManager.changePageSize(pageSize);
    const callback = () => {
      this.props.onPageChange && this.props.onPageChange(0, pageSize);
      this.props.onRowsPerPageChange &&
        this.props.onRowsPerPageChange(pageSize);
    };

    if (this.isRemoteData()) {
      const query = { ...this.state.query };
      query.pageSize = event.target.value;
      query.page = 0;
      this.onQueryChange(query, callback);
    } else {
      this.dataManager.changeCurrentPage(0);
      this.setState(this.dataManager.getRenderState(), callback);
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
          .onRowDelete(
            Object.entries(oldData).reduce((old, [key, val]) => {
              if (key !== 'tableData') old[key] = val;
              return old;
            }, {})
          )
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
        this.props.editable.onRowAddCancelled(rowData);
      this.setState({ showAddRow: false });
    } else if (mode === 'update') {
      this.props.editable.onRowUpdateCancelled &&
        this.props.editable.onRowUpdateCancelled(rowData);
      this.dataManager.changeRowEditing(rowData);
      this.setState(this.dataManager.getRenderState());
    } else if (mode === 'delete') {
      this.props.editable.onRowDeleteCancelled &&
        this.props.editable.onRowDeleteCancelled(rowData);
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
          this.dataManager.setData(result.data, this.props.options.idSynonym);
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
          const errorState = {
            message:
              typeof error === 'object'
                ? error.message
                : error !== undefined
                ? error
                : this.props.localization.error,
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

  onFilterChange = (columnId, value, operator = '=') => {
    this.dataManager.changeFilterValue(columnId, value);
    this.dataManager.changeFilterOperator(columnId, operator);
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
          operator: a.tableData.filterOperator,
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
              operator: a.tableData.filterOperator,
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
    const row = this.dataManager.changeDetailPanelVisibility(path, render);
    this.setState(this.dataManager.getRenderState());
    this.props.onTreeExpandChange &&
      this.props.onDetailPanelChange(
        row,
        row.tableData.showDetailPanel ? 'open' : 'closed'
      );
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

  onColumnResized = (
    id,
    offset,
    changedColumnWidthsBeforeOffset,
    initialColWidths
  ) => {
    const colInfo = (col) => ({
      field: col.field,
      width: col.tableData.width,
      widthPx: col.tableData.widthPx,
      ...(col.id && { id: col.id }),
      ...(col.minWidth && { minWidth: col.minWidth }),
      ...(col.maxWidth && { maxWidth: col.maxWidth })
    });
    const colsResized = this.dataManager.onColumnResized(
      id,
      offset,
      changedColumnWidthsBeforeOffset,
      initialColWidths
    );
    this.setState(this.dataManager.getRenderState(), () => {
      if (
        offset === 0 &&
        this.props.onColumnResized &&
        colsResized.length > 0
      ) {
        this.props.onColumnResized(
          colsResized.map((col) => colInfo(col)),
          this.state.columns.map((col) => colInfo(col))
        );
      }
    });
  };

  renderFooter() {
    const props = this.getProps();
    if (props.options.paging) {
      const currentPage = this.isRemoteData()
        ? Math.min(
            props.page,
            Math.floor(props.totalCount / this.state.pageSize)
          )
        : this.state.currentPage;
      const totalCount = this.isRemoteData()
        ? props.totalCount
        : this.state.data.length;
      return (
        <Table>
          <TableFooter style={{ display: 'grid' }}>
            <TableRow style={{ display: 'grid' }}>
              <props.components.Pagination
                sx={{
                  display: 'flex',
                  justifyContent: props.options.paginationAlignment
                    ? props.options.paginationAlignment
                    : 'flex-end',
                  overflowX: 'auto',
                  '& .MuiTablePagination-displayedRows': {
                    display: 'none'
                  }
                }}
                colSpan={3}
                count={
                  this.isRemoteData() ? this.state.query.totalCount : totalCount
                }
                rowsPerPage={this.state.pageSize}
                rowsPerPageOptions={props.options.pageSizeOptions}
                SelectProps={{
                  renderValue: (value) => (
                    <Box sx={{ padding: '0px 5px' }}>
                      {value +
                        ' ' +
                        props.localization.pagination.labelRows +
                        ' '}
                    </Box>
                  )
                }}
                page={this.isRemoteData() ? this.state.query.page : currentPage}
                onPageChange={this.onPageChange}
                onRowsPerPageChange={this.onRowsPerPageChange}
                ActionsComponent={(subProps) =>
                  props.options.paginationType === 'normal' ? (
                    <MTablePagination
                      {...subProps}
                      showFirstLastPageButtons={
                        props.options.showFirstLastPageButtons
                      }
                    />
                  ) : (
                    <MTableSteppedPagination
                      {...subProps}
                      showFirstLastPageButtons={
                        props.options.showFirstLastPageButtons
                      }
                      numberOfPagesAround={props.options.numberOfPagesAround}
                    />
                  )
                }
                labelRowsPerPage={
                  props.localization.pagination.labelRowsPerPage
                }
              />
            </TableRow>
          </TableFooter>
        </Table>
      );
    }
  }

  renderTable = (props) => (
    <Table
      sx={props.sx}
      style={{
        ...(props.options.tableWidth === 'variable' && {
          width: this.state.tableStyleWidth
        }),
        tableLayout:
          props.options.fixedColumns &&
          (props.options.fixedColumns.left || props.options.fixedColumns.right)
            ? 'fixed'
            : props.options.tableLayout
      }}
    >
      {props.options.header && (
        <props.components.Header
          actions={this.state.actions}
          columns={this.state.columns}
          selectedCount={this.state.selectedCount}
          dataCount={
            props.parentChildData
              ? this.dataManager.searchedData.length
              : this.state.columns.some((col) => col.tableData.groupOrder > -1)
              ? this.state.groupedDataLength
              : this.state.data.length
          }
          hasDetailPanel={!!props.detailPanel}
          showActionsColumn={
            !this.dataManager.bulkEditOpen &&
            this.state.actions &&
            this.state.actions.some(
              (a) => a.position === 'row' || typeof a === 'function'
            )
          }
          onAllSelected={this.onAllSelected}
          onOrderChange={this.onChangeOrder}
          isTreeData={this.props.parentChildData !== undefined}
          treeDataMaxLevel={this.state.treeDataMaxLevel}
          onColumnResized={this.onColumnResized}
          scrollWidth={this.state.width}
          sorting={
            props.options.sorting || this.dataManager.maxColumnSort !== 0
          }
          allowSorting={this.dataManager.maxColumnSort !== 0}
          orderByCollection={this.dataManager.getOrderByCollection()}
          tableWidth={props.options.tableWidth ?? 'full'}
        />
      )}
      <props.components.Body
        actions={this.state.actions}
        components={this.props.components}
        renderData={this.state.renderData}
        data={this.state.data}
        renderSummaryRow={this.props.renderSummaryRow}
        currentPage={this.isRemoteData() ? 0 : this.state.currentPage}
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
        onRowEditStarted={this.onRowEditStarted}
        bulkEditOpen={this.dataManager.bulkEditOpen}
        bulkEditChangedRows={this.dataManager.bulkEditChangedRows}
        onBulkEditRowChanged={this.dataManager.onBulkEditRowChanged}
        scrollWidth={this.state.width}
      />
    </Table>
  );

  onRowEditStarted = (rowData) => {
    if (!this.props.editable?.onRowUpdate) {
      return;
    }
    this.dataManager.changeRowEditing(rowData, 'update');
    this.setState({
      ...this.dataManager.getRenderState(),
      showAddRow: false
    });
  };

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
      const colDef =
        this.state.columns[count >= 0 ? i : this.state.columns.length - 1 - i];
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

  getRenderData = () =>
    this.props.options.exportAllData ? this.state.data : this.state.renderData;

  render() {
    const props = this.getProps();
    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
        nonce={props.options.cspNonce}
      >
        <this.props.components.Container
          style={{ position: 'relative', ...props.style }}
        >
          {props.options.paginationPosition === 'top' ||
          props.options.paginationPosition === 'both'
            ? this.renderFooter()
            : null}
          {props.options.toolbar && (
            <this.props.components.Toolbar
              actions={props.actions}
              components={this.props.components}
              originalData={this.state.originalData}
              columns={this.state.columns}
              selectedCount={this.state.selectedCount}
              getFieldValue={this.dataManager.getFieldValue}
              data={this.getRenderData}
              title={props.title}
              searchText={this.dataManager.searchText}
              searchDebounceDelay={this.dataManager.searchDebounceDelay}
              onSearchChanged={this.onSearchChangeDebounce}
              isRemoteData={this.isRemoteData()}
              dataManager={this.dataManager}
              onColumnsChanged={this.onChangeColumnHidden}
            />
          )}
          {props.options.grouping && (
            <this.props.components.Groupbar
              groupColumns={this.state.columns
                .filter((col) => col.tableData.groupOrder > -1)
                .sort(
                  (col1, col2) =>
                    col1.tableData.groupOrder - col2.tableData.groupOrder
                )}
              onSortChanged={this.onChangeGroupOrder}
              onGroupRemoved={this.onGroupRemoved}
              onGroupChange={this.props.onGroupChange}
              persistentGroupingsId={props.options.persistentGroupingsId}
            />
          )}
          <MTableScrollbar
            style={{
              maxHeight: props.options.maxBodyHeight,
              minHeight: props.options.minBodyHeight,
              overflowY: props.options.overflowY
            }}
            double={props.options.doubleHorizontalScroll}
          >
            <Droppable droppableId="headers" direction="horizontal">
              {(provided, snapshot) => {
                const table = this.renderTable(props);
                return (
                  <div ref={provided.innerRef}>
                    <div ref={this.tableContainerDiv}>
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
                            overflowX: 'clip',
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
                <this.props.components.OverlayLoading theme={props.theme} />
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
                <this.props.components.OverlayError
                  error={this.state.errorState}
                  retry={this.retry}
                  theme={props.theme}
                />
              </div>
            )}
        </this.props.components.Container>
      </DragDropContext>
    );
  }
}

function getDefaultCollectionSort(currentColumns, prevColumns, maxColumnSort) {
  let defaultCollectionSort = [];
  let prevCollectionSort = [];

  if (maxColumnSort > 0) {
    defaultCollectionSort = reduceByDefaultSort(currentColumns, maxColumnSort);
  }

  if (prevColumns) {
    prevCollectionSort = reduceByDefaultSort(prevColumns, maxColumnSort);
  }

  return [defaultCollectionSort, prevCollectionSort];
}

function reduceByDefaultSort(list, maxColumnSort) {
  const sortColumns = list.filter(
    (column) => column.defaultSort && column.sorting !== false
  );
  return sortColumns.slice(0, maxColumnSort).map((column, index) => {
    return {
      orderBy: column.tableData
        ? column.tableData.id
        : list.findIndex((val) => val.field === column.field),
      orderDirection: column.defaultSort,
      sortOrder: index + 1
    };
  });
}
