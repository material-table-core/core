import React, { useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { setObjectByKey } from '@utils';
import { useOptionStore, useIconStore } from '@store';
import * as CommonValues from '@utils/common-values';
import { validateInput } from '@utils/validate';

function MTableEditRow(props) {
  const icons = useIconStore();
  const options = useOptionStore();
  const [state, setState] = useState(() => {
    let data = props.data
      ? props.data
      : props.columns
          .filter((column) => 'initialEditValue' in column && column.field)
          .reduce((prev, column) => {
            setObjectByKey(prev, column.field, column.initialEditValue);
            return prev;
          }, {});

    if (props.mode === 'bulk' && props.bulkEditChangedRows[data.tableData.id]) {
      data = props.bulkEditChangedRows[data.tableData.id].newData;
    }
    return { data };
  });

  function renderColumns() {
    const size = CommonValues.elementSize(props);
    let focusedCol = -1;
    const mapArr = props.columns
      .filter(
        (columnDef) =>
          !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
      )
      .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
      .map((columnDef, index) => {
        const value = props.getFieldValue(state.data, columnDef, false);
        const getCellStyle = (columnDef, value) => {
          let cellStyle = {
            color: 'inherit'
          };
          if (typeof columnDef.cellStyle === 'function') {
            cellStyle = {
              ...cellStyle,
              ...columnDef.cellStyle(value, props.data)
            };
          } else {
            cellStyle = { ...cellStyle, ...columnDef.cellStyle };
          }
          if (columnDef.disableClick) {
            cellStyle.cursor = 'default';
          }

          return { ...cellStyle };
        };

        const style = {};
        if (index === 0) {
          style.paddingLeft = 24 + props.level * 20;
        }

        let allowEditing = false;

        if (columnDef.editable === undefined) {
          allowEditing = true;
        }
        if (columnDef.editable === 'always') {
          allowEditing = true;
        }
        if (columnDef.editable === 'onAdd' && props.mode === 'add') {
          allowEditing = true;
        }
        if (columnDef.editable === 'onUpdate' && props.mode === 'update') {
          allowEditing = true;
        }
        if (typeof columnDef.editable === 'function') {
          allowEditing = columnDef.editable(columnDef, props.data);
        }
        if (!columnDef.field || !allowEditing) {
          const readonlyValue = props.getFieldValue(state.data, columnDef);
          return (
            <props.components.Cell
              size={size}
              icons={icons}
              columnDef={columnDef}
              value={readonlyValue}
              key={columnDef.tableData.id}
              rowData={props.data}
              style={getCellStyle(columnDef, value)}
            />
          );
        } else {
          const { editComponent, ...cellProps } = columnDef;
          const EditComponent = editComponent || props.components.EditField;
          const error = validateInput(columnDef, state.data);
          if (focusedCol === -1) {
            focusedCol = index;
          }
          return (
            <TableCell
              size={size}
              key={columnDef.tableData.id}
              align={
                ['numeric'].indexOf(columnDef.type) !== -1 ? 'right' : 'left'
              }
              style={getCellStyle(columnDef, value)}
            >
              <EditComponent
                key={columnDef.tableData.id}
                columnDef={cellProps}
                autoFocus={focusedCol === index}
                value={value}
                error={!error.isValid}
                helperText={error.helperText}
                locale={props.localization.dateTimePickerLocalization}
                rowData={state.data}
                onChange={(value) => {
                  const data = { ...state.data };
                  setObjectByKey(data, columnDef.field, value);
                  // data[columnDef.field] = value;
                  setState({ data });
                  if (props.onBulkEditRowChanged) {
                    props.onBulkEditRowChanged(props.data, data);
                  }
                }}
                onRowDataChange={(data) => {
                  setState({ data });
                  if (props.onBulkEditRowChanged) {
                    props.onBulkEditRowChanged(props.data, data);
                  }
                }}
              />
            </TableCell>
          );
        }
      });
    return mapArr;
  }
  const isValid = props.columns.every((column) => {
    const error = validateInput(column, state.data);
    return error.isValid;
  });

  const handleSave = () => {
    if (!isValid) {
      return;
    }
    props.onEditingApproved(props.mode, state.data, props.data);
  };

  function renderActions() {
    if (props.mode === 'bulk') {
      return;
    }

    const size = CommonValues.elementSize(props);

    const actions = [
      {
        icon: icons.Check,
        tooltip: props.localization.saveTooltip,
        disabled: !isValid,
        onClick: handleSave
      },
      {
        icon: icons.Clear,
        tooltip: props.localization.cancelTooltip,
        onClick: () => {
          props.onEditingCanceled(props.mode, props.data);
        }
      }
    ];
    return (
      <TableCell
        size={size}
        padding="none"
        key="key-actions-column"
        style={{
          width: 42 * actions.length,
          padding: '0px 5px',
          ...options.editCellStyle,
          ...options.actionsCellStyle
        }}
      >
        <props.components.Actions
          data={props.data}
          actions={actions}
          components={props.components}
          size={size}
        />
      </TableCell>
    );
  }

  function getStyle() {
    const style = {
      // boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.2)',
      borderBottom: '1px solid red'
    };

    return style;
  }

  const handleKeyDown = (e) => {
    if (
      e.keyCode === 13 &&
      e.target.type !== 'textarea' &&
      e.target.type !== 'button'
    ) {
      handleSave();
    } else if (e.keyCode === 13 && e.target.type === 'textarea' && e.shiftKey) {
      handleSave();
    } else if (e.keyCode === 27) {
      props.onEditingCanceled(props.mode, props.data);
    }
  };

  const size = CommonValues.elementSize(props);

  let columns;
  if (
    props.mode === 'add' ||
    props.mode === 'update' ||
    props.mode === 'bulk'
  ) {
    columns = renderColumns();
  } else {
    const colSpan = props.columns.filter(
      (columnDef) => !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
    ).length;
    columns = [
      <TableCell
        size={size}
        padding={options.actionsColumnIndex === 0 ? 'none' : undefined}
        key="key-edit-cell"
        colSpan={colSpan}
      >
        <Typography variant="h6">{props.localization.deleteText}</Typography>
      </TableCell>
    ];
  }

  if (options.selection) {
    columns.splice(0, 0, <TableCell padding="none" key="key-selection-cell" />);
  }
  if (props.isTreeData) {
    columns.splice(0, 0, <TableCell padding="none" key="key-tree-data-cell" />);
  }

  if (options.actionsColumnIndex === -1) {
    columns.push(renderActions());
  } else if (options.actionsColumnIndex >= 0) {
    let endPos = 0;
    if (options.selection) {
      endPos = 1;
    }
    if (props.isTreeData) {
      endPos = 1;
      if (options.selection) {
        columns.splice(1, 1);
      }
    }
    columns.splice(options.actionsColumnIndex + endPos, 0, renderActions());
  }

  // Lastly we add detail panel icon
  if (
    props.detailPanel &&
    options.showDetailPanelIcon !== false &&
    props.mode !== 'bulk'
  ) {
    const alignment = options.detailPanelColumnAlignment;
    const index = alignment === 'left' ? 0 : columns.length;
    columns.splice(
      index,
      0,
      <TableCell padding="none" key="key-detail-panel-cell" />
    );
  }

  props.columns
    .filter((columnDef) => columnDef.tableData.groupOrder > -1)
    .forEach((columnDef) => {
      columns.splice(
        0,
        0,
        <TableCell
          padding="none"
          key={'key-group-cell' + columnDef.tableData.id}
        />
      );
    });

  const {
    detailPanel,
    isTreeData,
    onRowClick,
    onRowSelected,
    onTreeExpandChanged,
    onToggleDetailPanel,
    onEditingApproved,
    onEditingCanceled,
    getFieldValue,
    components,
    columns: columnsProp, // renamed to not conflict with definition above
    errorState,
    onBulkEditRowChanged,
    bulkEditChangedRows,
    scrollWidth,
    forwardedRef,
    ...rowProps
  } = { ...defaultProps, ...props };

  return (
    <TableRow
      onKeyDown={handleKeyDown}
      {...rowProps}
      ref={forwardedRef}
      style={getStyle()}
    >
      {columns}
    </TableRow>
  );
}

const defaultProps = {
  actions: [],
  index: 0,
  options: {},
  path: [],
  onBulkEditRowChanged: () => {}
};

MTableEditRow.propTypes = {
  actions: PropTypes.array,
  index: PropTypes.number.isRequired,
  data: PropTypes.object,
  detailPanel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.func]))
  ]),
  onRowSelected: PropTypes.func,
  path: PropTypes.arrayOf(PropTypes.number),
  columns: PropTypes.array,
  onRowClick: PropTypes.func,
  onEditingApproved: PropTypes.func,
  onEditingCanceled: PropTypes.func,
  localization: PropTypes.object,
  getFieldValue: PropTypes.func,
  errorState: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onBulkEditRowChanged: PropTypes.func
};

export default React.forwardRef(function MTableWithRefEditRow(props, ref) {
  return <MTableEditRow {...props} forwardedRef={ref} />;
});
