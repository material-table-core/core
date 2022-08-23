import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Draggable } from '@react-forked/dnd';
import { Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as CommonValues from '../../utils/common-values';
import { useLocalizationStore, useIconStore, useOptionStore } from '@store';

export function MTableHeader({ onColumnResized, columns, ...props }) {
  const localization = useLocalizationStore().header;
  const options = useOptionStore();
  const icons = useIconStore();
  const defaultMinColumnWidth = 20;
  const defaultMaxColumnWidth = 10000;

  const [resizing, setResizing] = React.useState(undefined);
  const [lastX, setLastX] = React.useState(0);
  const displayingColumns = React.useMemo(
    () => columns.filter((c) => c.hidden !== true),
    [columns]
  );

  const handleMouseDown = (e, columnDef, colIndex) => {
    const startX = e.clientX;
    const th = e.target.closest('th');
    const currentWidth =
      th && Math.round(+window.getComputedStyle(th).width.slice(0, -2));
    let initialColWidths = resizing?.initialColWidths;
    let nextWidth;
    let nextColIndex;
    if (options.tableWidth === 'full') {
      const nextTh = th.nextSibling;
      nextWidth =
        nextTh &&
        Math.round(+window.getComputedStyle(nextTh).width.slice(0, -2));
      nextColIndex = displayingColumns.findIndex(
        (c) => c.tableData.id === columnDef.tableData.id + 1
      );
    } else if (!initialColWidths) {
      // Ensure we have all column widths in pixels
      initialColWidths = Array.from(th.parentNode.children).map((th) =>
        Math.round(+window.getComputedStyle(th).width.slice(0, -2))
      );
    }

    setLastX(startX);
    const nextColumn = displayingColumns[nextColIndex];
    setResizing({
      colIndex,
      nextColIndex,
      lastColData: { ...columnDef.tableData, width: currentWidth },
      ...(nextColIndex &&
        nextColumn && {
          lastNextColData: {
            ...nextColumn.tableData,
            width: nextWidth
          }
        }),
      initialColWidths,
      startX
    });
  };

  const constrainedColumnResize = (col, lastWidth, offset) => {
    // Extra max/min are to avoid sudden column changes when a column that starts without
    // an explicit width is resized
    const constrainedNewWidth = Math.min(
      Math.max(col.maxWidth || defaultMaxColumnWidth, lastWidth), // Avoid sudden decrease in column width
      Math.max(
        Math.min(col.minWidth || defaultMinColumnWidth, lastWidth), // Avoid sudden increase in column width
        lastWidth + offset
      )
    );
    return constrainedNewWidth - lastWidth;
  };

  const handleMouseMove = React.useCallback(
    // Use usecallback to prevent triggering theuse effect too much
    (e) => {
      if (!resizing) return;

      if (e.preventDefault) {
        // prevent text in table being selected
        e.preventDefault();
      }

      const curX = e.clientX;
      const col = displayingColumns[resizing.colIndex];
      const alreadyOffset =
        col.tableData.additionalWidth - resizing.lastColData.additionalWidth;
      let offset = constrainedColumnResize(
        col,
        resizing.lastColData.width + alreadyOffset,
        curX - lastX
      );
      offset = Math.round(offset);
      const widths = [resizing.lastColData.width + alreadyOffset];
      if (options.tableWidth === 'full' && resizing.lastNextColData) {
        offset = -constrainedColumnResize(
          displayingColumns[resizing.nextColIndex],
          resizing.lastNextColData.width - alreadyOffset,
          -offset
        );
        widths.push(resizing.lastNextColData.width - alreadyOffset);
      }

      setLastX(curX);
      if (offset) {
        onColumnResized(
          col.tableData.id,
          offset,
          widths,
          resizing.initialColWidths
        );
      }
    },
    [lastX, resizing, onColumnResized]
  );

  const handleMouseUp = React.useCallback(
    (e) => {
      if (resizing && lastX !== resizing.startX) {
        onColumnResized(
          displayingColumns[resizing.colIndex].tableData.id,
          0,
          [],
          []
        );
      }
      setResizing(undefined);
    },
    [setResizing, resizing, lastX, onColumnResized]
  );

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]); // ONly reset the listeners if needed

  const renderActionsHeader = () => {
    const width = CommonValues.actionsColumnWidth({ options, ...props });
    return (
      <TableCell
        key="key-actions-column"
        padding="checkbox"
        className={props.classes.header}
        style={{
          textAlign: 'center',
          ...options.headerStyle,
          width: width,
          boxSizing: 'border-box'
        }}
      >
        <TableSortLabel hideSortIcon={true} disabled>
          {localization.actions}
        </TableSortLabel>
      </TableCell>
    );
  };

  const getCellStyle = (columnDef) => {
    const width = options.columnResizable
      ? CommonValues.reducePercentsInCalc(
          columnDef.tableData.width,
          props.scrollWidth
        )
      : columnDef.tableData.width;
    const style = {
      ...options.headerStyle,
      ...columnDef.headerStyle,
      boxSizing: 'border-box',
      width,
      ...(options.tableWidth === 'full' &&
        columnDef.minWidth && { minWidth: columnDef.minWidth }),
      ...(options.tableWidth === 'full' &&
        columnDef.maxWidth && { maxWidth: columnDef.maxWidth })
    };
    if (
      options.tableLayout === 'fixed' &&
      options.columnResizable &&
      columnDef.resizable !== false
    ) {
      style.paddingLeft = 8;
      style.paddingRight = 2;
      style.position = 'relative';
    }
    return style;
  };

  function RenderHeader() {
    const size = options.padding === 'default' ? 'medium' : 'small';

    return displayingColumns
      .filter((columnDef) => !(columnDef.tableData.groupOrder > -1))
      .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
      .map((columnDef, index, allCols) => {
        let content = columnDef.title;

        const cellAlignment =
          columnDef.align !== undefined
            ? columnDef.align
            : ['numeric', 'currency'].indexOf(columnDef.type) !== -1
            ? 'right'
            : 'left';
        if (options.draggable && columnDef.draggable !== false) {
          content = (
            <Draggable
              key={columnDef.tableData.id}
              draggableId={columnDef.tableData.id.toString()}
              index={columnDef.tableData.id}
              style={{ zIndex: 99 }}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={
                    snapshot.isDragging
                      ? provided.draggableProps.style
                      : {
                          position: 'relative',
                          minWidth: 0,
                          display: 'flex',
                          justifyContent:
                            cellAlignment === 'right' ? 'flex-end' : undefined
                        }
                  }
                >
                  {columnDef.sorting !== false && options.sorting ? (
                    <RenderSortButton
                      columnDef={columnDef}
                      keepSortDirectionOnColumnSwitch={
                        options.keepSortDirectionOnColumnSwitch
                      }
                      icon={icons.SortArrow}
                      thirdSortClick={options.thirdSortClick}
                      onOrderChange={props.onOrderChange}
                      columnIndex={index}
                      orderByCollection={props.orderByCollection}
                    >
                      {columnDef.title}
                    </RenderSortButton>
                  ) : (
                    columnDef.title
                  )}
                </div>
              )}
            </Draggable>
          );
        } else if (columnDef.sorting !== false && options.sorting) {
          content = (
            <RenderSortButton
              columnDef={columnDef}
              keepSortDirectionOnColumnSwitch={
                options.keepSortDirectionOnColumnSwitch
              }
              icon={icons.SortArrow}
              thirdSortClick={options.thirdSortClick}
              onOrderChange={props.onOrderChange}
              columnIndex={index}
              orderByCollection={props.orderByCollection}
            >
              {columnDef.title}
            </RenderSortButton>
          );
        }
        if (columnDef.tooltip) {
          content = (
            <Tooltip title={columnDef.tooltip} placement="bottom">
              <span>{content}</span>
            </Tooltip>
          );
        }
        if (
          options.tableLayout === 'fixed' &&
          options.columnResizable &&
          columnDef.resizable !== false &&
          !(options.tableWidth === 'full' && index === allCols.length - 1)
        ) {
          const Resize = icons.Resize
            ? icons.Resize
            : (props) => <div {...props} data-test-id="drag_handle" />;
          content = (
            <div
              className={
                cellAlignment === 'right'
                  ? props.classes.headerWrapRight
                  : props.classes.headerWrap
              }
            >
              <div className={props.classes.headerContent}>{content}</div>
              <div></div>
              <Resize
                className={props.classes.headerResize}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  color:
                    resizing?.col &&
                    resizing.col.tableData.id === columnDef.tableData.id
                      ? props.theme.palette.primary.main
                      : 'inherit'
                }}
                onMouseDown={(e) => handleMouseDown(e, columnDef, index)}
              />
            </div>
          );
        }
        return (
          <TableCell
            key={columnDef.tableData.id}
            align={cellAlignment}
            className={props.classes.header}
            style={getCellStyle(columnDef)}
            size={size}
            aria-label={columnDef.ariaLabel}
          >
            {content}
          </TableCell>
        );
      });
  }

  function renderSelectionHeader() {
    const selectionWidth = CommonValues.selectionMaxWidth(
      { ...props, options },
      props.treeDataMaxLevel
    );
    return (
      <TableCell
        padding="none"
        key="key-selection-column"
        className={props.classes.header}
        style={{ ...options.headerStyle, width: selectionWidth }}
      >
        {options.showSelectAllCheckbox && (
          <Checkbox
            indeterminate={
              props.selectedCount > 0 && props.selectedCount < props.dataCount
            }
            checked={
              props.dataCount > 0 && props.selectedCount === props.dataCount
            }
            onChange={(event, checked) =>
              props.onAllSelected && props.onAllSelected(checked)
            }
            {...options.headerSelectionProps}
          />
        )}
      </TableCell>
    );
  }

  function renderDetailPanelColumnCell() {
    return (
      <TableCell
        padding="none"
        key="key-detail-panel-column"
        className={props.classes.header}
        style={options.headerStyle}
      />
    );
  }

  const headers = RenderHeader();
  if (options.selection) {
    headers.splice(0, 0, renderSelectionHeader());
  }
  if (props.showActionsColumn) {
    if (options.actionsColumnIndex >= 0) {
      let endPos = 0;
      if (options.selection) {
        endPos = 1;
      }
      headers.splice(
        options.actionsColumnIndex + endPos,
        0,
        renderActionsHeader()
      );
    } else if (options.actionsColumnIndex === -1) {
      headers.push(renderActionsHeader());
    }
  }
  if (props.hasDetailPanel && options.showDetailPanelIcon) {
    if (options.detailPanelColumnAlignment === 'right') {
      headers.push(renderDetailPanelColumnCell());
    } else {
      headers.splice(0, 0, renderDetailPanelColumnCell());
    }
  }
  if (props.isTreeData > 0) {
    headers.splice(
      0,
      0,
      <TableCell
        padding="none"
        key={'key-tree-data-header'}
        className={props.classes.header}
        style={options.headerStyle}
      />
    );
  }
  displayingColumns
    .filter((columnDef) => columnDef.tableData.groupOrder > -1)
    .forEach((columnDef) => {
      headers.splice(
        0,
        0,
        <TableCell
          padding="checkbox"
          key={'key-group-header' + columnDef.tableData.id}
          className={props.classes.header}
          style={options.headerStyle}
        />
      );
    });
  return (
    <TableHead ref={props.forwardedRef}>
      <TableRow className={props.classes.headerRow}>{headers}</TableRow>
    </TableHead>
  );
}

