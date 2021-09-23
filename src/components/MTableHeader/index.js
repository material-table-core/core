import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Draggable } from 'react-beautiful-dnd';
import { Tooltip, withStyles } from '@material-ui/core';
import * as CommonValues from '../../utils/common-values';

export function MTableHeader({ onColumnResized, ...props }) {
  const [
    { resizingColumnDef, lastX, lastAdditionalWidth }, // Extract the props to use instead of the whole state object
    setState
  ] = React.useState({
    lastX: 0,
    resizingColumnDef: undefined
  });

  const handleMouseDown = (e, columnDef) => {
    let target = e.clientX;
    setState((prevState) => ({
      ...prevState,
      lastAdditionalWidth: columnDef.tableData.additionalWidth,
      lastX: target,
      resizingColumnDef: columnDef
    }));
  };
  const handleMouseMove = React.useCallback(
    // Use usecallback to prevent triggering theuse effect too much
    (e) => {
      if (!resizingColumnDef) return;
      let additionalWidth = lastAdditionalWidth + e.clientX - lastX;
      additionalWidth = Math.min(
        resizingColumnDef.maxWidth || additionalWidth,
        additionalWidth
      );
      let th = e.target.closest('th');
      let currentWidth = th && +window.getComputedStyle(th).width.slice(0, -2);
      let realWidth =
        currentWidth -
        resizingColumnDef.tableData.additionalWidth +
        lastAdditionalWidth -
        lastX +
        e.clientX;
      if (realWidth <= resizingColumnDef.minWidth && realWidth < currentWidth)
        return;
      if (resizingColumnDef.tableData.additionalWidth !== additionalWidth) {
        onColumnResized(resizingColumnDef.tableData.id, additionalWidth);
      }
    },
    [onColumnResized, resizingColumnDef, lastX, lastAdditionalWidth]
  );

  const handleMouseUp = React.useCallback((e) => {
    setState((prevState) => ({ ...prevState, resizingColumnDef: undefined })); // Using the useState to always have to correct state object
  }, []);

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
          ...props.headerStyle,
          width: width,
          textAlign: 'center',
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
      maxWidth: columnDef.maxWidth,
      minWidth: columnDef.minWidth
    };
    if (
      props.options.tableLayout === 'fixed' &&
      props.options.columnResizable &&
      columnDef.resizable !== false
    ) {
      style.paddingRight = 2;
    }
    return style;
  };

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

  function renderHeader() {
    const size = props.options.padding === 'default' ? 'medium' : 'small';

    const mapArr = props.columns
      .filter(
        (columnDef) =>
          !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
      )
      .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
      .map((columnDef, index) => {
        let content = columnDef.title;

        if (props.draggable && columnDef.draggable !== false) {
          content = (
            <Draggable
              key={columnDef.tableData.id}
              draggableId={columnDef.tableData.id.toString()}
              index={index}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={
                    snapshot.isDragging ? provided.draggableProps.style : {}
                  }
                >
                  {columnDef.title}
                </div>
              )}
            </Draggable>
          );
        }
        if (columnDef.sorting !== false && props.sorting) {
          content = (
            <TableSortLabel
              role=""
              IconComponent={props.icons.SortArrow}
              active={props.orderBy === columnDef.tableData.id}
              data-testid="mtableheader-sortlabel"
              direction={
                // If current sorted column or prop asked to
                // maintain sort order when switching sorted column,
                // follow computed order direction if defined
                // else default direction is asc
                columnDef.tableData.id === props.orderBy ||
                props.keepSortDirectionOnColumnSwitch
                  ? props.orderDirection || 'asc'
                  : 'asc'
              }
              onClick={() => {
                const orderDirection = computeNewOrderDirection(
                  props.orderBy,
                  props.orderDirection,
                  columnDef,
                  props.thirdSortClick,
                  props.keepSortDirectionOnColumnSwitch
                );
                props.onOrderChange(columnDef.tableData.id, orderDirection);
              }}
            >
              {content}
            </TableSortLabel>
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
          columnDef.resizable !== false
        ) {
          content = (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>{content}</div>
              <div></div>
              <props.icons.Resize
                style={{
                  cursor: 'col-resize',
                  color:
                    resizingColumnDef &&
                    resizingColumnDef.tableData.id === columnDef.tableData.id
                      ? props.theme.palette.primary.main
                      : 'inherit'
                }}
                onMouseDown={(e) => handleMouseDown(e, columnDef)}
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
    return mapArr;
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
    const headers = renderHeader();
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
        <TableRow>{headers}</TableRow>
      </TableHead>
    );
  }

  return render();
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
  header: {
    // display: 'inline-block',
    // position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: theme.palette.background.paper // Change according to theme,
  }
});

const MTableHeaderRef = React.forwardRef(function MTableHeaderRef(props, ref) {
  return <MTableHeader {...props} forwardedRef={ref} />;
});

export default withStyles(styles, { withTheme: true })(MTableHeaderRef);
