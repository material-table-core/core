import formatDate from 'date-fns/format';
import { v4 as uuidv4 } from 'uuid';
import { selectFromObject } from './';
import { widthToNumber } from './common-values';
import { ALL_COLUMNS } from './constants';

export default class DataManager {
  checkForId = false;
  applyFilters = false;
  applySearch = false;
  applySort = false;
  currentPage = 0;
  detailPanelType = 'multiple';
  lastDetailPanelRow = undefined;
  lastEditingRow = undefined;
  maxColumnSort = 1;
  orderByCollection = [];
  defaultOrderByCollection = [];
  pageSize = 5;
  paging = true;
  parentFunc = null;
  searchText = '';
  searchDebounceDelay = 500;
  selectedCount = 0;
  treefiedDataLength = 0;
  treeDataMaxLevel = 0;
  groupedDataLength = 0;
  defaultExpanded = false;
  bulkEditOpen = false;
  bulkEditChangedRows = {};
  clientSorting = true;

  data = [];
  columns = [];

  filteredData = [];
  searchedData = [];
  groupedData = [];
  treefiedData = [];
  sortedData = [];
  pagedData = [];
  renderData = [];

  filtered = false;
  searched = false;
  grouped = false;
  treefied = false;
  sorted = false;
  paged = false;

  tableWidth = 'full';
  tableStyleWidth = '100%';

  rootGroupsIndex = {};

  setData(data, idSynonym) {
    this.selectedCount = 0;
    let prevDataObject = {};

    if (this.data.length !== 0 && this.data[0][idSynonym] !== undefined) {
      prevDataObject = this.data.reduce((obj, row) => {
        obj[row.tableData.id] = row.tableData;
        return obj;
      }, {});
    }
    if (process.env.NODE_ENV === 'development' && !this.checkForId) {
      this.checkForId = true;
      if (data.some((d) => d[idSynonym] === undefined)) {
        console.warn(
          'The table requires all rows to have an unique id property. A row was provided without id in the rows prop. To prevent the loss of state between renders, please provide an unique id for each row.'
        );
      }
    }
    this.data = data.map((row, index) => {
      const prevTableData = prevDataObject[row[idSynonym]] || {};
      const tableData = {
        index,
        id: row[idSynonym] || index,
        // `uuid` acts as our 'key' and is generated when new data
        // is passed into material-table externally.
        uuid: row.uuid || uuidv4(),
        ...prevTableData,
        ...row.tableData
      };
      if (tableData.checked) {
        this.selectedCount++;
      }
      const newRow = {
        ...row,
        tableData
      };
      if (
        this.lastDetailPanelRow &&
        this.lastDetailPanelRow.tableData === prevTableData
      ) {
        this.lastDetailPanelRow = newRow;
      }
      if (
        this.lastEditingRow &&
        this.lastEditingRow.tableData === prevTableData
      ) {
        this.lastEditingRow = newRow;
      }
      return newRow;
    });
    this.filtered = false;
  }

  setTableWidth(tableWidth) {
    this.tableWidth = tableWidth;
  }

  setColumns(columns, prevColumns = [], savedColumns = {}) {
    let usedWidthPx = 0;
    const usedWidthNotPx = [];

    this.columns = columns.map((columnDef, index) => {
      const widthPx = widthToNumber(columnDef.width);
      const width =
        typeof columnDef.width === 'number'
          ? columnDef.width + 'px'
          : columnDef.width;

      if (
        width // &&
        // columnDef.tableData // &&
        // columnDef.tableData.width !== undefined
      ) {
        if (!isNaN(widthPx)) {
          usedWidthPx += widthPx;
        } else {
          usedWidthNotPx.push(width);
        }
      }
      const prevColumn = prevColumns.find(({ id }) => id === index);
      const savedColumnTableData = savedColumns[columnDef.field] ?? {};
      const tableData = {
        columnOrder: index,
        filterValue: columnDef.defaultFilter,
        filterOperator: columnDef.defaultFilterOperator || '=',
        groupOrder: columnDef.defaultGroupOrder,
        groupSort: columnDef.defaultGroupSort || 'asc',
        width,
        initialWidth: width,
        widthPx: isNaN(widthPx) ? undefined : widthPx,
        additionalWidth: 0,
        ...savedColumnTableData,
        ...(prevColumn ? prevColumn.tableData : {}),
        ...columnDef.tableData,
        id: index
      };
      columnDef.tableData = tableData;
      return columnDef;
    });

    const undefWidthCols = this.columns.filter((c) => {
      if (c.hidden) {
        // Hidden column
        return false;
      }
      if (c.columnDef && c.columnDef.tableData && c.columnDef.tableData.width) {
        // tableData.width already calculated
        return false;
      }
      // Calculate width if no value provided
      return c.width === undefined;
    });

    const usedWidth =
      (usedWidthPx !== 0 ? `${usedWidthPx}px` : '0px') +
      (usedWidthNotPx.length > 0 ? ' - ' + usedWidthNotPx.join(' - ') : '');
    undefWidthCols.forEach((columnDef) => {
      columnDef.tableData.width =
        columnDef.tableData.initialWidth = `calc((100% - ${usedWidth}) / ${undefWidthCols.length})`;
    });

    this.tableStyleWidth =
      this.tableWidth === 'full' ||
        undefWidthCols.length > 0 ||
        usedWidthNotPx.length > 0
        ? '100%'
        : usedWidthPx;
  }

