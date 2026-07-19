import React from 'react';
import PropTypes from 'prop-types';
import { TableBody, TableCell, TableRow } from '@mui/material';
import { useLocalizationStore, useOptionStore, useIconStore } from '@store';

function MTableBody(userProps) {
  const props = { ...defaultProps, ...userProps };
  const localization = useLocalizationStore().body;
  const options = useOptionStore();
  const icons = useIconStore();

  const columns = props.columns.filter((columnDef) => !columnDef.hidden);

  function renderEmpty(emptyRowCount, renderData) {
    const rowHeight = options.padding === 'normal' ? 49 : 36;
    if (options.showEmptyDataSourceMessage && renderData.length === 0) {
      let addColumn = 0;
      if (options.selection) {
        addColumn++;
      }
      if (
        props.actions &&
        props.actions.filter(
          (a) => a.position === 'row' || typeof a === 'function'
        ).length > 0
      ) {
        addColumn++;
      }
      if (props.hasDetailPanel) {
        addColumn++;
      }
      if (props.isTreeData) {
        addColumn++;
      }
      return (
        <TableRow
          style={{
            height:
              rowHeight *
              (options.paging && options.emptyRowsWhenPaging
                ? props.pageSize
                : 1)
          }}
          key={'empty-' + 0}
        >
          <TableCell
            style={{ paddingTop: 0, paddingBottom: 0, textAlign: 'center' }}
            colSpan={props.columns.reduce(
              (currentVal, columnDef) =>
                columnDef.hidden ? currentVal : currentVal + 1,
              addColumn
            )}
            key="empty-"
          >
            {localization.emptyDataSourceMessage}
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
      if (data.tableData.editing || props.bulkEditOpen) {
        return (
          <props.components.EditRow
            columns={columns}
            components={props.components}
            data={data}
            errorState={props.errorState}
            icons={icons}
            localization={localization.editRow}
            key={'row-' + data.tableData.uuid}
            mode={props.bulkEditOpen ? 'bulk' : data.tableData.editing}
            isTreeData={props.isTreeData}
            detailPanel={props.detailPanel}
            onEditingCanceled={props.onEditingCanceled}
            onEditingApproved={props.onEditingApproved}
            bulkEditChangedRows={props.bulkEditChangedRows}
            getFieldValue={props.getFieldValue}
            onBulkEditRowChanged={props.onBulkEditRowChanged}
            scrollWidth={props.scrollWidth}
          />
        );
      } else {
        // Treeified data is using the uuid, while the grouped data used the index
        const path = props.isTreeData
          ? [data.tableData.uuid]
          : [index + props.pageSize * props.currentPage];
        return (
          <props.components.Row
            components={props.components}
            data={data}
            index={index}
            errorState={props.errorState}
            key={'row-' + data.tableData.uuid}
            level={0}
            onRowSelected={props.onRowSelected}
            actions={props.actions}
            columns={props.columns}
            getFieldValue={props.getFieldValue}
            detailPanel={props.detailPanel}
            path={path}
            onToggleDetailPanel={props.onToggleDetailPanel}
            onRowClick={props.onRowClick}
            onRowDoubleClick={props.onRowDoubleClick}
            isTreeData={props.isTreeData}
            onTreeExpandChanged={props.onTreeExpandChanged}
            onEditingCanceled={props.onEditingCanceled}
            onEditingApproved={props.onEditingApproved}
            hasAnyEditingRow={props.hasAnyEditingRow}
            treeDataMaxLevel={props.treeDataMaxLevel}
            cellEditable={props.cellEditable}
            onCellEditStarted={props.onCellEditStarted}
            onCellEditFinished={props.onCellEditFinished}
            onRowEditStarted={props.onRowEditStarted}
            scrollWidth={props.scrollWidth}
          />
        );
      }
    });
  }

  function renderGroupedRows(groups, renderData) {
    return renderData.map((groupData, index) => (
      <props.components.GroupRow
        actions={props.actions}
        cellEditable={props.cellEditable}
        columns={props.columns}
        components={props.components}
        detailPanel={props.detailPanel}
        getFieldValue={props.getFieldValue}
        groupData={groupData}
        groups={groups}
        hasAnyEditingRow={props.hasAnyEditingRow}
        icons={icons}
        isTreeData={props.isTreeData}
        key={groupData.value == null ? '' + index : groupData.value}
        level={0}
        localization={localization.editRow}
        onBulkEditRowChanged={props.onBulkEditRowChanged}
        onCellEditFinished={props.onCellEditFinished}
        onCellEditStarted={props.onCellEditStarted}
        onEditingApproved={props.onEditingApproved}
        onEditingCanceled={props.onEditingCanceled}
        onGroupExpandChanged={props.onGroupExpandChanged}
        onRowClick={props.onRowClick}
        onGroupSelected={props.onGroupSelected}
        onRowSelected={props.onRowSelected}
        onToggleDetailPanel={props.onToggleDetailPanel}
        onTreeExpandChanged={props.onTreeExpandChanged}
        path={[index + props.pageSize * props.currentPage]}
        scrollWidth={props.scrollWidth}
        treeDataMaxLevel={props.treeDataMaxLevel}
      />
    ));
  }

  function renderAddRow() {
    return (
      props.showAddRow && (
        <props.components.EditRow
          columns={columns}
          components={props.components}
          data={props.initialFormData}
          detailPanel={props.detailPanel}
          errorState={props.errorState}
          getFieldValue={props.getFieldValue}
          icons={icons}
          isTreeData={props.isTreeData}
          key="key-add-row"
          localization={localization.editRow}
          mode="add"
          onEditingApproved={props.onEditingApproved}
          onEditingCanceled={props.onEditingCanceled}
          scrollWidth={props.scrollWidth}
        />
      )
    );
  }

  const renderData = props.renderData;
  const groups = props.columns
    .filter((col) => col.tableData.groupOrder > -1)
    .sort(
      (col1, col2) => col1.tableData.groupOrder - col2.tableData.groupOrder
    );

  let emptyRowCount = 0;
  if (options.paging && props.pageSize > renderData.length) {
    emptyRowCount = props.pageSize - renderData.length;
  }
  const renderSummaryRow = React.useMemo(
    () =>
      props.renderSummaryRow
        ? (columnData) =>
            props.renderSummaryRow({
              ...columnData,
              data: props.data,
              currentData: props.currentData
            })
        : undefined,
    [props.data]
  );
  return (
    <TableBody ref={props.forwardedRef}>
      {options.filtering && (
        <props.components.FilterRow
          columns={columns}
          icons={icons}
          hasActions={props.actions.some(
            (a) => a.position === 'row' || typeof a === 'function'
          )}
          onFilterChanged={props.onFilterChanged}
          localization={localization.filterRow}
          hasDetailPanel={!!props.detailPanel}
          isTreeData={props.isTreeData}
          scrollWidth={props.scrollWidth}
          hideFilterIcons={props.options.hideFilterIcons}
        />
      )}
      {options.addRowPosition === 'first' && renderAddRow()}

      {groups.length > 0
        ? renderGroupedRows(groups, renderData)
        : renderUngroupedRows(renderData)}

      {options.addRowPosition === 'last' && renderAddRow()}
      <props.components.SummaryRow
        columns={columns}
        renderSummaryRow={renderSummaryRow}
        rowProps={props}
      />
      {renderEmpty(emptyRowCount, renderData)}
    </TableBody>
  );
}

