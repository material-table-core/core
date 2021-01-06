/* eslint-disable no-unused-vars */
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import * as React from 'react';
/* eslint-enable no-unused-vars */

const MTableBody = (props) => {
  const renderEmpty = (emptyRowCount, renderData) => {
    const rowHeight = props.options.padding === 'default' ? 49 : 36;
    const localization = {
      ...MTableBody.defaultProps.localization,
      ...props.localization,
    };
    if (props.options.showEmptyDataSourceMessage && renderData.length === 0) {
      let addColumn = 0;
      if (props.options.selection) {
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
              (props.options.paging && props.options.emptyRowsWhenPaging
                ? props.pageSize
                : 1),
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
    } else if (props.options.emptyRowsWhenPaging) {
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
  };

  const renderUngroupedRows = (renderData) => {
    return renderData.map((data, index) => {
      if (data.tableData.editing || props.bulkEditOpen) {
        return (
          <props.components.EditRow
            columns={props.columns.filter((columnDef) => {
              return !columnDef.hidden;
            })}
            components={props.components}
            data={data}
            errorState={props.errorState}
            icons={props.icons}
            localization={{
              ...MTableBody.defaultProps.localization.editRow,
              ...props.localization.editRow,
              dateTimePickerLocalization:
                props.localization.dateTimePickerLocalization,
            }}
            key={'row-' + data.tableData.id}
            mode={props.bulkEditOpen ? 'bulk' : data.tableData.editing}
            options={props.options}
            isTreeData={props.isTreeData}
            detailPanel={props.detailPanel}
            onEditingCanceled={props.onEditingCanceled}
            onEditingApproved={props.onEditingApproved}
            getFieldValue={props.getFieldValue}
            onBulkEditRowChanged={props.onBulkEditRowChanged}
            scrollWidth={props.scrollWidth}
          />
        );
      } else {
        return (
          <props.components.Row
            components={props.components}
            icons={props.icons}
            data={data}
            index={index}
            errorState={props.errorState}
            key={'row-' + data.tableData.id}
            level={0}
            options={props.options}
            localization={{
              ...MTableBody.defaultProps.localization.editRow,
              ...props.localization.editRow,
              dateTimePickerLocalization:
                props.localization.dateTimePickerLocalization,
            }}
            onRowSelected={props.onRowSelected}
            actions={props.actions}
            columns={props.columns}
            getFieldValue={props.getFieldValue}
            detailPanel={props.detailPanel}
            path={[index + props.pageSize * props.currentPage]}
            onToggleDetailPanel={props.onToggleDetailPanel}
            onRowClick={props.onRowClick}
            isTreeData={props.isTreeData}
            onTreeExpandChanged={props.onTreeExpandChanged}
            onEditingCanceled={props.onEditingCanceled}
            onEditingApproved={props.onEditingApproved}
            hasAnyEditingRow={props.hasAnyEditingRow}
            treeDataMaxLevel={props.treeDataMaxLevel}
            cellEditable={props.cellEditable}
            onCellEditStarted={props.onCellEditStarted}
            onCellEditFinished={props.onCellEditFinished}
            scrollWidth={props.scrollWidth}
          />
        );
      }
    });
  };

  const renderGroupedRows = (groups, renderData) => {
    return renderData.map((groupData, index) => (
      <props.components.GroupRow
        actions={props.actions}
        key={groupData.value == null ? '' + index : groupData.value}
        columns={props.columns}
        components={props.components}
        detailPanel={props.detailPanel}
        getFieldValue={props.getFieldValue}
        groupData={groupData}
        groups={groups}
        icons={props.icons}
        level={0}
        path={[index + props.pageSize * props.currentPage]}
        onGroupExpandChanged={props.onGroupExpandChanged}
        onRowSelected={props.onRowSelected}
        onRowClick={props.onRowClick}
        onEditingCanceled={props.onEditingCanceled}
        onEditingApproved={props.onEditingApproved}
        onToggleDetailPanel={props.onToggleDetailPanel}
        onTreeExpandChanged={props.onTreeExpandChanged}
        options={props.options}
        isTreeData={props.isTreeData}
        hasAnyEditingRow={props.hasAnyEditingRow}
        localization={{
          ...MTableBody.defaultProps.localization.editRow,
          ...props.localization.editRow,
          dateTimePickerLocalization:
            props.localization.dateTimePickerLocalization,
        }}
        cellEditable={props.cellEditable}
        onCellEditStarted={props.onCellEditStarted}
        onCellEditFinished={props.onCellEditFinished}
        onBulkEditRowChanged={props.onBulkEditRowChanged}
        scrollWidth={props.scrollWidth}
      />
    ));
  };

  const renderData = props.renderData;
  const groups = props.columns
    .filter((col) => col.tableData.groupOrder > -1)
    .sort(
      (col1, col2) => col1.tableData.groupOrder - col2.tableData.groupOrder
    );

  let emptyRowCount = 0;
  if (props.options.paging) {
    emptyRowCount = props.pageSize - renderData.length;
  }

  return (
    <TableBody>
      {props.options.filtering && (
        <props.components.FilterRow
          columns={props.columns.filter((columnDef) => !columnDef.hidden)}
          icons={props.icons}
          hasActions={
            props.actions.filter(
              (a) => a.position === 'row' || typeof a === 'function'
            ).length > 0
          }
          actionsColumnIndex={props.options.actionsColumnIndex}
          onFilterChanged={props.onFilterChanged}
          selection={props.options.selection}
          localization={{
            ...MTableBody.defaultProps.localization.filterRow,
            ...props.localization.filterRow,
            dateTimePickerLocalization:
              props.localization.dateTimePickerLocalization,
          }}
          hasDetailPanel={!!props.detailPanel}
          detailPanelColumnAlignment={props.options.detailPanelColumnAlignment}
          isTreeData={props.isTreeData}
          filterCellStyle={props.options.filterCellStyle}
          filterRowStyle={props.options.filterRowStyle}
          hideFilterIcons={props.options.hideFilterIcons}
          scrollWidth={props.scrollWidth}
        />
      )}
      {props.showAddRow && props.options.addRowPosition === 'first' && (
        <props.components.EditRow
          columns={props.columns.filter((columnDef) => {
            return !columnDef.hidden;
          })}
          data={props.initialFormData}
          components={props.components}
          errorState={props.errorState}
          icons={props.icons}
          key="key-add-row"
          mode="add"
          localization={{
            ...MTableBody.defaultProps.localization.editRow,
            ...props.localization.editRow,
            dateTimePickerLocalization:
              props.localization.dateTimePickerLocalization,
          }}
          options={props.options}
          isTreeData={props.isTreeData}
          detailPanel={props.detailPanel}
          onEditingCanceled={props.onEditingCanceled}
          onEditingApproved={props.onEditingApproved}
          getFieldValue={props.getFieldValue}
          scrollWidth={props.scrollWidth}
        />
      )}

      {groups.length > 0
        ? renderGroupedRows(groups, renderData)
        : renderUngroupedRows(renderData)}

      {props.showAddRow && props.options.addRowPosition === 'last' && (
        <props.components.EditRow
          columns={props.columns.filter((columnDef) => {
            return !columnDef.hidden;
          })}
          data={props.initialFormData}
          components={props.components}
          errorState={props.errorState}
          icons={props.icons}
          key="key-add-row"
          mode="add"
          localization={{
            ...MTableBody.defaultProps.localization.editRow,
            ...props.localization.editRow,
            dateTimePickerLocalization:
              props.localization.dateTimePickerLocalization,
          }}
          options={props.options}
          isTreeData={props.isTreeData}
          detailPanel={props.detailPanel}
          onEditingCanceled={props.onEditingCanceled}
          onEditingApproved={props.onEditingApproved}
          getFieldValue={props.getFieldValue}
          scrollWidth={props.scrollWidth}
        />
      )}
      {renderEmpty(emptyRowCount, renderData)}
    </TableBody>
  );
};

MTableBody.defaultProps = {
  actions: [],
  currentPage: 0,
  pageSize: 5,
  renderData: [],
  selection: false,
  localization: {
    emptyDataSourceMessage: 'No records to display',
    filterRow: {},
    editRow: {},
  },
};

MTableBody.propTypes = {
  actions: PropTypes.array,
  components: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  currentPage: PropTypes.number,
  detailPanel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.func])),
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
  onBulkEditRowChanged: PropTypes.func,
};

export default MTableBody;