  setDefaultExpanded(expanded) {
    this.defaultExpanded = expanded;
  }

  setClientSorting(clientSorting) {
    this.clientSorting = !!clientSorting;
  }

  setMaxColumnSort(maxColumnSort) {
    const availableColumnsLength = this.columns.filter(
      (column) => column.sorting !== false
    ).length;

    if (maxColumnSort === ALL_COLUMNS) {
      this.maxColumnSort = availableColumnsLength;
    } else {
      this.maxColumnSort = Math.min(maxColumnSort, availableColumnsLength);
    }
  }

  setOrderByCollection() {
    const prevOrderByCollection = this.getOrderByCollection();
    let prevColumns = this.columns.map((columnDef) => {
      const { id } = columnDef.tableData;
      const foundCollection = prevOrderByCollection.find(
        (collection) => collection.orderBy === id
      );

      if (foundCollection) {
        return { ...foundCollection };
      } else {
        return {
          orderBy: columnDef.tableData.id,
          sortOrder: undefined,
          orderDirection: '',
          orderByField: columnDef.field
        };
      }
    });

    prevColumns = this.sortOrderCollection(prevColumns);
    this.orderByCollection = [...prevColumns];
  }

  setDefaultOrderByCollection(defaultOrderByCollection) {
    this.defaultOrderByCollection = [...defaultOrderByCollection];
  }

  getDefaultOrderByCollection() {
    return this.defaultOrderByCollection;
  }

  changeApplySearch(applySearch) {
    this.applySearch = applySearch;
    this.searched = false;
  }

  changeApplyFilters(applyFilters) {
    this.applyFilters = applyFilters;
    this.filtered = false;
  }

  changeApplySort(applySort) {
    this.applySort = applySort;
    this.sorted = false;
  }

  changePaging(paging) {
    this.paging = paging;
    this.paged = false;
  }

  changeCurrentPage(currentPage) {
    this.currentPage = currentPage;
    this.paged = false;
  }

  changePageSize(pageSize) {
    this.pageSize = pageSize;
    this.paged = false;
  }

  changeParentFunc(parentFunc) {
    this.parentFunc = parentFunc;
  }

  changeFilterValue(columnId, value) {
    const column = this.columns.find((c) => c.tableData.id === columnId);

    column.tableData.filterValue = value;
    this.filtered = false;
  }

  changeFilterOperator(columnId, operator) {
    const column = this.columns.find((c) => c.tableData.id === columnId);

    column.tableData.filterOperator = operator;
    this.filtered = false;
  }

  changeRowSelected(checked, path) {
    const rowData = this.findDataByPath(this.sortedData, path);
    rowData.tableData.checked = checked;
    this.selectedCount = this.selectedCount + (checked ? 1 : -1);

    const checkChildRows = (rowData) => {
      if (rowData.tableData.childRows) {
        rowData.tableData.childRows.forEach((childRow) => {
          if (childRow.tableData.checked !== checked) {
            childRow.tableData.checked = checked;
            this.selectedCount = this.selectedCount + (checked ? 1 : -1);
          }
          checkChildRows(childRow);
        });
      }
    };

    checkChildRows(rowData);

    this.filtered = false;
  }

  changeDetailPanelVisibility(path, render) {
    const rowData = this.findDataByPath(this.sortedData, path);

    if (
      (rowData.tableData.showDetailPanel || '').toString() === render.toString()
    ) {
      rowData.tableData.showDetailPanel = undefined;
    } else {
      rowData.tableData.showDetailPanel = render;
    }

    if (
      this.detailPanelType === 'single' &&
      this.lastDetailPanelRow &&
      this.lastDetailPanelRow !== rowData
    ) {
      this.lastDetailPanelRow.tableData.showDetailPanel = undefined;
    }

    this.lastDetailPanelRow = rowData;
    return rowData;
  }

  changeGroupExpand(path) {
    const rowData = this.findDataByPath(this.sortedData, path);
    rowData.isExpanded = !rowData.isExpanded;
  }

  changeSearchText(searchText) {
    this.searchText = searchText;
    this.searched = false;
    this.currentPage = 0;
  }

  changeSearchDebounce(searchDebounceDelay) {
    this.searchDebounceDelay = searchDebounceDelay;
  }

  changeRowEditing(rowData, mode) {
    if (rowData) {
      rowData.tableData.editing = mode;

      if (this.lastEditingRow && this.lastEditingRow !== rowData) {
        this.lastEditingRow.tableData.editing = undefined;
      }

      if (mode) {
        this.lastEditingRow = rowData;
      } else {
        this.lastEditingRow = undefined;
      }
    } else if (this.lastEditingRow) {
      this.lastEditingRow.tableData.editing = undefined;
      this.lastEditingRow = undefined;
    }
  }