const defaultProps = {
  actions: [],
  currentPage: 0,
  data: [],
  pageSize: 5,
  renderData: [],
  selection: false
};

MTableBody.propTypes = {
  actions: PropTypes.array,
  bulkEditChangedRows: PropTypes.object,
  bulkEditOpen: PropTypes.bool,
  cellEditable: PropTypes.object,
  columns: PropTypes.array.isRequired,
  components: PropTypes.object.isRequired,
  currentPage: PropTypes.number,
  data: PropTypes.array,
  detailPanel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.func]))
  ]),
  errorState: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  forwardedRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  getFieldValue: PropTypes.func.isRequired,
  hasAnyEditingRow: PropTypes.bool,
  hasDetailPanel: PropTypes.bool.isRequired,
  initialFormData: PropTypes.object,
  isTreeData: PropTypes.bool.isRequired,
  onBulkEditRowChanged: PropTypes.func,
  onCellEditFinished: PropTypes.func,
  onCellEditStarted: PropTypes.func,
  onEditingApproved: PropTypes.func,
  onEditingCanceled: PropTypes.func,
  onFilterChanged: PropTypes.func,
  onGroupExpandChanged: PropTypes.func,
  onRowClick: PropTypes.func,
  onRowDoubleClick: PropTypes.func,
  onGroupSelected: PropTypes.func,
  onRowSelected: PropTypes.func,
  onToggleDetailPanel: PropTypes.func.isRequired,
  onTreeExpandChanged: PropTypes.func.isRequired,
  pageSize: PropTypes.number,
  renderData: PropTypes.array,
  renderSummaryRow: PropTypes.func,
  scrollWidth: PropTypes.number.isRequired,
  selection: PropTypes.bool,
  showAddRow: PropTypes.bool,
  treeDataMaxLevel: PropTypes.number
};

export default React.forwardRef(function MTableBodyRef(props, ref) {
  return <MTableBody {...props} forwardedRef={ref} />;
});