// TODO: Case when returning back to prev clicker column and keepSortDirectionOnColumnSwitch, should start form where user left
// Move this to a utils
const computeNewOrderDirection = (
  orderBy,
  orderDirection,
  columnDef,
  thirdSortClick,
  keepSortDirectionOnColumnSwitch
) => {
  if (columnDef.tableData.id !== orderBy) {
    if (keepSortDirectionOnColumnSwitch) {
      // use the current sort order when switching columns if defined
      return orderDirection || 'asc';
    } else {
      return 'asc';
    }
  } else if (orderDirection === 'asc') {
    return 'desc';
  } else if (orderDirection === 'desc') {
    if (thirdSortClick) {
      // third sort click brings to no order direction after desc
      return '';
    } else {
      return 'asc';
    }
  }
  return 'asc';
};

function RenderSortButton({
  columnDef,
  keepSortDirectionOnColumnSwitch,
  icon,
  thirdSortClick,
  onOrderChange,
  children,
  columnIndex,
  orderByCollection
}) {
  // console.log('orderByCollection', orderByCollection)
  const activeColumn = orderByCollection.find(
    ({ orderBy }) => orderBy === columnDef.tableData.id
  );

  // If current sorted column or prop asked to
  // maintain sort order when switching sorted column,
  // follow computed order direction if defined
  // else default direction is asc
  const direction =
    activeColumn || keepSortDirectionOnColumnSwitch
      ? (activeColumn && activeColumn.orderDirection) || 'asc'
      : 'asc';

  let ariaSort = 'none';
  if (activeColumn && direction === 'asc') {
    ariaSort = columnDef.ariaSortAsc ? columnDef.ariaSortAsc : 'Ascendant';
  } else if (activeColumn && direction === 'desc') {
    ariaSort = columnDef.ariaSortDesc ? columnDef.ariaSortDesc : 'Descendant';
  }

  const orderBy = activeColumn && activeColumn.orderBy;

  return (
    <TableSortLabel
      role=""
      aria-sort={ariaSort}
      aria-label={columnDef.ariaLabel}
      IconComponent={icon}
      active={!!activeColumn}
      data-testid="mtableheader-sortlabel"
      direction={direction}
      onClick={() => {
        const newOrderDirection = computeNewOrderDirection(
          orderBy,
          direction,
          columnDef,
          thirdSortClick,
          keepSortDirectionOnColumnSwitch
        );
        onOrderChange(columnDef.tableData.id, newOrderDirection, columnIndex);
      }}
    >
      {children}
    </TableSortLabel>
  );
}