  changeBulkEditOpen(bulkEditOpen) {
    this.bulkEditOpen = bulkEditOpen;
  }

  changeAllSelected(checked, selectionProps) {
    let selectedCount = 0;
    const isChecked = (row) => {
      const selectionResult =
        selectionProps instanceof Function
          ? selectionProps(row)
          : { disabled: false };
      return row.tableData.disabled || selectionResult.disabled
        ? false
        : checked;
    };
    if (this.isDataType('group')) {
      const setCheck = (data) => {
        data.forEach((element) => {
          if (element.groups.length > 0) {
            setCheck(element.groups);
          } else {
            element.data.forEach((d) => {
              d.tableData.checked = isChecked(d);
              selectedCount++;
            });
          }
        });
      };

      setCheck(this.groupedData);
    } else {
      const checkChild = (row) => {
        row.tableData.childRows &&
          row.tableData.childRows.forEach((child) => {
            child.tableData.checked = isChecked(row);
            checkChild(child);
          });
      };
      this.searchedData.forEach((row) => {
        row.tableData.checked = isChecked(row);
        checkChild(row);
      });
      selectedCount = this.searchedData.length;
    }

    this.selectedCount = checked ? selectedCount : 0;
  }

  changeGroupSelected = (checked, path) => {
    let currentGroup;
    let currentGroupArray = this.groupedData;

    path.forEach((value) => {
      currentGroup = currentGroupArray.find((group) => group.value === value);
      currentGroupArray = currentGroup.groups;
    });

    const setCheck = (data) => {
      data.forEach((element) => {
        if (element.groups.length > 0) {
          setCheck(element.groups);
        } else {
          element.data.forEach((d) => {
            if (d.tableData.checked !== checked) {
              d.tableData.checked = d.tableData.disabled ? false : checked;
              this.selectedCount = this.selectedCount + (checked ? 1 : -1);
            }
          });
        }
      });
    };

    setCheck([currentGroup]);
  };

  getOrderByCollection = () => {
    return this.orderByCollection.filter((collection) => collection.sortOrder);
  };

  sortOrderCollection = (list) => {
    return list.sort((a, b) => {
      if (!a.sortOrder) return 1;
      if (!b.sortOrder) return -1;
      return a.sortOrder - b.sortOrder;
    });
  };

  changeColumnOrder(orderBy, orderDirection, sortOrder) {
    let prevColumns = [];
    const sortColumns = this.getOrderByCollection();

    if (sortColumns.length === this.maxColumnSort && !sortOrder) {
      this.orderByCollection[0].orderDirection = '';
      this.orderByCollection[0].sortOrder = undefined;

      prevColumns = this.orderByCollection.map((collection) => {
        if (collection.sortOrder) {
          collection.sortOrder -= 1;
        } else if (collection.orderBy === orderBy && orderDirection) {
          collection.sortOrder = sortColumns.length;
          collection.orderDirection = orderDirection;
        }

        return collection;
      });
    } else {
      prevColumns = this.orderByCollection.map((collection) => {
        if (collection.orderBy === orderBy && orderDirection) {
          collection.orderDirection = orderDirection;
          collection.sortOrder = sortOrder || sortColumns.length + 1;
        } else if (!orderDirection && collection.orderBy === orderBy) {
          collection.orderDirection = orderDirection;
          collection.sortOrder = undefined;
        } else if (!orderDirection && sortOrder < collection.sortOrder) {
          collection.sortOrder -= 1;
        }
        return collection;
      });
    }

    prevColumns = this.sortOrderCollection(prevColumns);
    this.orderByCollection = [...prevColumns];

    this.currentPage = 0;
    this.sorted = false;
  }

  changeGroupOrder(columnId) {
    const column = this.columns.find((c) => c.tableData.id === columnId);

    if (column.tableData.groupSort === 'asc') {
      column.tableData.groupSort = 'desc';
    } else {
      column.tableData.groupSort = 'asc';
    }

    this.sorted = false;
  }

  changeColumnHidden(column, hidden) {
    column.hidden = hidden;
    // https://github.com/mbrn/material-table/pull/2655
    // https://github.com/material-table-core/core/issues/20#issuecomment-752265651
    // Fix #20
    this.setColumns(this.columns);
  }

  changeTreeExpand(path) {
    const rowData = this.findDataByPath(this.sortedData, path);
    rowData.tableData.isTreeExpanded = !rowData.tableData.isTreeExpanded;
  }

  changeDetailPanelType(type) {
    this.detailPanelType = type;
  }

