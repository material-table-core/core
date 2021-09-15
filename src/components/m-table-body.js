import React from 'react';
import PropTypes from 'prop-types';
import { TableBody, TableCell, TableRow } from '@material-ui/core';

class MTableBody extends React.Component {
  renderEmpty(emptyRowCount, renderData) {
    const rowHeight = this.props.options.padding === 'default' ? 49 : 36;
    const localization = {
      ...MTableBody.defaultProps.localization,
      ...this.props.localization
    };
    if (
      this.props.options.showEmptyDataSourceMessage &&
      renderData.length === 0
    ) {
      let addColumn = 0;
      if (this.props.options.selection) {
        addColumn++;
      }
      if (
        this.props.actions &&
        this.props.actions.filter(
          (a) => a.position === 'row' || typeof a === 'function'
        ).length > 0
      ) {
        addColumn++;
      }
      if (this.props.hasDetailPanel) {
        addColumn++;
      }
      if (this.props.isTreeData) {
        addColumn++;
      }
      return (
        <TableRow
          style={{
            height:
              rowHeight *
              (this.props.options.paging &&
              this.props.options.emptyRowsWhenPaging
                ? this.props.pageSize
                : 1)
          }}
          key={'empty-' + 0}
        >
          <TableCell
            style={{ paddingTop: 0, paddingBottom: 0, textAlign: 'center' }}
            colSpan={this.props.columns.reduce(
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
    } else if (this.props.options.emptyRowsWhenPaging) {
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

  renderUngroupedRows(renderData) {
    return renderData.map((data, index) => {
      if (data.tableData.editing || this.props.bulkEditOpen) {
        return (
          <this.props.components.EditRow
            columns={this.props.columns.filter((columnDef) => {
              return !columnDef.hidden;
            })}
            components={this.props.components}
            data={data}
            errorState={this.props.errorState}
            icons={this.props.icons}
            localization={{
              ...MTableBody.defaultProps.localization.editRow,
              ...this.props.localization.editRow,
              dateTimePickerLocalization: this.props.localization
                .dateTimePickerLocalization
            }}
            key={'row-' + data.tableData.uuid}
            mode={this.props.bulkEditOpen ? 'bulk' : data.tableData.editing}
            options={this.props.options}
            isTreeData={this.props.isTreeData}
            detailPanel={this.props.detailPanel}
            onEditingCanceled={this.props.onEditingCanceled}
            onEditingApproved={this.props.onEditingApproved}
            bulkEditChangedRows={this.props.bulkEditChangedRows}
            getFieldValue={this.props.getFieldValue}
            onBulkEditRowChanged={this.props.onBulkEditRowChanged}
            scrollWidth={this.props.scrollWidth}
          />
        );
      } else {
        return (
          <this.props.components.Row
            components={this.props.components}
            icons={this.props.icons}
            data={data}
            index={index}
            errorState={this.props.errorState}
            key={'row-' + data.tableData.uuid}
            level={0}
            options={this.props.options}
            localization={{
              ...MTableBody.defaultProps.localization.editRow,
              ...this.props.localization.editRow,
              dateTimePickerLocalization: this.props.localization
                .dateTimePickerLocalization
            }}
            onRowSelected={this.props.onRowSelected}
            actions={this.props.actions}
            columns={this.props.columns}
            getFieldValue={this.props.getFieldValue}
            detailPanel={this.props.detailPanel}
            path={[index + this.props.pageSize * this.props.currentPage]}
            onToggleDetailPanel={this.props.onToggleDetailPanel}
            onRowClick={this.props.onRowClick}
            onRowDoubleClick={this.props.onRowDoubleClick}
            isTreeData={this.props.isTreeData}
            onTreeExpandChanged={this.props.onTreeExpandChanged}
            onEditingCanceled={this.props.onEditingCanceled}
            onEditingApproved={this.props.onEditingApproved}
            hasAnyEditingRow={this.props.hasAnyEditingRow}
            treeDataMaxLevel={this.props.treeDataMaxLevel}
            cellEditable={this.props.cellEditable}
            onCellEditStarted={this.props.onCellEditStarted}
            onCellEditFinished={this.props.onCellEditFinished}
            scrollWidth={this.props.scrollWidth}
          />
        );
      }
    });
  }

  renderGroupedRows(groups, renderData) {
    return renderData.map((groupData, index) => (
      <this.props.components.GroupRow
        actions={this.props.actions}
        cellEditable={this.props.cellEditable}
        columns={this.props.columns}
        components={this.props.components}
        detailPanel={this.props.detailPanel}
        getFieldValue={this.props.getFieldValue}
        groupData={groupData}
        groups={groups}
        hasAnyEditingRow={this.props.hasAnyEditingRow}
        icons={this.props.icons}
        isTreeData={this.props.isTreeData}
        key={groupData.value == null ? '' + index : groupData.value}
        level={0}
        localization={{
          ...MTableBody.defaultProps.localization.editRow,
          ...this.props.localization.editRow,
          dateTimePickerLocalization: this.props.localization
            .dateTimePickerLocalization
        }}
        onBulkEditRowChanged={this.props.onBulkEditRowChanged}
        onCellEditFinished={this.props.onCellEditFinished}
        onCellEditStarted={this.props.onCellEditStarted}
        onEditingApproved={this.props.onEditingApproved}
        onEditingCanceled={this.props.onEditingCanceled}
        onGroupExpandChanged={this.props.onGroupExpandChanged}
        onRowClick={this.props.onRowClick}
        onGroupSelected={this.props.onGroupSelected}
        onRowSelected={this.props.onRowSelected}
        onToggleDetailPanel={this.props.onToggleDetailPanel}
        onTreeExpandChanged={this.props.onTreeExpandChanged}
        options={this.props.options}
        path={[index + this.props.pageSize * this.props.currentPage]}
        scrollWidth={this.props.scrollWidth}
        treeDataMaxLevel={this.props.treeDataMaxLevel}
      />
    ));
  }

  renderAddRow() {
    return (
      this.props.showAddRow && (
        <this.props.components.EditRow
          columns={this.props.columns.filter((columnDef) => {
            return !columnDef.hidden;
          })}
          components={this.props.components}
          data={this.props.initialFormData}
          detailPanel={this.props.detailPanel}
          errorState={this.props.errorState}
          getFieldValue={this.props.getFieldValue}
          icons={this.props.icons}
          isTreeData={this.props.isTreeData}
          key="key-add-row"
          localization={{
            ...MTableBody.defaultProps.localization.editRow,
            ...this.props.localization.editRow,
            dateTimePickerLocalization: this.props.localization
              .dateTimePickerLocalization
          }}
          mode="add"
          onEditingApproved={this.props.onEditingApproved}
          onEditingCanceled={this.props.onEditingCanceled}
          options={this.props.options}
          scrollWidth={this.props.scrollWidth}
        />
      )
    );
  }

  render() {
    const renderData = this.props.renderData;
    const groups = this.props.columns
      .filter((col) => col.tableData.groupOrder > -1)
      .sort(
        (col1, col2) => col1.tableData.groupOrder - col2.tableData.groupOrder
      );

    let emptyRowCount = 0;
    if (this.props.options.paging) {
      emptyRowCount = this.props.pageSize - renderData.length;
    }

    const columns = this.props.columns.filter((columnDef) => !columnDef.hidden);

    return (
      <TableBody>
        {this.props.options.filtering && (
          <this.props.components.FilterRow
            columns={columns}
            icons={this.props.icons}
            hasActions={
              this.props.actions.filter(
                (a) => a.position === 'row' || typeof a === 'function'
              ).length > 0
            }
            actionsColumnIndex={this.props.options.actionsColumnIndex}
            onFilterChanged={this.props.onFilterChanged}
            selection={this.props.options.selection}
            localization={{
              ...MTableBody.defaultProps.localization.filterRow,
              ...this.props.localization.filterRow,
              dateTimePickerLocalization: this.props.localization
                .dateTimePickerLocalization
            }}
            hasDetailPanel={!!this.props.detailPanel}
            detailPanelColumnAlignment={
              this.props.options.detailPanelColumnAlignment
            }
            isTreeData={this.props.isTreeData}
            filterCellStyle={this.props.options.filterCellStyle}
            filterRowStyle={this.props.options.filterRowStyle}
            hideFilterIcons={this.props.options.hideFilterIcons}
            scrollWidth={this.props.scrollWidth}
          />
        )}
        {this.props.options.addRowPosition === 'first' && this.renderAddRow()}

        {groups.length > 0
          ? this.renderGroupedRows(groups, renderData)
          : this.renderUngroupedRows(renderData)}

        {this.props.options.addRowPosition === 'last' && this.renderAddRow()}
        <this.props.components.SummaryRow
          currentData={renderData}
          columns={columns}
          data={this.props.data}
          renderSummaryRow={this.props.renderSummaryRow}
          rowProps={this.props}
        />
        {this.renderEmpty(emptyRowCount, renderData)}
      </TableBody>
    );
  }
}

MTableBody.defaultProps = {
  actions: [],
  currentPage: 0,
  data: [],
  localization: {
    editRow: {},
    emptyDataSourceMessage: 'No records to display',
    filterRow: {}
  },
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
  getFieldValue: PropTypes.func.isRequired,
  hasAnyEditingRow: PropTypes.bool,
  hasDetailPanel: PropTypes.bool.isRequired,
  icons: PropTypes.object.isRequired,
  initialFormData: PropTypes.object,
  isTreeData: PropTypes.bool.isRequired,
  localization: PropTypes.object,
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
  options: PropTypes.object.isRequired,
  pageSize: PropTypes.number,
  renderData: PropTypes.array,
  renderSummaryRow: PropTypes.func,
  scrollWidth: PropTypes.number.isRequired,
  selection: PropTypes.bool.isRequired,
  showAddRow: PropTypes.bool,
  treeDataMaxLevel: PropTypes.number
};

export default MTableBody;
