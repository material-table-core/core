import React from 'react';
import PropTypes from 'prop-types';
import { TableBody, TableCell, TableRow } from '@material-ui/core';

function MTableBody({
  columns,
  options,
  pageSize,
  localization,
  icons,
  actions,
  detailPanel,
  hasDetailPanel,
  onEditingApproved,
  onEditingCanceled,
  onBulkEditRowChanged,
  getFieldValue,
  scrollWidth,
  components,
  errorState,
  isTreeData,
  bulkEditOpen,
  onRowSelected,
  currentPage,
  onToggleDetailPanel,
  onRowClick,
  onTreeExpandChanged,
  onFilterChanged,
  hasAnyEditingRow,
  treeDataMaxLevel,
  cellEditable,
  onCellEditStarted,
  onCellEditFinished,
  onGroupExpandChanged,
  showAddRow,
  renderData,
  initialFormData
}) {
  const renderDataC = renderData;
  const groups = columns
    .filter((col) => col.tableData.groupOrder > -1)
    .sort(
      (col1, col2) => col1.tableData.groupOrder - col2.tableData.groupOrder
    );

  let emptyRowCount = 0;
  if (options.paging) {
    emptyRowCount = pageSize - renderDataC.length;
  }
  function renderEmpty(emptyRowCount, renderData) {
    const rowHeight = options.padding === 'default' ? 49 : 36;
    const localizationCopy = {
      ...MTableBody.defaultProps.localization,
      ...localization
    };
    if (options.showEmptyDataSourceMessage && renderData.length === 0) {
      let addColumn = 0;
      if (options.selection) {
        addColumn++;
      }
      if (
        actions &&
        actions.filter((a) => a.position === 'row' || typeof a === 'function')
          .length > 0
      ) {
        addColumn++;
      }
      if (hasDetailPanel) {
        addColumn++;
      }
      if (isTreeData) {
        addColumn++;
      }
      return (
        <TableRow
          style={{
            height:
              rowHeight *
              (options.paging && options.emptyRowsWhenPaging ? pageSize : 1)
          }}
          key={'empty-' + 0}
        >
          <TableCell
            style={{ paddingTop: 0, paddingBottom: 0, textAlign: 'center' }}
            colSpan={columns.reduce(
              (currentVal, columnDef) =>
                columnDef.hidden ? currentVal : currentVal + 1,
              addColumn
            )}
            key="empty-"
          >
            {localizationCopy.emptyDataSourceMessage}
          </TableCell>
        </TableRow>
      );
    } else if (options.emptyRowsWhenPaging) {
      return (
        <React.Fragment>
          {[...Array(emptyRowCount)].map((r, index) => (
            <TableRow style={{ height: rowHeight }} key={'empty-' + index} />
          ))}
          {emptyRowCount > 0 && (
            <TableRow style={{ height: 1 }} key={'empty-last1'} />
          )}
        </React.Fragment>
      );
    }
  }

  function renderUngroupedRows(renderData) {
    return renderData.map((data, index) => {
      if (data.tableData.editing || bulkEditOpen) {
        return (
          <components.EditRow
            columns={columns.filter((columnDef) => !columnDef.hidden)}
            components={components}
            data={data}
            errorState={errorState}
            icons={icons}
            localization={{
              ...MTableBody.defaultProps.localization.editRow,
              ...localization.editRow,
              dateTimePickerLocalization:
                localization.dateTimePickerLocalization
            }}
            key={'row-' + data.tableData.id}
            mode={bulkEditOpen ? 'bulk' : data.tableData.editing}
            options={options}
            isTreeData={isTreeData}
            detailPanel={detailPanel}
            onEditingCanceled={onEditingCanceled}
            onEditingApproved={onEditingApproved}
            getFieldValue={getFieldValue}
            onBulkEditRowChanged={onBulkEditRowChanged}
            scrollWidth={scrollWidth}
          />
        );
      } else {
        return (
          <components.Row
            components={components}
            icons={icons}
            data={data}
            index={index}
            errorState={errorState}
            key={'row-' + data.tableData.id}
            level={0}
            options={options}
            localization={{
              ...MTableBody.defaultProps.localization.editRow,
              ...localization.editRow,
              dateTimePickerLocalization:
                localization.dateTimePickerLocalization
            }}
            onRowSelected={onRowSelected}
            actions={actions}
            columns={columns}
            getFieldValue={getFieldValue}
            detailPanel={detailPanel}
            path={[index + pageSize * currentPage]}
            onToggleDetailPanel={onToggleDetailPanel}
            onRowClick={onRowClick}
            isTreeData={isTreeData}
            onTreeExpandChanged={onTreeExpandChanged}
            onEditingCanceled={onEditingCanceled}
            onEditingApproved={onEditingApproved}
            hasAnyEditingRow={hasAnyEditingRow}
            treeDataMaxLevel={treeDataMaxLevel}
            cellEditable={cellEditable}
            onCellEditStarted={onCellEditStarted}
            onCellEditFinished={onCellEditFinished}
            scrollWidth={scrollWidth}
          />
        );
      }
    });
  }

  function renderGroupedRows(groups, renderData) {
    return renderData.map((groupData, index) => (
      <components.GroupRow
        actions={actions}
        key={groupData.value == null ? '' + index : groupData.value}
        columns={columns}
        components={components}
        detailPanel={detailPanel}
        getFieldValue={getFieldValue}
        groupData={groupData}
        groups={groups}
        icons={icons}
        level={0}
        path={[index + pageSize * currentPage]}
        onGroupExpandChanged={onGroupExpandChanged}
        onRowSelected={onRowSelected}
        onRowClick={onRowClick}
        onEditingCanceled={onEditingCanceled}
        onEditingApproved={onEditingApproved}
        onToggleDetailPanel={onToggleDetailPanel}
        onTreeExpandChanged={onTreeExpandChanged}
        options={options}
        isTreeData={isTreeData}
        hasAnyEditingRow={hasAnyEditingRow}
        localization={{
          ...MTableBody.defaultProps.localization.editRow,
          ...localization.editRow,
          dateTimePickerLocalization: localization.dateTimePickerLocalization
        }}
        cellEditable={cellEditable}
        onCellEditStarted={onCellEditStarted}
        onCellEditFinished={onCellEditFinished}
        onBulkEditRowChanged={onBulkEditRowChanged}
        scrollWidth={scrollWidth}
      />
    ));
  }

  return (
    <TableBody>
      {options.filtering && (
        <components.FilterRow
          columns={columns.filter((columnDef) => !columnDef.hidden)}
          icons={icons}
          hasActions={
            actions.filter(
              (a) => a.position === 'row' || typeof a === 'function'
            ).length > 0
          }
          actionsColumnIndex={options.actionsColumnIndex}
          onFilterChanged={onFilterChanged}
          selection={options.selection}
          localization={{
            ...MTableBody.defaultProps.localization.filterRow,
            ...localization.filterRow,
            dateTimePickerLocalization: localization.dateTimePickerLocalization
          }}
          hasDetailPanel={!!detailPanel}
          detailPanelColumnAlignment={props.options.detailPanelColumnAlignment}
          isTreeData={isTreeData}
          filterCellStyle={options.filterCellStyle}
          filterRowStyle={options.filterRowStyle}
          hideFilterIcons={options.hideFilterIcons}
          scrollWidth={scrollWidth}
        />
      )}
      {showAddRow && options.addRowPosition === 'first' && (
        <props.components.EditRow
          columns={columns.filter((columnDef) => !columnDef.hidden)}
          data={initialFormData}
          components={components}
          errorState={errorState}
          icons={icons}
          key="key-add-row"
          mode="add"
          localization={{
            ...MTableBody.defaultProps.localization.editRow,
            ...localization.editRow,
            dateTimePickerLocalization: localization.dateTimePickerLocalization
          }}
          options={options}
          isTreeData={isTreeData}
          detailPanel={detailPanel}
          onEditingCanceled={onEditingCanceled}
          onEditingApproved={onEditingApproved}
          getFieldValue={getFieldValue}
          scrollWidth={scrollWidth}
        />
      )}

      {groups.length > 0
        ? renderGroupedRows(groups, renderDataC)
        : renderUngroupedRows(renderDataC)}

      {showAddRow && options.addRowPosition === 'last' && (
        <components.EditRow
          columns={columns.filter((columnDef) => !columnDef.hidden)}
          data={initialFormData}
          components={components}
          errorState={errorState}
          icons={icons}
          key="key-add-row"
          mode="add"
          localization={{
            ...MTableBody.defaultProps.localization.editRow,
            ...localization.editRow,
            dateTimePickerLocalization: localization.dateTimePickerLocalization
          }}
          options={options}
          isTreeData={isTreeData}
          detailPanel={detailPanel}
          onEditingCanceled={onEditingCanceled}
          onEditingApproved={onEditingApproved}
          getFieldValue={getFieldValue}
          scrollWidth={scrollWidth}
        />
      )}
      {renderEmpty(emptyRowCount, renderDataC)}
    </TableBody>
  );
}