  changeByDrag(result) {
    let start = 0;

    let groups = this.columns
      .filter((col) => col.tableData.groupOrder > -1)
      .sort(
        (col1, col2) => col1.tableData.groupOrder - col2.tableData.groupOrder
      );

    if (
      result.destination.droppableId === 'groups' &&
      result.source.droppableId === 'groups'
    ) {
      start = Math.min(result.destination.index, result.source.index);
      const end = Math.max(result.destination.index, result.source.index);

      groups = groups.slice(start, end + 1);

      if (result.destination.index < result.source.index) {
        // Take last and add as first
        const last = groups.pop();
        groups.unshift(last);
      } else {
        // Take first and add as last
        const last = groups.shift();
        groups.push(last);
      }
    } else if (
      result.destination.droppableId === 'groups' &&
      result.source.droppableId === 'headers'
    ) {
      const newGroup = this.columns.find(
        (c) => c.tableData.id.toString() === result.draggableId.toString()
      );
      if (!newGroup || newGroup.grouping === false || !newGroup.field) {
        return;
      }

      groups.splice(result.destination.index, 0, newGroup);
    } else if (
      result.destination.droppableId === 'headers' &&
      result.source.droppableId === 'groups'
    ) {
      const removeGroup = this.columns.find(
        (c) => c.tableData.id.toString() === result.draggableId.toString()
      );
      removeGroup.tableData.groupOrder = undefined;
      groups.splice(result.source.index, 1);
    } else if (
      result.destination.droppableId === 'headers' &&
      result.source.droppableId === 'headers'
    ) {
      start = Math.min(result.destination.index, result.source.index);
      const end = Math.max(result.destination.index, result.source.index);

      // get the effective start and end considering hidden columns
      const sorted = this.columns
        .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
        .filter(
          (column) =>
            column.tableData.groupOrder === undefined && !column.hidden
        );
      let numHiddenBeforeStart = 0;
      let numVisibleBeforeStart = 0;
      for (
        let i = 0;
        i < sorted.length && numVisibleBeforeStart <= start;
        i++
      ) {
        if (sorted[i].hidden) {
          numHiddenBeforeStart++;
        } else {
          numVisibleBeforeStart++;
        }
      }
      const effectiveStart = start + numHiddenBeforeStart;

      let effectiveEnd = effectiveStart;
      for (
        let numVisibleInRange = 0;
        numVisibleInRange < end - start && effectiveEnd < sorted.length;
        effectiveEnd++
      ) {
        if (!sorted[effectiveEnd].hidden) {
          numVisibleInRange++;
        }
      }
      const colsToMov = sorted.slice(effectiveStart, effectiveEnd + 1);

      if (result.destination.index < result.source.index) {
        // Take last and add as first
        const last = colsToMov.pop();
        colsToMov.unshift(last);
      } else {
        // Take first and add as last
        const last = colsToMov.shift();
        colsToMov.push(last);
      }

      for (let i = 0; i < colsToMov.length; i++) {
        colsToMov[i].tableData.columnOrder = effectiveStart + i;
      }

      return;
    } else {
      return;
    }

    for (let i = 0; i < groups.length; i++) {
      groups[i].tableData.groupOrder = start + i;
    }

    this.sorted = this.grouped = false;
  }

  startCellEditable = (rowData, columnDef) => {
    rowData.tableData.editCellList = [
      ...(rowData.tableData.editCellList || []),
      columnDef
    ];
  };

  finishCellEditable = (rowData, columnDef) => {
    if (rowData.tableData.editCellList) {
      const index = rowData.tableData.editCellList.findIndex(
        (c) => c.tableData.id.toString() === columnDef.tableData.id.toString()
      );
      if (index !== -1) {
        rowData.tableData.editCellList.splice(index, 1);
      }
    }
  };

  clearBulkEditChangedRows = () => {
    this.bulkEditChangedRows = {};
  };

  onBulkEditRowChanged = (oldData, newData) => {
    this.bulkEditChangedRows[oldData.tableData.id] = {
      oldData,
      newData
    };
  };

  onColumnResized(
    id,
    offset,
    changedColumnWidthsBeforeOffset,
    initialColWidths
  ) {
    const column = this.columns.find((c) => c.tableData.id === id);
    if (!column) {
      return [];
    }
    const nextColumn = this.columns.find((c) => c.tableData.id === id + 1);
    if (this.tableWidth === 'full' && !nextColumn) {
      return [];
    }
    if (offset === 0) {
      // We've finished the column resize
      return this.tableWidth === 'full' ? [column, nextColumn] : [column];
    }
    if (this.tableWidth === 'variable' && this.tableStyleWidth === '100%') {
      // First time we're resizing - resolve all the column widths
      // MTableHeader has ref to
      this.columns.forEach((col, index) => ({
        ...col,
        tableData: {
          ...col.tableData,
          width: `${initialColWidths[index]}px`,
          widthPx: initialColWidths[index]
        }
      }));
      this.tableStyleWidth = initialColWidths.reduce(
        (acc, width) => acc + width
      );
    }

    const changed = [column];
    column.tableData.widthPx = changedColumnWidthsBeforeOffset[0] + offset;
    column.tableData.additionalWidth += offset;
    column.tableData.width =
      this.tableWidth === 'full'
        ? `calc(${column.tableData.initialWidth} + ${column.tableData.additionalWidth}px)`
        : `${column.tableData.widthPx}px`;
    if (this.tableWidth === 'full') {
      nextColumn.tableData.widthPx =
        changedColumnWidthsBeforeOffset[1] - offset;
      nextColumn.tableData.additionalWidth -= offset;
      nextColumn.tableData.width = `calc(${nextColumn.tableData.initialWidth} + ${nextColumn.tableData.additionalWidth}px)`;
      changed.push(nextColumn);
    }
    if (this.tableWidth === 'variable') {
      this.tableStyleWidth += offset;
    }
    return changed;
  }

