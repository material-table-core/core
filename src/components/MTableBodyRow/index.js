import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import * as CommonValues from '../../utils/common-values';

export default function MTableBodyRow(props) {
  console.log('🚀 ~ file: index.js ~ line 12 ~ MTableBodyRow ~ props', props);
  const {
    icons,
    data,
    columns,
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
  } = props;

  const size = CommonValues.elementSize({ options });
  const renderColumnsCopy = renderColumns();
  if (props.options.selection) {
    renderColumnsCopy.splice(0, 0, renderSelectionColumn());
  }
  if (
    props.actions &&
    props.actions.filter((a) => a.position === 'row' || typeof a === 'function')
      .length > 0
  ) {
    if (props.options.actionsColumnIndex === -1) {
      renderColumnsCopy.push(renderActions());
    } else if (props.options.actionsColumnIndex >= 0) {
      let endPos = 0;
      if (props.options.selection) {
        endPos = 1;
      }
      renderColumnsCopy.splice(
        props.options.actionsColumnIndex + endPos,
        0,
        renderActions()
      );
    }
  }

  // Then we add detail panel icon
  if (props.detailPanel) {
    if (props.options.detailPanelColumnAlignment === 'right') {
      renderColumnsCopy.push(renderDetailPanelColumn());
    } else {
      renderColumnsCopy.splice(0, 0, renderDetailPanelColumn());
    }
  }

  // Lastly we add tree data icon
  if (props.isTreeData) {
    renderColumnsCopy.splice(0, 0, renderTreeDataColumn());
  }

  props.columns
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
              key={
                'cell-' + props.data.tableData.id + '-' + columnDef.tableData.id
              }
              rowData={props.data}
              cellEditable={isEditable}
              onCellEditStarted={props.onCellEditStarted}
              scrollWidth={props.scrollWidth}
            />
          );
        }
      });
    return mapArr;
  }

  function renderActions() {
    const size = CommonValues.elementSize(props);
    const actions = CommonValues.rowActions(props);
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
        <div style={{ display: 'flex' }}>
          <props.components.Actions
            data={props.data}
            actions={actions}
            components={props.components}
            size={size}
            disabled={props.hasAnyEditingRow}
          />
        </div>
      </TableCell>
    );
  }

  function renderSelectionColumn() {
    let checkboxProps = props.options.selectionProps || {};
    if (typeof checkboxProps === 'function') {
      checkboxProps = checkboxProps(props.data);
    }

    const size = CommonValues.elementSize(props);
    const selectionWidth = CommonValues.selectionMaxWidth(
      props,
      props.treeDataMaxLevel
    );

    const styles =
      size === 'medium'
        ? {
            marginLeft: props.level * 9
          }
        : {
            padding: '4px',
            marginLeft: 5 + props.level * 9
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
          onChange={(event) =>
            props.onRowSelected(event, props.path, props.data)
          }
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
    const size = CommonValues.elementSize(props);
    const CustomIcon = ({ icon, iconProps }) =>
      typeof icon === 'string' ? (
        <Icon {...iconProps}>{icon}</Icon>
      ) : (
        React.createElement(icon, { ...iconProps })
      );

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
            aria-label="Detail panel visiblity toggle"
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
  }

  function renderTreeDataColumn() {
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
            aria-label="Detail panel visiblity toggle"
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
  }

  function getStyle(index, level) {
    let style = {
      transition: 'all ease 300ms'
    };

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

    if (props.onRowClick) {
      style.cursor = 'pointer';
    }

    if (props.hasAnyEditingRow) {
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
        style={getStyle(props.index, props.level)}
        onClick={(event) => {
          onRowClick &&
            onRowClick(event, props.data, (panelIndex) => {
              let panel = detailPanel;
              if (Array.isArray(panel)) {
                panel = panel[panelIndex || 0];
                if (typeof panel === 'function') {
                  panel = panel(props.data);
                }
                panel = panel.render;
              }
              onToggleDetailPanel(props.path, panel);
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
  path: []
};

MTableBodyRow.propTypes = {
  actions: PropTypes.array,
  icons: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,

  // add prop types not 100% they are correct
  // ----------------------------------------------
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
