// Third-party
import React from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  TableCell,
  IconButton,
  Tooltip,
  TableRow
} from '@material-ui/core';
// Internal
import { MTableDetailPanel } from '@components/m-table-detailpanel';
import * as CommonValues from '@utils/common-values';
import { useDoubleClick } from '@utils/hooks/useDoubleClick';
import { MTableCustomIcon } from '@components';

export default function MTableBodyRow(props) {
  const {
    icons,
    data,
    columns,
    components,
    detailPanel,
    getFieldValue,
    isTreeData,
    onRowSelected,
    onTreeExpandChanged,
    onToggleDetailPanel,
    onEditingCanceled,
    onEditingApproved,
    options,
    hasAnyEditingRow,
    treeDataMaxLevel,
    path,
    localization,
    actions,
    errorState,
    cellEditable,
    onCellEditStarted,
    onCellEditFinished,
    persistEvents,
    scrollWidth,
    onRowClick,
    onRowDoubleClick,
    ...rowProps
  } = props;

  const onClick = (event, callback) =>
    callback(event, data, (panelIndex) => {
      let panel = detailPanel;
      if (Array.isArray(panel)) {
        panel = panel[panelIndex || 0];
        if (typeof panel === 'function') {
          panel = panel(data);
        }
        panel = panel.render;
      }
      onToggleDetailPanel(path, panel);
    });

  const handleOnRowClick = useDoubleClick(
    onRowClick ? (e) => onClick(e, onRowClick) : undefined,
    onRowDoubleClick ? (e) => onClick(e, onRowDoubleClick) : undefined
  );

  const getRenderColumns = () => {
    const size = CommonValues.elementSize(props);
    const mapArr = props.columns
      .filter(
        (columnDef) =>
          !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
      )
      .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
      .map((columnDef, index) => {
        const value = props.getFieldValue(props.data, columnDef);

        if (
          props.data.tableData.editCellList &&
          props.data.tableData.editCellList.find(
            (c) => c.tableData.id === columnDef.tableData.id
          )
        ) {
          return (
            <props.components.EditCell
              components={props.components}
              icons={props.icons}
              localization={props.localization}
              columnDef={columnDef}
              size={size}
              key={
                'cell-' + props.data.tableData.id + '-' + columnDef.tableData.id
              }
              rowData={props.data}
              cellEditable={props.cellEditable}
              onCellEditFinished={props.onCellEditFinished}
              scrollWidth={props.scrollWidth}
            />
          );
        } else {
          let isEditable =
            columnDef.editable !== 'never' && !!props.cellEditable;
          if (isEditable && props.cellEditable.isCellEditable) {
            isEditable = props.cellEditable.isCellEditable(
              props.data,
              columnDef
            );
          }

          const key = `cell-${props.data.tableData.id}-${columnDef.tableData.id}`;

          return (
            <props.components.Cell
              size={size}
              errorState={props.errorState}
              icons={props.icons}
              columnDef={{
                cellStyle: props.options.cellStyle,
                ...columnDef
              }}
              value={value}
              key={key}
              rowData={props.data}
              cellEditable={isEditable}
              onCellEditStarted={props.onCellEditStarted}
              scrollWidth={props.scrollWidth}
            />
          );
        }
      });
    return mapArr;
  };

  const renderActions = (actions) => {
    const size = CommonValues.elementSize(props);
    const width = actions.length * CommonValues.baseIconSize(props);
    return (
      <TableCell
        size={size}
        padding="none"
        key="key-actions-column"
        style={{
          width: width,
          padding: '0px 5px',
          boxSizing: 'border-box',
          ...props.options.actionsCellStyle
        }}
      >
        <props.components.Actions
          data={props.data}
          actions={actions}
          components={props.components}
          size={size}
          disabled={props.hasAnyEditingRow}
        />
      </TableCell>
    );
  };

  const renderSelectionColumn = () => {
    let checkboxProps = props.options.selectionProps || {};
    if (typeof checkboxProps === 'function') {
      checkboxProps = checkboxProps(props.data);
    }

    const size = CommonValues.elementSize(props);
    const selectionWidth =
      CommonValues.selectionMaxWidth(props, props.treeDataMaxLevel) || 0;

    const styles =
      size === 'medium'
        ? {
            marginLeft: props.level * 9 || 0
          }
        : {
            padding: '4px',
            marginLeft: 5 + props.level * 9 || 0
          };

    return (
      <TableCell
        size={size}
        padding="none"
        key="key-selection-column"
        style={{ width: selectionWidth }}
      >
        <Checkbox
          size={size}
          checked={props.data.tableData.checked === true}
          onClick={(e) => e.stopPropagation()}
          value={props.data.tableData.id.toString()}
          onChange={(event) => {
            props.onRowSelected(event, props.path, props.data);
          }}
          style={styles}
          {...checkboxProps}
        />
      </TableCell>
    );
  };

  const rotateIconStyle = (isOpen) => ({
    transform: isOpen ? 'rotate(90deg)' : 'none'
  });

  const renderDetailPanelColumn = () => {
    if (!props.options.showDetailPanelIcon) {
      return null;
    }
    const size = CommonValues.elementSize(props);
    if (typeof props.detailPanel === 'function') {
      return (
        <TableCell
          size={size}
          padding="none"
          key="key-detail-panel-column"
          style={{
            width: 42,
            textAlign: 'center',
            ...props.options.detailPanelColumnStyle
          }}
        >
          <IconButton
            aria-label="Detail panel visibility toggle"
            size={size}
            style={{
              transition: 'all ease 200ms',
              ...rotateIconStyle(props.data.tableData.showDetailPanel)
            }}
            onClick={(event) => {
              props.onToggleDetailPanel(props.path, props.detailPanel);
              event.stopPropagation();
            }}
          >
            <props.icons.DetailPanel />
          </IconButton>
        </TableCell>
      );
    } else {
      return (
        <TableCell size={size} padding="none" key="key-detail-panel-column">
          <div
            style={{
              width: 42 * props.detailPanel.length,
              textAlign: 'center',
              display: 'flex',
              ...props.options.detailPanelColumnStyle
            }}
          >
            {props.detailPanel.map((panel, index) => {
              if (typeof panel === 'function') {
                panel = panel(props.data);
              }

              const isOpen =
                (props.data.tableData.showDetailPanel || '').toString() ===
                panel.render.toString();

              let iconButton = <props.icons.DetailPanel />;
              let animation = true;
              if (isOpen) {
                if (panel.openIcon) {
                  iconButton = (
                    <MTableCustomIcon
                      icon={panel.openIcon}
                      iconProps={panel.iconProps}
                    />
                  );
                  animation = false;
                } else if (panel.icon) {
                  iconButton = (
                    <MTableCustomIcon
                      icon={panel.icon}
                      iconProps={panel.iconProps}
                    />
                  );
                }
              } else if (panel.icon) {
                iconButton = (
                  <MTableCustomIcon
                    icon={panel.icon}
                    iconProps={panel.iconProps}
                  />
                );
                animation = false;
              }

              iconButton = (
                <IconButton
                  aria-label="Detail panel visibility toggle"
                  size={size}
                  key={'key-detail-panel-' + index}
                  style={{
                    transition: 'all ease 200ms',
                    ...rotateIconStyle(animation && isOpen)
                  }}
                  disabled={panel.disabled}
                  onClick={(event) => {
                    props.onToggleDetailPanel(props.path, panel.render);
                    event.stopPropagation();
                  }}
                >
                  {iconButton}
                </IconButton>
              );

              if (panel.tooltip) {
                iconButton = (
                  <Tooltip
                    key={'key-detail-panel-' + index}
                    title={panel.tooltip}
                  >
                    {iconButton}
                  </Tooltip>
                );
              }

              return iconButton;
            })}
          </div>
        </TableCell>
      );
    }
  };

  const renderTreeDataColumn = () => {
    const size = CommonValues.elementSize(props);
    if (
      props.data.tableData.childRows &&
      props.data.tableData.childRows.length > 0
    ) {
      return (
        <TableCell
          size={size}
          padding="none"
          key={'key-tree-data-column'}
          style={{ width: 48 + 9 * (props.treeDataMaxLevel - 2) }}
        >
          <IconButton
            aria-label="Detail panel visibility toggle"
            size={size}
            style={{
              transition: 'all ease 200ms',
              marginLeft: props.level * 9,
              ...rotateIconStyle(props.data.tableData.isTreeExpanded)
            }}
            onClick={(event) => {
              props.onTreeExpandChanged(props.path, props.data);
              event.stopPropagation();
            }}
          >
            <props.icons.DetailPanel />
          </IconButton>
        </TableCell>
      );
    } else {
      return <TableCell padding="none" key={'key-tree-data-column'} />;
    }
  };

  const getStyle = (index, level) => {
    let style = {};

    if (typeof props.options.rowStyle === 'function') {
      style = {
        ...style,
        ...props.options.rowStyle(
          props.data,
          index,
          level,
          props.hasAnyEditingRow
        )
      };
    } else if (props.options.rowStyle) {
      style = {
        ...style,
        ...props.options.rowStyle
      };
    }

    if (onRowClick || onRowDoubleClick) {
      style.cursor = 'pointer';
    }

    if (props.hasAnyEditingRow) {
      style.opacity = style.opacity ? style.opacity : 0.2;
    }

    return style;
  };

  const size = CommonValues.elementSize(props);
  const renderColumns = getRenderColumns();
  if (props.options.selection) {
    renderColumns.splice(0, 0, renderSelectionColumn());
  }
  const rowActions = CommonValues.rowActions(props);
  if (rowActions.length > 0) {
    if (props.options.actionsColumnIndex === -1) {
      renderColumns.push(renderActions(rowActions));
    } else if (props.options.actionsColumnIndex >= 0) {
      let endPos = 0;
      if (props.options.selection) {
        endPos = 1;
      }
      renderColumns.splice(
        props.options.actionsColumnIndex + endPos,
        0,
        renderActions(rowActions)
      );
    }
  }

  // Then we add detail panel icon
  if (props.detailPanel) {
    if (props.options.detailPanelColumnAlignment === 'right') {
      renderColumns.push(renderDetailPanelColumn());
    } else {
      renderColumns.splice(0, 0, renderDetailPanelColumn());
    }
  }

  // Lastly we add tree data icon
  if (props.isTreeData) {
    renderColumns.splice(0, 0, renderTreeDataColumn());
  }

  props.columns
    .filter((columnDef) => columnDef.tableData.groupOrder > -1)
    .forEach((columnDef) => {
      renderColumns.splice(
        0,
        0,
        <TableCell
          size={size}
          padding="none"
          key={'key-group-cell' + columnDef.tableData.id}
        />
      );
    });
  return (
    <>
      <TableRow
        selected={hasAnyEditingRow}
        {...rowProps}
        onClick={(event) => {
          if (persistEvents) {
            event.persist();
          }
          handleOnRowClick(event);
        }}
        hover={onRowClick !== null || onRowDoubleClick !== null}
        style={getStyle(props.index, props.level)}
      >
        {renderColumns}
      </TableRow>
      <MTableDetailPanel
        options={props.options}
        data={props.data}
        detailPanel={props.detailPanel}
        renderColumns={renderColumns}
        size={size}
      />
      {props.data.tableData.childRows &&
        props.data.tableData.isTreeExpanded &&
        props.data.tableData.childRows.map((data, index) => {
          if (data.tableData.editing) {
            return (
              <props.components.EditRow
                columns={props.columns.filter((columnDef) => {
                  return !columnDef.hidden;
                })}
                components={props.components}
                data={data}
                icons={props.icons}
                localization={props.localization}
                getFieldValue={props.getFieldValue}
                key={index}
                mode={data.tableData.editing}
                options={props.options}
                isTreeData={props.isTreeData}
                detailPanel={props.detailPanel}
                onEditingCanceled={onEditingCanceled}
                onEditingApproved={onEditingApproved}
                errorState={props.errorState}
              />
            );
          } else {
            return (
              <props.components.Row
                {...props}
                data={data}
                index={index}
                key={index}
                level={props.level + 1}
                path={[...props.path, index]}
                onEditingCanceled={onEditingCanceled}
                onEditingApproved={onEditingApproved}
                hasAnyEditingRow={props.hasAnyEditingRow}
                treeDataMaxLevel={treeDataMaxLevel}
                errorState={props.errorState}
                cellEditable={cellEditable}
                onCellEditStarted={onCellEditStarted}
                onCellEditFinished={onCellEditFinished}
              />
            );
          }
        })}
    </>
  );
}

MTableBodyRow.defaultProps = {
  actions: [],
  index: 0,
  data: {},
  options: {},
  path: [],
  persistEvents: false
};

MTableBodyRow.propTypes = {
  actions: PropTypes.array,
  icons: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  detailPanel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.func]))
  ]),
  hasAnyEditingRow: PropTypes.bool,
  options: PropTypes.object.isRequired,
  onRowSelected: PropTypes.func,
  path: PropTypes.arrayOf(PropTypes.number),
  persistEvents: PropTypes.bool,
  treeDataMaxLevel: PropTypes.number,
  getFieldValue: PropTypes.func.isRequired,
  columns: PropTypes.array,
  onToggleDetailPanel: PropTypes.func.isRequired,
  onRowClick: PropTypes.func,
  onRowDoubleClick: PropTypes.func,
  onEditingApproved: PropTypes.func,
  onEditingCanceled: PropTypes.func,
  errorState: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};