  expandTreeForNodes = (data) => {
    data.forEach((row) => {
      let currentRow = row;
      while (this.parentFunc(currentRow, this.data)) {
        const parent = this.parentFunc(currentRow, this.data);
        if (parent) {
          parent.tableData.isTreeExpanded = true;
        }
        currentRow = parent;
      }
    });
  };

  findDataByPath = (renderData, path) => {
    if (this.isDataType('tree')) {
      const node = path.reduce(
        (result, current) => {
          return (
            result &&
            result.tableData &&
            result.tableData.childRows &&
            result.tableData.childRows.find(
              (row) => row && row.tableData.uuid === current
            )
          );
        },
        { tableData: { childRows: renderData } }
      );
      return node;
    } else {
      const data = { groups: renderData };

      const node = path.reduce((result, current) => {
        if (result.groups.length > 0) {
          return result.groups[current];
        } else if (result.data) {
          return (
            result.data[current] ||
            result.data.find((data) => data.tableData?.uuid === current)
          );
        } else {
          return undefined;
        }
      }, data);
      return node;
    }
  };

  findGroupByGroupPath(renderData, path) {
    const data = { groups: renderData, groupsIndex: this.rootGroupsIndex };

    const node = path.reduce((result, current) => {
      if (!result) {
        return undefined;
      }
      if (result.groupsIndex[current] !== undefined) {
        return result.groups[result.groupsIndex[current]];
      }
      return undefined;
      // const group = result.groups.find(a => a.value === current);
      // return group;
    }, data);
    return node;
  }

  getFieldValue = (rowData, columnDef, lookup = true) => {
    let value =
      typeof rowData[columnDef.field] !== 'undefined'
        ? rowData[columnDef.field]
        : selectFromObject(rowData, columnDef.field);
    if (columnDef.lookup && lookup) {
      value = columnDef.lookup[value];
    }

    return value;
  };

  isDataType(type) {
    let dataType = 'normal';

    if (this.parentFunc) {
      dataType = 'tree';
    } else if (this.columns.find((a) => a.tableData.groupOrder > -1)) {
      dataType = 'group';
    }

    return type === dataType;
  }

  sort(a, b, type) {
    if (type === 'numeric') {
      return a - b;
    } else {
      if (a !== b) {
        // to find nulls
        if (!a) return -1;
        if (!b) return 1;
      }
      return a < b ? -1 : a > b ? 1 : 0;
    }
  }

  sortList(list) {
    if (!this.clientSorting) {
      return list;
    }
    const collectionIds = this.orderByCollection.map(
      (collection) => collection.orderBy
    );
    const columnsDefs = new Map();
    this.columns.forEach((column) => {
      const columnId = column.tableData.id;
      if (collectionIds.includes(columnId)) {
        columnsDefs.set(columnId, column);
      }
    });

    const sort = this.sort;
    const getFieldValue = this.getFieldValue;
    const orderByCollection = this.orderByCollection;

    return list.sort(function sortData(
      a,
      b,
      columns = columnsDefs,
      collection = orderByCollection
    ) {
      const { orderBy, orderDirection } = collection[0];

      const columnDef = columns.get(orderBy);
      let compareValue = 0;
      if (columnDef.customSort) {
        if (orderDirection === 'desc') {
          compareValue = columnDef.customSort(b, a, 'row', orderDirection);
        } else {
          compareValue = columnDef.customSort(a, b, 'row', orderDirection);
        }
      } else {
        // Calculate compare value and modify based on order
        compareValue = sort(
          getFieldValue(a, columnDef),
          getFieldValue(b, columnDef),
          columnDef.type
        );

        compareValue =
          orderDirection.toLowerCase() === 'desc'
            ? compareValue * -1
            : compareValue;
      }

      // See if the next key needs to be considered
      const checkNextKey =
        compareValue === 0 &&
        collection.filter((col) => col.sortOrder !== undefined).length !== 1;
      return checkNextKey
        ? sortData(a, b, columns, collection.slice(1))
        : compareValue;
    });
  }

