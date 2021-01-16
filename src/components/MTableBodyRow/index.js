import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import * as CommonValues from '../../utils/common-values';

export default function MTableBodyRow({
  icons,
  data,
  index,
  level,
  columns,
  path,
  components,
  detailPanel,
  getFieldValue,
  isTreeData,
  onRowClick,
  onRowSelected,
  onTreeExpandChanged,
  onToggleDetailPanel,
  onEditingCanceled,
  onEditingApproved,
  options,
  hasAnyEditingRow,
  treeDataMaxLevel,
  localization,
  actions,
  errorState,
  cellEditable,
  onCellEditStarted,
  onCellEditFinished,
  scrollWidth,
  ...rowProps
}) {
  const size = CommonValues.elementSize({ options });
  const renderColumnsCopy = renderColumns();
  if (options.selection) {
    renderColumnsCopy.splice(0, 0, renderSelectionColumn());
  }
  if (
    actions &&
    actions.filter((a) => a.position === 'row' || typeof a === 'function')
      .length > 0
  ) {
    if (options.actionsColumnIndex === -1) {
      renderColumnsCopy.push(renderActions());
    } else if (options.actionsColumnIndex >= 0) {
      let endPos = 0;
      if (options.selection) {
        endPos = 1;
      }
      renderColumnsCopy.splice(
        options.actionsColumnIndex + endPos,
        0,
        renderActions()
      );
    }
  }

  // Then we add detail panel icon
  if (detailPanel) {
    if (options.detailPanelColumnAlignment === 'right') {
      renderColumnsCopy.push(renderDetailPanelColumn());
    } else {
      renderColumnsCopy.splice(0, 0, renderDetailPanelColumn());
    }
  }

  // Lastly we add tree data icon
  if (isTreeData) {
    renderColumnsCopy.splice(0, 0, renderTreeDataColumn());
  }

  columns
    .filter((columnDef) => columnDef.tableData.groupOrder > -1)
    .forEach((columnDef) => {
      renderColumnsCopy.splice(
        0,
        0,
        <TableCell
          size={size}
          padding="none"
          key={'key-group-cell' + columnDef.tableData.id}
        />
      );
    });

  function renderColumns() {
    const size = CommonValues.elementSize({ options });
    const mapArr = columns
      .filter(
        (columnDef) =>
          !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
      )
      .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
      .map((columnDef, index) => {
        const value = getFieldValue(data, columnDef);

        if (
          data.tableData.editCellList &&
          data.tableData.editCellList.find(
            (c) => c.tableData.id === columnDef.tableData.id
          )
        ) {
          return (
            <components.EditCell
              components={components}
              icons={icons}
              localization={localization}
              columnDef={columnDef}
              size={size}
              key={'cell-' + data.tableData.id + '-' + columnDef.tableData.id}
              rowData={data}
              cellEditable={cellEditable}
              onCellEditFinished={onCellEditFinished}
              scrollWidth={scrollWidth}
            />
          );
        } else {
          let isEditable = columnDef.editable !== 'never' && !!cellEditable;
          if (isEditable && cellEditable.isCellEditable) {
            isEditable = cellEditable.isCellEditable(data, columnDef);
          }
          return (
            <components.Cell
              size={size}
              errorState={errorState}
              icons={icons}
              columnDef={{
                cellStyle: options.cellStyle,
                ...columnDef
              }}
              value={value}
              key={'cell-' + data.tableData.id + '-' + columnDef.tableData.id}
              rowData={data}
              cellEditable={isEditable}
              onCellEditStarted={onCellEditStarted}
              scrollWidth={scrollWidth}
            />
          );
        }
      });
    return mapArr;
  }

  function renderActions() {
    const size = CommonValues.elementSize({ options });
    const actionsCopy = CommonValues.rowActions({ actions });
    const width = actions.length * CommonValues.baseIconSize({ options });
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
        <div style={{ display: 'flex' }}>
          <components.Actions
            data={data}
            actions={actionsCopy}
            components={components}
            size={size}
            disabled={hasAnyEditingRow}
          />
        </div>
      </TableCell>
    );
  }

  function renderSelectionColumn() {
    let checkboxProps = options.selectionProps || {};
    if (typeof checkboxProps === 'function') {
      checkboxProps = checkboxProps(data);
    }

    const size = CommonValues.elementSize({ options });
    const selectionWidth = CommonValues.selectionMaxWidth(
      { options },
      treeDataMaxLevel
    );

    const styles =
      size === 'medium'
        ? {
            marginLeft: level * 9
          }
        : {
            padding: '4px',
            marginLeft: 5 + level * 9
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
          checked={data.tableData.checked === true}
          onClick={(e) => e.stopPropagation()}
          value={data.tableData.id.toString()}
          onChange={(event) => onRowSelected(event, path, data)}
          style={styles}
          {...checkboxProps}
        />
      </TableCell>
    );
  }

  const rotateIconStyle = (isOpen) => ({
    transform: isOpen ? 'rotate(90deg)' : 'none'
  });

  function renderDetailPanelColumn() {
    const size = CommonValues.elementSize({ options });
    // eslint-disable-next-line react/prop-types
    /**
     * @todo Write propTypes.
     */
    // eslint-disable-next-line react/prop-types
    const CustomIcon = ({ icon, iconProps }) =>
      // eslint-disable-next-line multiline-ternary
      typeof icon === 'string' ? (
        <Icon {...iconProps}>{icon}</Icon>
      ) : (
        React.createElement(icon, { ...iconProps })
      );

    if (typeof detailPanel === 'function') {
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
            aria-label="Detail panel visiblity toggle"
            size={size}
            style={{
              transition: 'all ease 200ms',
              ...rotateIconStyle(data.tableData.showDetailPanel)
            }}
            onClick={(event) => {
              onToggleDetailPanel(path, detailPanel);
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
              width: 42 * detailPanel.length,
              textAlign: 'center',
              display: 'flex',
              ...options.detailPanelColumnStyle
            }}
          >
            {detailPanel.map((panel, index) => {
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
                    <CustomIcon
                      icon={panel.openIcon}
                      iconProps={panel.iconProps}
                    />
                  );
                  animation = false;
                } else if (panel.icon) {
                  iconButton = (
                    <CustomIcon icon={panel.icon} iconProps={panel.iconProps} />
                  );
                }
              } else if (panel.icon) {
                iconButton = (
                  <CustomIcon icon={panel.icon} iconProps={panel.iconProps} />
                );
                animation = false;
              }

              iconButton = (
                <IconButton
                  aria-label="Detail panel visiblity toggle"
                  size={size}
                  key={'key-detail-panel-' + index}
                  style={{
                    transition: 'all ease 200ms',
                    ...rotateIconStyle(animation && isOpen)
                  }}
                  disabled={panel.disabled}
                  onClick={(event) => {
                    onToggleDetailPanel(path, panel.render);
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
  }

  function renderTreeDataColumn() {
    const size = CommonValues.elementSize({ options });
    if (data.tableData.childRows && data.tableData.childRows.length > 0) {
      return (
        <TableCell
          size={size}
          padding="none"
          key={'key-tree-data-column'}
          style={{ width: 48 + 9 * (treeDataMaxLevel - 2) }}
        >
          <IconButton
            aria-label="Detail panel visiblity toggle"
            size={size}
            style={{
              transition: 'all ease 200ms',
              marginLeft: level * 9,
              ...rotateIconStyle(data.tableData.isTreeExpanded)
            }}
            onClick={(event) => {
              onTreeExpandChanged(path, data);
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
  }

  function getStyle(index, level) {
    let style = {
      transition: 'all ease 300ms'
    };

    if (typeof options.rowStyle === 'function') {
      style = {
        ...style,
        ...options.rowStyle(data, index, level, hasAnyEditingRow)
      };
    } else if (options.rowStyle) {
      style = {
        ...style,
        ...options.rowStyle
      };
    }

    if (onRowClick) {
      style.cursor = 'pointer';
    }

    if (hasAnyEditingRow) {
      style.opacity = style.opacity ? style.opacity : 0.2;
    }

    return style;
  }

  return (
    <>
      <TableRow
        selected={hasAnyEditingRow}
        {...rowProps}
        hover={!!onRowClick}
        style={getStyle(index, level)}
        onClick={(event) => {
          onRowClick &&
            onRowClick(event, data, (panelIndex) => {
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
        }}
      >
        {renderColumnsCopy}
      </TableRow>
      {data.tableData && data.tableData.showDetailPanel && (
        <TableRow
        // selected={index % 2 === 0}
        >
          <TableCell
            size={size}
            colSpan={renderColumnsCopy.length}
            padding="none"
          >
            {data.tableData.showDetailPanel(data)}
          </TableCell>
        </TableRow>
      )}
      {data.tableData.childRows &&
        data.tableData.isTreeExpanded &&
        data.tableData.childRows.map((data, index) => {
          if (data.tableData.editing) {
            return (
              <components.EditRow
                columns={columns.filter((columnDef) => {
                  return !columnDef.hidden;
                })}
                components={components}
                data={data}
                icons={icons}
                localization={localization}
                getFieldValue={getFieldValue}
                key={index}
                mode={data.tableData.editing}
                options={options}
                isTreeData={isTreeData}
                detailPanel={detailPanel}
                onEditingCanceled={onEditingCanceled}
                onEditingApproved={onEditingApproved}
                errorState={errorState}
              />
            );
          } else {
            return (
              <components.Row
                data={data}
                index={index}
                key={index}
                level={level + 1}
                path={[...path, index]}
                onEditingCanceled={onEditingCanceled}
                onEditingApproved={onEditingApproved}
                hasAnyEditingRow={hasAnyEditingRow}
                treeDataMaxLevel={treeDataMaxLevel}
                errorState={errorState}
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
  path: []
};

MTableBodyRow.propTypes = {
  actions: PropTypes.array,
  icons: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,

  // add prop types not 100% they are correct
  // ----------------------------------------------
  icon: PropTypes.string,
  iconProps: PropTypes.object,
  level: PropTypes.number,
  components: PropTypes.object,
  isTreeData: PropTypes.bool,
  onTreeExpandChanged: PropTypes.func,
  cellEditable: PropTypes.object,
  onCellEditStarted: PropTypes.func,
  onCellEditFinished: PropTypes.func,
  scrollWidth: PropTypes.number,
  localization: PropTypes.object,
  // ---------------------------------------------
  detailPanel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.func]))
  ]),
  hasAnyEditingRow: PropTypes.bool,
  options: PropTypes.object.isRequired,
  onRowSelected: PropTypes.func,
  path: PropTypes.arrayOf(PropTypes.number),
  treeDataMaxLevel: PropTypes.number,
  getFieldValue: PropTypes.func.isRequired,
  columns: PropTypes.array,
  onToggleDetailPanel: PropTypes.func.isRequired,
  onRowClick: PropTypes.func,
  onEditingApproved: PropTypes.func,
  onEditingCanceled: PropTypes.func,
  errorState: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};
