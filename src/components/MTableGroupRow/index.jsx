import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import PropTypes from 'prop-types';
import React from 'react';
import { useOptionStore, useIconStore } from '@store';

function MTableGroupRow({
  columns = defaultProps.columns,
  groups = defaultProps.groups,
  level = 0,
  ...props
}) {
  const options = useOptionStore();
  const icons = useIconStore();
  const rotateIconStyle = (isOpen) => ({
    transform: isOpen ? 'rotate(90deg)' : 'none'
  });

  let colSpan = columns.filter((columnDef) => !columnDef.hidden).length;
  options.selection && colSpan++;
  props.detailPanel && colSpan++;
  props.actions && props.actions.length > 0 && colSpan++;
  const column = groups[level];

  let detail;
  if (props.groupData.isExpanded) {
    if (groups.length > level + 1) {
      // Is there another group
      detail = props.groupData.groups.map((groupData, index) => (
        <props.components.GroupRow
          actions={props.actions}
          key={groupData.value || '' + index}
          columns={columns}
          components={props.components}
          detailPanel={props.detailPanel}
          getFieldValue={props.getFieldValue}
          groupData={groupData}
          groups={groups}
          level={level + 1}
          path={[...props.path, index]}
          onGroupExpandChanged={props.onGroupExpandChanged}
          onGroupSelected={props.onGroupSelected}
          onRowSelected={props.onRowSelected}
          onRowClick={props.onRowClick}
          onToggleDetailPanel={props.onToggleDetailPanel}
          onTreeExpandChanged={props.onTreeExpandChanged}
          onEditingCanceled={props.onEditingCanceled}
          onEditingApproved={props.onEditingApproved}
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
              columns={columns}
              components={props.components}
              data={rowData}
              path={[...props.path, rowData.tableData.uuid]}
              localization={props.localization}
              key={index}
              mode={rowData.tableData.editing}
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
              columns={columns}
              components={props.components}
              data={rowData}
              detailPanel={props.detailPanel}
              level={level + 1}
              getFieldValue={props.getFieldValue}
              path={[...props.path, rowData.tableData.uuid]}
              onRowSelected={props.onRowSelected}
              onRowClick={props.onRowClick}
              onToggleDetailPanel={props.onToggleDetailPanel}
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
  for (let i = 0; i < level; i++) {
    freeCells.push(<TableCell padding="checkbox" key={i} />);
  }

  let value = props.groupData.value;
  if (column.lookup) {
    value = column.lookup[value];
  }

  let title = column.title;
  if (typeof options.groupTitle === 'function') {
    title = options.groupTitle(props.groupData);
  } else if (typeof column.groupTitle === 'function') {
    title = column.groupTitle(props.groupData);
  } else if (typeof title !== 'string') {
    title = React.cloneElement(title);
  }

  const separator = options.groupRowSeparator || ': ';

  const showSelectGroupCheckbox =
    options.selection && options.showSelectGroupCheckbox;

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

  if (options.showGroupingCount) {
    value += ` (${props.groupData.data?.length ?? 0})`;
  }
  return (
    <>
      <TableRow ref={props.forwardedRef}>
        {freeCells}
        <props.components.Cell
          colSpan={colSpan}
          padding="none"
          columnDef={column}
          value={value}
          icons={icons}
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
              size="large"
            >
              <icons.DetailPanel row={props} level={props.path.length - 1} />
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

const defaultProps = {
  columns: [],
  groups: []
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
  path: PropTypes.arrayOf(PropTypes.number),
  scrollWidth: PropTypes.number.isRequired,
  treeDataMaxLevel: PropTypes.number
};

export default React.forwardRef(function MTableGroupRowRef(props, ref) {
  return <MTableGroupRow {...props} forwardedRef={ref} />;
});