  getRenderState = () => {
    if (this.filtered === false) {
      this.filterData();
    }

    if (this.searched === false) {
      this.searchData();
    }

    if (this.grouped === false && this.isDataType('group')) {
      this.groupData();
    }

    if (this.treefied === false && this.isDataType('tree')) {
      this.treefyData();
    }

    if (this.sorted === false) {
      this.sortData();
    }

    if (this.paged === false) {
      this.pageData();
    }

    return {
      columns: this.columns,
      currentPage: this.currentPage,
      data: this.sortedData,
      lastEditingRow: this.lastEditingRow,
      orderByCollection: this.orderByCollection,
      maxColumnSort: this.maxColumnSort,
      originalData: [...this.data],
      pageSize: this.pageSize,
      renderData: this.pagedData,
      searchText: this.searchText,
      selectedCount: this.selectedCount,
      treefiedDataLength: this.treefiedDataLength,
      treeDataMaxLevel: this.treeDataMaxLevel,
      groupedDataLength: this.groupedDataLength,
      tableStyleWidth: this.tableStyleWidth
    };
  };

  // =====================================================================================================
  // DATA MANIPULATIONS
  // =====================================================================================================

  filterData = () => {
    this.searched =
      this.grouped =
      this.treefied =
      this.sorted =
      this.paged =
      false;

    this.filteredData = [...this.data];

    if (this.applyFilters) {
      this.columns
        .filter((columnDef) => columnDef.tableData.filterValue !== undefined)
        .forEach((columnDef) => {
          const { lookup, type, tableData } = columnDef;
          if (columnDef.customFilterAndSearch) {
            this.filteredData = this.filteredData.filter(
              (row) =>
                !!columnDef.customFilterAndSearch(
                  tableData.filterValue,
                  row,
                  columnDef
                )
            );
          } else {
            if (lookup) {
              this.filteredData = this.filteredData.filter((row) => {
                const value = this.getFieldValue(row, columnDef, false);
                return (
                  !tableData.filterValue ||
                  tableData.filterValue.length === 0 ||
                  tableData.filterValue.indexOf(
                    value !== undefined && value !== null && value.toString()
                  ) > -1
                );
              });
            } else if (type === 'numeric') {
              this.filteredData = this.filteredData.filter((row) => {
                const value = this.getFieldValue(row, columnDef);
                return value + '' === tableData.filterValue;
              });
            } else if (type === 'boolean' && tableData.filterValue) {
              this.filteredData = this.filteredData.filter((row) => {
                const value = this.getFieldValue(row, columnDef);
                return (
                  (value && tableData.filterValue === 'checked') ||
                  (!value && tableData.filterValue === 'unchecked')
                );
              });
            } else if (['date', 'datetime'].includes(type)) {
              this.filteredData = this.filteredData.filter((row) => {
                const value = this.getFieldValue(row, columnDef);

                const currentDate = value ? new Date(value) : null;

                if (currentDate && currentDate.toString() !== 'Invalid Date') {
                  const selectedDate = tableData.filterValue;
                  let currentDateToCompare = '';
                  let selectedDateToCompare = '';

                  if (type === 'date') {
                    currentDateToCompare = formatDate(
                      currentDate,
                      'MM/dd/yyyy'
                    );
                    selectedDateToCompare = formatDate(
                      selectedDate,
                      'MM/dd/yyyy'
                    );
                  } else if (type === 'datetime') {
                    currentDateToCompare = formatDate(
                      currentDate,
                      'MM/dd/yyyy - HH:mm'
                    );
                    selectedDateToCompare = formatDate(
                      selectedDate,
                      'MM/dd/yyyy - HH:mm'
                    );
                  }

                  return currentDateToCompare === selectedDateToCompare;
                }

                return true;
              });
            } else if (type === 'time') {
              this.filteredData = this.filteredData.filter((row) => {
                const value = this.getFieldValue(row, columnDef);
                const currentHour = value || null;

                if (currentHour) {
                  const selectedHour = tableData.filterValue;
                  const currentHourToCompare = formatDate(
                    selectedHour,
                    'HH:mm'
                  );

                  return currentHour === currentHourToCompare;
                }

                return true;
              });
            } else {
              this.filteredData = this.filteredData.filter((row) => {
                const value = this.getFieldValue(row, columnDef);
                return (
                  value !== undefined &&
                  value !== null &&
                  value
                    .toString()
                    .toUpperCase()
                    .includes(tableData.filterValue.toUpperCase())
                );
              });
            }
          }
        });
    }

    this.filtered = true;
  };

  searchData = () => {
    this.grouped = this.treefied = this.sorted = this.paged = false;

    this.searchedData = [...this.filteredData];

    if (this.searchText && this.applySearch) {
      const trimmedSearchText = this.searchText.trim();
      this.searchedData = this.searchedData.filter((row) => {
        return this.columns
          .filter((columnDef) => {
            return columnDef.searchable === undefined
              ? !columnDef.hidden
              : columnDef.searchable;
          })
          .some((columnDef) => {
            if (columnDef.customFilterAndSearch) {
              return !!columnDef.customFilterAndSearch(
                trimmedSearchText,
                row,
                columnDef
              );
            } else if (columnDef.field) {
              const value = this.getFieldValue(row, columnDef);
              if (value) {
                return value
                  .toString()
                  .toUpperCase()
                  .includes(trimmedSearchText.toUpperCase());
              }
            }
            return false;
          });
      });
    }
    this.searched = true;
  };

