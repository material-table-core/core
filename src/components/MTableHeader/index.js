import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import withStyles from '@material-ui/core/styles/withStyles';
import { Draggable } from 'react-beautiful-dnd';
import { Tooltip } from '@material-ui/core';
import * as CommonValues from '../../utils/common-values';

export function MTableHeader(props) {
  const [state, setState] = React.useState(() => ({
    lastX: 0,
    resizingColumnDef: undefined
  }));

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e, columnDef) => {
    setState({
      ...state,
      lastAdditionalWidth: columnDef.tableData.additionalWidth,
      lastX: e.clientX,
      resizingColumnDef: columnDef
    });
  };

  const handleMouseMove = (e) => {
    if (!state.resizingColumnDef) {
      return;
    }
    let additionalWidth = state.lastAdditionalWidth + e.clientX - state.lastX;
    additionalWidth = Math.min(
      state.resizingColumnDef.maxWidth || additionalWidth,
      additionalWidth
    );
    if (state.resizingColumnDef.tableData.additionalWidth !== additionalWidth) {
      props.onColumnResized(
        state.resizingColumnDef.tableData.id,
        additionalWidth
      );
    }
  };

  const handleMouseUp = (e) => {
    setState({ ...state, resizingColumnDef: undefined });
  };

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
    const width = CommonValues.reducePercentsInCalc(
      columnDef.tableData.width,
      props.scrollWidth
    );
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

        if (props.draggable) {
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
              IconComponent={props.icons.SortArrow}
              active={props.orderBy === columnDef.tableData.id}
              direction={props.orderDirection || 'asc'}
              onClick={() => {
                const orderDirection =
                  columnDef.tableData.id !== props.orderBy
                    ? 'asc'
                    : props.orderDirection === 'asc'
                    ? 'desc'
                    : props.orderDirection === 'desc' && props.thirdSortClick
                    ? ''
                    : props.orderDirection === 'desc' && !props.thirdSortClick
                    ? 'asc'
                    : props.orderDirection === ''
                    ? 'asc'
                    : 'desc';
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
                    state.resizingColumnDef &&
                    state.resizingColumnDef.tableData.id ===
                      columnDef.tableData.id
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
    if (props.hasDetailPanel) {
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
          />
        );
      });
    return (
      <TableHead>
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
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: theme.palette.background.paper // Change according to theme,
  }
});

export default withStyles(styles, { withTheme: true })(MTableHeader);
