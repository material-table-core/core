import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Draggable } from 'react-beautiful-dnd';
import { Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as CommonValues from '../../utils/common-values';

export function MTableHeader({ onColumnResized, ...props }) {
  const defaultMinColumnWidth = 20;
  const defaultMaxColumnWidth = 10000;

  const [resizing, setResizing] = React.useState(undefined);
  const [lastX, setLastX] = React.useState(0);

  const handleMouseDown = (e, columnDef, colIndex) => {
    const startX = e.clientX;
    const th = e.target.closest('th');
    const currentWidth =
      th && Math.round(+window.getComputedStyle(th).width.slice(0, -2));
    let initialColWidths = resizing?.initialColWidths;
    let nextWidth;
    let nextColIndex;
    if (props.tableWidth === 'full') {
      const nextTh = th.nextSibling;
      nextWidth =
        nextTh &&
        Math.round(+window.getComputedStyle(nextTh).width.slice(0, -2));
      nextColIndex = props.columns.findIndex(
        (c) => c.tableData.id === columnDef.tableData.id + 1
      );
    } else if (!initialColWidths) {
      // Ensure we have all column widths in pixels
      initialColWidths = Array.from(th.parentNode.children).map((th) =>
        Math.round(+window.getComputedStyle(th).width.slice(0, -2))
      );
    }

    setLastX(startX);
    setResizing({
      colIndex,
      nextColIndex,
      lastColData: { ...columnDef.tableData, width: currentWidth },
      ...(nextColIndex && {
        lastNextColData: {
          ...props.columns[nextColIndex].tableData,
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
      const col = props.columns[resizing.colIndex];
      const alreadyOffset =
        col.tableData.additionalWidth - resizing.lastColData.additionalWidth;
      let offset = constrainedColumnResize(
        col,
        resizing.lastColData.width + alreadyOffset,
        curX - lastX
      );
      offset = Math.round(offset);
      const widths = [resizing.lastColData.width + alreadyOffset];
      if (props.tableWidth === 'full') {
        offset = -constrainedColumnResize(
          props.columns[resizing.nextColIndex],
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
          props.columns[resizing.colIndex].tableData.id,
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
    const localization = {
      ...MTableHeader.defaultProps.localization,
      ...props.localization
    };
    const width = CommonValues.actionsColumnWidth(props);
    return (
      <TableCell
        key="key-actions-column"
        padding="checkbox"
        className={props.classes.header}
        style={{
          textAlign: 'center',
          ...props.headerStyle,
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
    const width = props.options.columnResizable
      ? CommonValues.reducePercentsInCalc(
          columnDef.tableData.width,
          props.scrollWidth
        )
      : columnDef.tableData.width;
    const style = {
      ...props.headerStyle,
      ...columnDef.headerStyle,
      boxSizing: 'border-box',
      width,
      ...(props.tableWidth === 'full' &&
        columnDef.minWidth && { minWidth: columnDef.minWidth }),
      ...(props.tableWidth === 'full' &&
        columnDef.maxWidth && { maxWidth: columnDef.maxWidth })
    };
    if (
      props.options.tableLayout === 'fixed' &&
      props.options.columnResizable &&
      columnDef.resizable !== false
    ) {
      style.paddingLeft = 8;
      style.paddingRight = 2;
      style.position = 'relative';
    }
    return style;
  };

  function RenderHeader() {
    const size = props.options.padding === 'default' ? 'medium' : 'small';

    return props.columns
      .filter(
        (columnDef) =>
          !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
      )
      .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
      .map((columnDef, index, allCols) => {
        let content = columnDef.title;

        if (props.draggable && columnDef.draggable !== false) {
          content = (
            <Draggable
              key={columnDef.tableData.id}
              draggableId={columnDef.tableData.id.toString()}
              index={index}
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
                      : { position: 'relative', minWidth: 0, display: 'flex' }
                  }
                >
                  {columnDef.sorting !== false && props.sorting ? (
                    <RenderSortButton
                      columnDef={columnDef}
                      orderBy={props.orderBy}
                      keepSortDirectionOnColumnSwitch={
                        props.keepSortDirectionOnColumnSwitch
                      }
                      orderDirection={props.orderDirection}
                      icon={props.icons.SortArrow}
                      thirdSortClick={props.thirdSortClick}
                      onOrderChange={props.onOrderChange}
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
        } else if (columnDef.sorting !== false && props.sorting) {
          content = (
            <RenderSortButton
              columnDef={columnDef}
              orderBy={props.orderBy}
              keepSortDirectionOnColumnSwitch={
                props.keepSortDirectionOnColumnSwitch
              }
              orderDirection={props.orderDirection}
              icon={props.icons.SortArrow}
              thirdSortClick={props.thirdSortClick}
              onOrderChange={props.onOrderChange}
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
          props.options.tableLayout === 'fixed' &&
          props.options.columnResizable &&
          columnDef.resizable !== false &&
          !(props.options.tableWidth === 'full' && index === allCols.length - 1)
        ) {
          const Resize = props.icons.Resize
            ? props.icons.Resize
            : (props) => <div {...props} data-test-id="drag_handle" />;
          content = (
            <div className={props.classes.headerWrap}>
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
        const cellAlignment =
          columnDef.align !== undefined
            ? columnDef.align
            : ['numeric', 'currency'].indexOf(columnDef.type) !== -1
            ? 'right'
            : 'left';
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
      props,
      props.treeDataMaxLevel
    );
    return (
      <TableCell
        padding="none"
        key="key-selection-column"
        className={props.classes.header}
        style={{ ...props.headerStyle, width: selectionWidth }}
      >
        {props.showSelectAllCheckbox && (
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
            {...props.options.headerSelectionProps}
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
        style={{ ...props.headerStyle }}
      />
    );
  }

  function render() {
    const headers = RenderHeader();
    if (props.hasSelection) {
      headers.splice(0, 0, renderSelectionHeader());
    }
    if (props.showActionsColumn) {
      if (props.actionsHeaderIndex >= 0) {
        let endPos = 0;
        if (props.hasSelection) {
          endPos = 1;
        }
        headers.splice(
          props.actionsHeaderIndex + endPos,
          0,
          renderActionsHeader()
        );
      } else if (props.actionsHeaderIndex === -1) {
        headers.push(renderActionsHeader());
      }
    }
    if (props.hasDetailPanel && props.options.showDetailPanelIcon) {
      if (props.detailPanelColumnAlignment === 'right') {
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
          style={{ ...props.headerStyle }}
        />
      );
    }
    props.columns
      .filter((columnDef) => columnDef.tableData.groupOrder > -1)
      .forEach((columnDef) => {
        headers.splice(
          0,
          0,
          <TableCell
            padding="checkbox"
            key={'key-group-header' + columnDef.tableData.id}
            className={props.classes.header}
            style={{ ...props.headerStyle }}
          />
        );
      });
    return (
      <TableHead ref={props.forwardedRef}>
        <TableRow className={props.classes.headerRow}>{headers}</TableRow>
      </TableHead>
    );
  }

  return render();
}

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
  orderBy,
  keepSortDirectionOnColumnSwitch,
  orderDirection,
  icon,
  thirdSortClick,
  onOrderChange,
  children
}) {
  const active = orderBy === columnDef.tableData.id;
  // If current sorted column or prop asked to
  // maintain sort order when switching sorted column,
  // follow computed order direction if defined
  // else default direction is asc
  const direction =
    active || keepSortDirectionOnColumnSwitch ? orderDirection || 'asc' : 'asc';
  let ariaSort = 'none';

  if (active && direction === 'asc') {
    ariaSort = columnDef.ariaSortAsc ? columnDef.ariaSortAsc : 'Ascendant';
  }
  if (active && direction === 'desc') {
    ariaSort = columnDef.ariaSortDesc ? columnDef.ariaSortDesc : 'Descendant';
  }

  return (
    <TableSortLabel
      role=""
      aria-sort={ariaSort}
      aria-label={columnDef.ariaLabel}
      IconComponent={icon}
      active={active}
      data-testid="mtableheader-sortlabel"
      direction={direction}
      onClick={() => {
        const newOrderDirection = computeNewOrderDirection(
          orderBy,
          orderDirection,
          columnDef,
          thirdSortClick,
          keepSortDirectionOnColumnSwitch
        );
        onOrderChange(columnDef.tableData.id, newOrderDirection);
      }}
    >
      {children}
    </TableSortLabel>
  );
}

MTableHeader.defaultProps = {
  dataCount: 0,
  hasSelection: false,
  headerStyle: {},
  selectedCount: 0,
  sorting: true,
  keepSortDirectionOnColumnSwitch: true,
  localization: {
    actions: 'Actions'
  },
  orderBy: undefined,
  orderDirection: 'asc',
  actionsHeaderIndex: 0,
  detailPanelColumnAlignment: 'left',
  draggable: true,
  thirdSortClick: true
};

MTableHeader.propTypes = {
  columns: PropTypes.array.isRequired,
  dataCount: PropTypes.number,
  hasDetailPanel: PropTypes.bool.isRequired,
  detailPanelColumnAlignment: PropTypes.string,
  hasSelection: PropTypes.bool,
  headerStyle: PropTypes.object,
  localization: PropTypes.object,
  selectedCount: PropTypes.number,
  sorting: PropTypes.bool,
  keepSortDirectionOnColumnSwitch: PropTypes.bool,
  onAllSelected: PropTypes.func,
  onOrderChange: PropTypes.func,
  orderBy: PropTypes.number,
  orderDirection: PropTypes.string,
  actionsHeaderIndex: PropTypes.number,
  showActionsColumn: PropTypes.bool,
  showSelectAllCheckbox: PropTypes.bool,
  draggable: PropTypes.bool,
  thirdSortClick: PropTypes.bool,
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
  headerContent: {
    minWidth: 0,
    display: 'flex',
    flex: '1 0 100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
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
  MTableHeaderRef
);