  groupData() {
    this.sorted = this.paged = false;
    this.groupedDataLength = 0;

    const tmpData = [...this.searchedData];

    const groups = this.columns
      .filter((col) => col.tableData.groupOrder > -1)
      .sort(
        (col1, col2) => col1.tableData.groupOrder - col2.tableData.groupOrder
      );

    const subData = tmpData.reduce(
      (result, currentRow) => {
        let object = result;
        object = groups.reduce((o, colDef) => {
          const value =
            currentRow[colDef.field] ||
            selectFromObject(currentRow, colDef.field);

          let group;
          if (o.groupsIndex[value] !== undefined) {
            group = o.groups[o.groupsIndex[value]];
          }

          if (!group) {
            const path = [...(o.path || []), value];
            let isDefaultExpanded = false;
            switch (typeof this.defaultExpanded) {
              case "boolean":
                isDefaultExpanded = this.defaultExpanded;
                break;
              case "function":
                isDefaultExpanded = this.defaultExpanded(currentRow);
                break;

            }
            const oldGroup = this.findGroupByGroupPath(
              this.groupedData,
              path
            ) || {
              isExpanded: isDefaultExpanded
            };

            group = {
              value,
              groups: [],
              groupsIndex: {},
              data: [],
              isExpanded: oldGroup.isExpanded,
              path: path
            };
            o.groups.push(group);
            o.groupsIndex[value] = o.groups.length - 1;
          }
          return group;
        }, object);

        object.data.push(currentRow);
        this.groupedDataLength++;

        return result;
      },
      { groups: [], groupsIndex: {} }
    );

    this.groupedData = subData.groups;
    this.grouped = true;
    this.rootGroupsIndex = subData.groupsIndex;
  }

  treefyData() {
    this.sorted = this.paged = false;
    this.data.forEach((a) => (a.tableData.childRows = null));
    this.treefiedData = [];
    this.treefiedDataLength = 0;
    this.treeDataMaxLevel = 0;
    // if filter or search is enabled, collapse the tree
    if (
      this.searchText ||
      this.columns.some((columnDef) => columnDef.tableData.filterValue)
    ) {
      this.data.forEach((row) => {
        row.tableData.isTreeExpanded = false;
      });

      // expand the tree for all nodes present after filtering and searching
      this.expandTreeForNodes(this.searchedData);
    }

    const addRow = (rowData) => {
      rowData.tableData.markedForTreeRemove = false;
      const parent = this.parentFunc(rowData, this.data);
      if (parent) {
        parent.tableData.childRows = parent.tableData.childRows || [];
        if (!parent.tableData.childRows.includes(rowData)) {
          parent.tableData.childRows.push(rowData);
          this.treefiedDataLength++;
        }

        addRow(parent);
        rowData.tableData.path = [
          ...parent.tableData.path,
          rowData.tableData.uuid
        ];
        this.treeDataMaxLevel = Math.max(
          this.treeDataMaxLevel,
          rowData.tableData.path.length
        );
      } else {
        if (!this.treefiedData.includes(rowData)) {
          this.treefiedData.push(rowData);
          this.treefiedDataLength++;
          rowData.tableData.path = [rowData.tableData.uuid];
        }
      }
    };

    // Add all rows initially
    this.data.forEach((rowData) => {
      addRow(rowData);
    });
    const markForTreeRemove = (rowData) => {
      let pointer = this.treefiedData;
      rowData.tableData.path.forEach((pathPart) => {
        if (pointer.tableData && pointer.tableData.childRows) {
          pointer = pointer.tableData.childRows;
        }
        if (Array.isArray(pointer)) {
          pointer = pointer.find((p) => p.tableData.uuid === pathPart);
        }
      });
      pointer.tableData.markedForTreeRemove = true;
    };

    const traverseChildrenAndUnmark = (rowData) => {
      if (rowData.tableData.childRows) {
        rowData.tableData.childRows.forEach((row) => {
          traverseChildrenAndUnmark(row);
        });
      }
      rowData.tableData.markedForTreeRemove = false;
    };

    // for all data rows, restore initial expand if no search term is available and remove items that shouldn't be there
    this.data.forEach((rowData) => {
      if (
        !this.searchText &&
        !this.columns.some((columnDef) => columnDef.tableData.filterValue)
      ) {
        if (rowData.tableData.isTreeExpanded === undefined) {
          let isExpanded = false;
          switch (typeof this.defaultExpanded) {
            case "boolean":
              isDefaultExpanded = this.defaultExpanded;
              break;
            case "function":
              isDefaultExpanded = this.defaultExpanded(rowData);
              break;
          }
          rowData.tableData.isTreeExpanded = isExpanded;
        }
      }
      const hasSearchMatchedChildren = rowData.tableData.isTreeExpanded;

      if (!hasSearchMatchedChildren && this.searchedData.indexOf(rowData) < 0) {
        markForTreeRemove(rowData);
      }
    });

    // preserve all children of nodes that are matched by search or filters
    this.data.forEach((rowData) => {
      if (this.searchedData.indexOf(rowData) > -1) {
        traverseChildrenAndUnmark(rowData);
      }
    });

    const traverseTreeAndDeleteMarked = (rowDataArray) => {
      for (let i = rowDataArray.length - 1; i >= 0; i--) {
        const item = rowDataArray[i];
        if (item.tableData.childRows) {
          traverseTreeAndDeleteMarked(item.tableData.childRows);
        }
        if (item.tableData.markedForTreeRemove) rowDataArray.splice(i, 1);
      }
    };
    traverseTreeAndDeleteMarked(this.treefiedData);
    this.treefiedDataLength = this.treefiedData.length;
    this.treefied = true;
  }

