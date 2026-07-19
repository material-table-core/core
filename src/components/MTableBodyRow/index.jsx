// Third-party
import React from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  TableCell,
  IconButton,
  Tooltip,
  TableRow
} from '@mui/material';
// Internal
import { MTableDetailPanel } from '@components/m-table-detailpanel';
import * as CommonValues from '@utils/common-values';
import { useDoubleClick } from '@utils/hooks/useDoubleClick';
import { MTableCustomIcon } from '@components';
import { useLocalizationStore, useOptionStore, useIconStore } from '@store';

function MTableBodyRow({ forwardedRef, ...props }) {
  const localization = useLocalizationStore().body;
  const options = useOptionStore();
  const icons = useIconStore();
  const propsWithOptions = { ...props, options };
  const {
    data = {},
    components,
    detailPanel,
    getFieldValue,
    isTreeData,
    onRowSelected,
    onRowEditStarted,
    onTreeExpandChanged,
    onToggleDetailPanel,
    onEditingCanceled,
    onEditingApproved,
    hasAnyEditingRow,
    treeDataMaxLevel,
    path = [],
    actions = [],
    errorState,
    cellEditable,
    onCellEditStarted,
    onCellEditFinished,
    persistEvents = false,
    scrollWidth,
    onRowClick,
    onRowDoubleClick,
    columns: propColumns,
    ...rowProps
  } = props;
  const columns = propColumns.filter((columnDef) => !columnDef.hidden);
  const toggleDetailPanel = (panelIndex) => {
    let panel = detailPanel;
    if (Array.isArray(panel)) {
      panel = panel[panelIndex || 0];
      if (typeof panel === 'function') {
        panel = panel(data);
      }
      panel = panel.render;
    }
    onToggleDetailPanel(path, panel);
  };
  const enableEditMode = () => onRowEditStarted(data);
  // Make callbackActions a function to enable back wards compatibility
  const callbackActions = toggleDetailPanel;
  callbackActions.toggleDetailPanel = toggleDetailPanel;
  callbackActions.enableEditMode = enableEditMode;

  const onClick = (event, callback) => callback(event, data, callbackActions);

  const handleOnRowClick = useDoubleClick(
    onRowClick ? (e) => onClick(e, onRowClick) : undefined,
    onRowDoubleClick ? (e) => onClick(e, onRowDoubleClick) : undefined
  );

  const getRenderColumns = () => {
    const mapArr = columns
      .filter((columnDef) => !(columnDef.tableData.groupOrder > -1))
      .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
      .map((columnDef) => {
        const value = props.getFieldValue(data, columnDef);

        if (
          data.tableData.editCellList &&
          data.tableData.editCellList.find(
            (c) => c.tableData.id === columnDef.tableData.id
          )
        ) {
          return (
            <props.components.EditCell
              getFieldValue={props.getFieldValue}
              components={props.components}
              icons={icons}
              localization={localization}
              columnDef={columnDef}
              size={size}
              key={'cell-' + data.tableData.id + '-' + columnDef.tableData.id}
              rowData={data}
              cellEditable={props.cellEditable}
              onCellEditFinished={props.onCellEditFinished}
              scrollWidth={scrollWidth}
            />
          );
        } else {
          let isEditable =
            columnDef.editable !== 'never' && !!props.cellEditable;
          if (isEditable && props.cellEditable.isCellEditable) {
            isEditable = props.cellEditable.isCellEditable(data, columnDef);
          }

          const key = `cell-${data.tableData.id}-${columnDef.tableData.id}`;

          return (
            <props.components.Cell
              size={size}
              errorState={props.errorState}
              columnDef={{
                cellStyle: options.cellStyle,
                ...columnDef
              }}
              value={value}
              key={key}
              rowData={data}
              cellEditable={isEditable}
              onCellEditStarted={props.onCellEditStarted}
              scrollWidth={scrollWidth}
            />
          );
        }
      });
    return mapArr;
  };

  const size = CommonValues.elementSize(propsWithOptions);
  const width = actions.length * CommonValues.baseIconSize(propsWithOptions);
  const renderActions = (actions) => {
    return (
      <TableCell
        size={size}
        padding="none"
        key="key-actions-column"
        style={{
          width: width,
          padding: '0px 5px',
          boxSizing: 'border-box',
          ...options.actionsCellStyle
        }}
      >
        <props.components.Actions
          data={data}
          actions={actions}
          components={props.components}
          size={size}
          disabled={props.hasAnyEditingRow}
        />
      </TableCell>
    );
  };

  const renderSelectionColumn = () => {
    let checkboxProps = options.selectionProps || {};
    if (typeof checkboxProps === 'function') {
      checkboxProps = checkboxProps(data);
    }

    const selectionWidth =
      CommonValues.selectionMaxWidth(
        propsWithOptions,
        props.treeDataMaxLevel
      ) || 0;

    const styles = size !== 'medium' ? { padding: '4px' } : undefined;

    return (
      <TableCell
        size={size}
        padding="none"
        key="key-selection-column"
        style={{ width: selectionWidth }}
      >
        <Checkbox
          size={size}
          checked={data.tableData.checked === true}
          onClick={(e) => e.stopPropagation()}
          value={data.tableData.id.toString()}
          onChange={(event) => {
            props.onRowSelected(event, path, data);
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
    if (!options.showDetailPanelIcon) {
      return null;
    }
    if (typeof props.detailPanel === 'function') {
      return (
        <TableCell
          size={size}
          padding="none"
          key="key-detail-panel-column"
          style={{
            width: 42,
            textAlign: 'center',
            ...options.detailPanelColumnStyle
          }}
        >
          <IconButton
            aria-label="Detail panel visibility toggle"
            size={size}
            style={{
              transition: 'all ease 200ms',
              ...rotateIconStyle(data.tableData.showDetailPanel)
            }}
            onClick={(event) => {
              props.onToggleDetailPanel(path, props.detailPanel);
              event.stopPropagation();
            }}
          >
            <icons.DetailPanel />
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
              ...options.detailPanelColumnStyle
            }}
          >
            {props.detailPanel.map((panel, index) => {
              if (typeof panel === 'function') {
                panel = panel(data);
              }

              const isOpen =
                (data.tableData.showDetailPanel || '').toString() ===
                panel.render.toString();

              let iconButton = <icons.DetailPanel />;
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
                    props.onToggleDetailPanel(path, panel.render);
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
    if (data.tableData.childRows && data.tableData.childRows.length > 0) {
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
              ...rotateIconStyle(data.tableData.isTreeExpanded)
            }}
            onClick={(event) => {
              props.onTreeExpandChanged(path, data);
              event.stopPropagation();
            }}
          >
            <icons.DetailPanel />
          </IconButton>
        </TableCell>
      );
    } else {
      return <TableCell padding="none" key={'key-tree-data-column'} />;
    }
  };

  const getStyle = (index, level) => {
    let style = {};

    if (typeof options.rowStyle === 'function') {
      style = {
        ...style,
        ...options.rowStyle(data, index, level, props.hasAnyEditingRow)
      };
    } else if (options.rowStyle) {
      style = {
        ...style,
        ...options.rowStyle
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

  const renderColumns = getRenderColumns();
  if (options.selection) {
    renderColumns.splice(0, 0, renderSelectionColumn());
  }
  const rowActions = CommonValues.rowActions(props);
  if (rowActions.length > 0) {
    if (options.actionsColumnIndex === -1) {
      renderColumns.push(renderActions(rowActions));
    } else if (options.actionsColumnIndex >= 0) {
      let endPos = 0;
      if (options.selection) {
        endPos = 1;
      }
      renderColumns.splice(
        options.actionsColumnIndex + endPos,
        0,
        renderActions(rowActions)
      );
    }
  }

  // Then we add detail panel icon
  if (props.detailPanel) {
    if (options.detailPanelColumnAlignment === 'right') {
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
        ref={forwardedRef}
        selected={hasAnyEditingRow}
        {...rowProps}
        onClick={(event) => {
          if (persistEvents) {
            event.persist();
          }
          // Rows cannot be clicked while editing
          !hasAnyEditingRow && handleOnRowClick(event);
        }}
        hover={!!(onRowClick || onRowDoubleClick)}
        style={getStyle(rowProps.index || 0, props.level)}
        data-testid="mtablebodyrow"
      >
        {renderColumns}
      </TableRow>
      <MTableDetailPanel
        options={options}
        data={data}
        detailPanel={props.detailPanel}
        renderColumns={renderColumns}
        size={size}
      />
      {data.tableData.childRows &&
        data.tableData.isTreeExpanded &&
        data.tableData.childRows.map((data, index) => {
          if (data.tableData.editing) {
            return (
              <props.components.EditRow
                columns={columns}
                components={props.components}
                data={data}
                icons={icons}
                localization={localization.editRow}
                getFieldValue={props.getFieldValue}
                key={index}
                mode={data.tableData.editing}
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
                path={[...path, data.tableData.uuid]}
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

MTableBodyRow.propTypes = {
  forwardedRef: PropTypes.element,
  actions: PropTypes.array,
  index: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  detailPanel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.func]))
  ]),
  hasAnyEditingRow: PropTypes.bool,
  onRowSelected: PropTypes.func,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
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

export default React.forwardRef(function MTableBodyRowRef(props, ref) {
  return <MTableBodyRow {...props} forwardedRef={ref} />;
});
