import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import React from 'react';

function MTableGroupRow(props) {
  const rotateIconStyle = (isOpen) => ({
    transform: isOpen ? 'rotate(90deg)' : 'none'
  });

  function render() {
    let colSpan = props.columns.filter((columnDef) => !columnDef.hidden).length;
    props.options.selection && colSpan++;
    props.detailPanel && colSpan++;
    props.actions && props.actions.length > 0 && colSpan++;
    const column = props.groups[props.level];

    let detail;
    if (props.groupData.isExpanded) {
      if (props.groups.length > props.level + 1) {
        // Is there another group
        detail = props.groupData.groups.map((groupData, index) => (
          <props.components.GroupRow
            actions={props.actions}
            key={groupData.value || '' + index}
            columns={props.columns}
            components={props.components}
            detailPanel={props.detailPanel}
            getFieldValue={props.getFieldValue}
            groupData={groupData}
            groups={props.groups}
            icons={props.icons}
            level={props.level + 1}
            path={[...props.path, index]}
            onGroupExpandChanged={props.onGroupExpandChanged}
            onGroupSelected={props.onGroupSelected}
            onRowSelected={props.onRowSelected}
            onRowClick={props.onRowClick}
            onToggleDetailPanel={props.onToggleDetailPanel}
            onTreeExpandChanged={props.onTreeExpandChanged}
            onEditingCanceled={props.onEditingCanceled}
            onEditingApproved={props.onEditingApproved}
            options={props.options}
            hasAnyEditingRow={props.hasAnyEditingRow}
            isTreeData={props.isTreeData}
            cellEditable={props.cellEditable}
            onCellEditStarted={props.onCellEditStarted}
            onCellEditFinished={props.onCellEditFinished}
            scrollWidth={props.scrollWidth}
            treeDataMaxLevel={props.treeDataMaxLevel}
          />
        ));
      } else {
        detail = props.groupData.data.map((rowData, index) => {
          if (rowData.tableData.editing) {
            return (
              <props.components.EditRow
                columns={props.columns}
                components={props.components}
                data={rowData}
                icons={props.icons}
                path={[...props.path, index]}
                localization={props.localization}
                key={index}
                mode={rowData.tableData.editing}
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
                actions={props.actions}
                key={index}
                columns={props.columns}
                components={props.components}
                data={rowData}
                detailPanel={props.detailPanel}
                level={(props.level || 0) + 1}
                getFieldValue={props.getFieldValue}
                icons={props.icons}
                path={[...props.path, index]}
                onRowSelected={props.onRowSelected}
                onRowClick={props.onRowClick}
                onToggleDetailPanel={props.onToggleDetailPanel}
                options={props.options}
                isTreeData={props.isTreeData}
                onTreeExpandChanged={props.onTreeExpandChanged}
                onEditingCanceled={props.onEditingCanceled}
                onEditingApproved={props.onEditingApproved}
                hasAnyEditingRow={props.hasAnyEditingRow}
                cellEditable={props.cellEditable}
                onCellEditStarted={props.onCellEditStarted}
                onCellEditFinished={props.onCellEditFinished}
                scrollWidth={props.scrollWidth}
                treeDataMaxLevel={props.treeDataMaxLevel}
              />
            );
          }
        });
      }
    }

    const freeCells = [];
    for (let i = 0; i < props.level; i++) {
      freeCells.push(<TableCell padding="checkbox" key={i} />);
    }

    let value = props.groupData.value;
    if (column.lookup) {
      value = column.lookup[value];
    }

    let title = column.title;
    if (typeof props.options.groupTitle === 'function') {
      title = props.options.groupTitle(props.groupData);
    } else if (typeof title !== 'string') {
      title = React.cloneElement(title);
    }

    const separator = props.options.groupRowSeparator || ': ';

    const showSelectGroupCheckbox =
      props.options.selection && props.options.showSelectGroupCheckbox;

    const mapSelectedRows = (groupData) => {
      let totalRows = 0;
      let selectedRows = 0;

      if (showSelectGroupCheckbox) {
        if (groupData.data.length) {
          totalRows += groupData.data.length;
          groupData.data.forEach(
            (row) => row.tableData.checked && selectedRows++
          );
        } else {
          groupData.groups.forEach((group) => {
            const [groupTotalRows, groupSelectedRows] = mapSelectedRows(group);

            totalRows += groupTotalRows;
            selectedRows += groupSelectedRows;
          });
        }
      }

      return [totalRows, selectedRows];
    };

    const [totalRows, selectedRows] = mapSelectedRows(props.groupData);

    return (
      <>
        <TableRow ref={props.forwardedRef}>
          {freeCells}
          <props.components.Cell
            colSpan={colSpan}
            padding="none"
            columnDef={column}
            value={value}
            icons={props.icons}
          >
            <>
              <IconButton
                style={{
                  transition: 'all ease 200ms',
                  ...rotateIconStyle(props.groupData.isExpanded)
                }}
                onClick={(event) => {
                  props.onGroupExpandChanged(props.path);
                }}
              >
                <props.icons.DetailPanel />
              </IconButton>
              {showSelectGroupCheckbox && (
                <Checkbox
                  indeterminate={selectedRows > 0 && totalRows !== selectedRows}
                  checked={totalRows === selectedRows}
                  onChange={(event, checked) =>
                    props.onGroupSelected &&
                    props.onGroupSelected(checked, props.groupData.path)
                  }
                  style={{ marginRight: 8 }}
                />
              )}
              <b>
                {title}
                {separator}
              </b>
            </>
          </props.components.Cell>
        </TableRow>
        {detail}
      </>
    );
  }

  return render();
}

MTableGroupRow.defaultProps = {
  columns: [],
  groups: [],
  level: 0,
  options: {}
};

MTableGroupRow.propTypes = {
  actions: PropTypes.array,
  columns: PropTypes.arrayOf(PropTypes.object),
  components: PropTypes.object,
  cellEditable: PropTypes.object,
  detailPanel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  forwardedRef: PropTypes.element,
  getFieldValue: PropTypes.func,
  groupData: PropTypes.object,
  groups: PropTypes.arrayOf(PropTypes.object),
  hasAnyEditingRow: PropTypes.bool,
  icons: PropTypes.object,
  isTreeData: PropTypes.bool.isRequired,
  level: PropTypes.number,
  localization: PropTypes.object,
  onBulkEditRowChanged: PropTypes.func,
  onCellEditFinished: PropTypes.func,
  onCellEditStarted: PropTypes.func,
  onEditingApproved: PropTypes.func,
  onEditingCanceled: PropTypes.func,
  onGroupExpandChanged: PropTypes.func,
  onRowClick: PropTypes.func,
  onGroupSelected: PropTypes.func,
  onRowSelected: PropTypes.func,
  onToggleDetailPanel: PropTypes.func.isRequired,
  onTreeExpandChanged: PropTypes.func.isRequired,
  options: PropTypes.object,
  path: PropTypes.arrayOf(PropTypes.number),
  scrollWidth: PropTypes.number.isRequired,
  treeDataMaxLevel: PropTypes.number
};

export default React.forwardRef(function MTableGroupRowRef(props, ref) {
  return <MTableGroupRow {...props} forwardedRef={ref} />;
});