MTableHeader.defaultProps = {
  dataCount: 0,
  selectedCount: 0,
  orderByCollection: []
};

MTableHeader.propTypes = {
  columns: PropTypes.array.isRequired,
  dataCount: PropTypes.number,
  hasDetailPanel: PropTypes.bool.isRequired,
  selectedCount: PropTypes.number,
  onAllSelected: PropTypes.func,
  onOrderChange: PropTypes.func,
  showActionsColumn: PropTypes.bool,
  orderByCollection: PropTypes.array,
  tooltip: PropTypes.string
};

export const styles = (theme) => ({
  headerRow: {
    zIndex: 10
  },
  header: {
    // display: 'inline-block',
    // position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.background.paper // Change according to theme,
  },
  headerWrap: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    left: 4
  },
  headerWrapRight: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    left: 4,
    justifyContent: 'flex-end'
  },
  headerContent: {
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },
  headerResize: {
    flex: 1,
    cursor: 'col-resize',
    position: 'absolute', // allow div to straddle adjacent columns
    height: '100%',
    width: 16,
    right: -8,
    zIndex: 20 // so half that overlaps next column can be used to resize
  }
});

const MTableHeaderRef = React.forwardRef(function MTableHeaderRef(props, ref) {
  return <MTableHeader {...props} forwardedRef={ref} />;
});

export default withStyles(styles, { name: 'MTableHeader', withTheme: true })(
  React.memo(MTableHeaderRef)
);