  sortData() {
    this.paged = false;

    if (this.isDataType('group')) {
      this.sortedData = [...this.groupedData];

      const groups = this.columns
        .filter((col) => col.tableData.groupOrder > -1)
        .sort(
          (col1, col2) => col1.tableData.groupOrder - col2.tableData.groupOrder
        );

      const sortGroups = (list, columnDef) => {
        if (columnDef.customSort) {
          return list.sort(
            columnDef.tableData.groupSort === 'desc'
              ? (a, b) =>
                columnDef.customSort(
                  b.value,
                  a.value,
                  'group',
                  columnDef.tableData.groupSort
                )
              : (a, b) =>
                columnDef.customSort(
                  a.value,
                  b.value,
                  'group',
                  columnDef.tableData.groupSort
                )
          );
        } else {
          return list.sort(
            columnDef.tableData.groupSort === 'desc'
              ? (a, b) => this.sort(b.value, a.value, columnDef.type)
              : (a, b) => this.sort(a.value, b.value, columnDef.type)
          );
        }
      };

      this.sortedData = sortGroups(this.sortedData, groups[0]);

      // If you have nested grouped rows and wanted to select one of those row
      // there was an issue.
      // -https://github.com/material-table-core/core/pull/74
      // -https://github.com/mbrn/material-table/issues/2258
      // -https://github.com/mbrn/material-table/issues/2249
      // getGroupsIndex resolves this nested grouped rows selection issue.
      const getGroupsIndex = (groups) =>
        groups.reduce((result, group) => {
          result[group.value] = groups.findIndex(
            (g) => g.value === group.value
          );
          return result;
        }, {});

      const sortGroupData = (list, level) => {
        list.forEach((element) => {
          if (element.groups.length > 0) {
            const column = groups[level];
            element.groups = sortGroups(element.groups, column);
            // For grouped rows that are nested
            element.groupsIndex = getGroupsIndex(element.groups);
            sortGroupData(element.groups, level + 1);
          } else {
            if (
              this.maxColumnSort > 0 &&
              this.getOrderByCollection().length > 0
            ) {
              element.data = this.sortList(element.data);
            } else if (this.maxColumnSort > 0) {
              element.data = element.data.sort((a, b) => {
                return (
                  this.data.findIndex(
                    (val) => val.tableData.id === a.tableData.id
                  ) -
                  this.data.findIndex(
                    (val) => val.tableData.id === b.tableData.id
                  )
                );
              });
            }
          }
        });
      };

      sortGroupData(this.sortedData, 1);
    } else if (this.isDataType('tree')) {
      this.sortedData = [...this.treefiedData];
      if (this.maxColumnSort > 0 && this.getOrderByCollection().length > 0) {
        this.sortedData = this.sortList(this.sortedData);

        const sortTree = (list) => {
          list.forEach((item) => {
            if (item.tableData.childRows) {
              item.tableData.childRows = this.sortList(
                item.tableData.childRows
              );
              sortTree(item.tableData.childRows);
            }
          });
        };

        sortTree(this.sortedData);
      }
    } else if (this.isDataType('normal')) {
      this.sortedData = [...this.searchedData];
      if (
        this.maxColumnSort > 0 &&
        this.getOrderByCollection().length > 0 &&
        this.applySort
      ) {
        this.sortedData = this.sortList(this.sortedData);
      }
    }

    this.sorted = true;
  }

  pageData() {
    this.pagedData = [...this.sortedData];

    if (this.paging) {
      const startIndex = this.currentPage * this.pageSize;
      const endIndex = startIndex + this.pageSize;

      this.pagedData = this.pagedData.slice(startIndex, endIndex);
    }

    this.paged = true;
  }

  clearCriteria = () => {
    this.changeOrder(-1, '');
    this.changeSearchText('');
    for (const column of this.columns) {
      this.changeFilterValue(column.tableData.id, '');
    }
    this.changeSearchText('');
    this.changePaging(0);
  };
}
