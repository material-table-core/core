import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
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
  options: {},
  level: 0
};

MTableGroupRow.propTypes = {
  actions: PropTypes.array,
  columns: PropTypes.arrayOf(PropTypes.object),
  components: PropTypes.object,
  detailPanel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  getFieldValue: PropTypes.func,
  groupData: PropTypes.object,
  groups: PropTypes.arrayOf(PropTypes.object),
  hasAnyEditingRow: PropTypes.bool,
  icons: PropTypes.object,
  isTreeData: PropTypes.bool.isRequired,
  level: PropTypes.number,
  localization: PropTypes.object,
  onGroupExpandChanged: PropTypes.func,
  onRowSelected: PropTypes.func,
  onRowClick: PropTypes.func,
  onToggleDetailPanel: PropTypes.func.isRequired,
  onTreeExpandChanged: PropTypes.func.isRequired,
  onEditingCanceled: PropTypes.func,
  onEditingApproved: PropTypes.func,
  options: PropTypes.object,
  path: PropTypes.arrayOf(PropTypes.number),
  scrollWidth: PropTypes.number.isRequired,
  cellEditable: PropTypes.object,
  onCellEditStarted: PropTypes.func,
  onCellEditFinished: PropTypes.func,
  onBulkEditRowChanged: PropTypes.func,
  forwardedRef: PropTypes.element
};

export default React.forwardRef(function MTableGroupRowRef(props, ref) {
  return <MTableGroupRow {...props} forwardedRef={ref} />;
});