MTableBody.defaultProps = {
  actions: [],
  currentPage: 0,
  pageSize: 5,
  renderData: [],
  selection: false,
  localization: {
    emptyDataSourceMessage: 'No records to display',
    filterRow: {},
    editRow: {}
  }
};

MTableBody.propTypes = {
  actions: PropTypes.array,
  components: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  currentPage: PropTypes.number,
  detailPanel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.func]))
  ]),
  getFieldValue: PropTypes.func.isRequired,
  hasAnyEditingRow: PropTypes.bool,
  hasDetailPanel: PropTypes.bool.isRequired,
  icons: PropTypes.object.isRequired,
  isTreeData: PropTypes.bool.isRequired,
  onRowSelected: PropTypes.func,
  options: PropTypes.object.isRequired,
  pageSize: PropTypes.number,
  renderData: PropTypes.array,
  initialFormData: PropTypes.object,
  selection: PropTypes.bool.isRequired,
  scrollWidth: PropTypes.number.isRequired,
  showAddRow: PropTypes.bool,
  treeDataMaxLevel: PropTypes.number,
  localization: PropTypes.object,
  onFilterChanged: PropTypes.func,
  onGroupExpandChanged: PropTypes.func,
  onToggleDetailPanel: PropTypes.func.isRequired,
  onTreeExpandChanged: PropTypes.func.isRequired,
  onRowClick: PropTypes.func,
  onEditingCanceled: PropTypes.func,
  onEditingApproved: PropTypes.func,
  errorState: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  cellEditable: PropTypes.object,
  onCellEditStarted: PropTypes.func,
  onCellEditFinished: PropTypes.func,
  bulkEditOpen: PropTypes.bool,
  onBulkEditRowChanged: PropTypes.func
};

export default MTableBody;
