import React from 'react';
import PropTypes from 'prop-types';
import DateFilter from './DateFilter';
import LookupFilter from './LookupFilter';
import DefaultFilter from './DefaultFilter';
import BooleanFilter from './BooleanFilter';
import Filter from './Filter';
import { TableCell, TableRow } from '@mui/material';
import { useOptionStore } from '@store/LocalizationStore';

/**
 * MTableFilterRow is the row that is shown when `MaterialTable.options.filtering` is true.
 * This component allows you to provide a custom filtering algo or allow/disallow filtering for a column.
 *
 * THIS MUST BE EXPORTED (on top of the 'default' export)
 */
export function MTableFilterRow({
  columns: propColumns = defaultProps.columns,
  hasActions = false,
  ...props
}) {
  const options = useOptionStore();
  function getComponentForColumn(columnDef) {
    if (columnDef.filtering === false) {
      return null;
    }
    if (columnDef.field || columnDef.customFilterAndSearch) {
      if (columnDef.filterComponent) {
        return <Filter columnDef={columnDef} {...props} />;
      } else if (columnDef.lookup) {
        return <LookupFilter columnDef={columnDef} {...props} />;
      } else if (columnDef.type === 'boolean') {
        return <BooleanFilter columnDef={columnDef} {...props} />;
      } else if (['date', 'datetime', 'time'].includes(columnDef.type)) {
        return <DateFilter columnDef={columnDef} {...props} />;
      } else {
        return <DefaultFilter columnDef={columnDef} {...props} />;
      }
    }
  }

  const columns = propColumns
    .filter(
      (columnDef) => !columnDef.hidden && !(columnDef.tableData.groupOrder > -1)
    )
    .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
    .map((columnDef) => (
      <TableCell
        key={columnDef.tableData.id}
        style={{
          ...options.filterCellStyle,
          ...columnDef.filterCellStyle
        }}
      >
        {getComponentForColumn(columnDef)}
      </TableCell>
    ));

  if (options.selection) {
    columns.splice(
      0,
      0,
      <TableCell padding="none" key="key-selection-column" />
    );
  }

  if (hasActions) {
    if (options.actionsColumnIndex === -1) {
      columns.push(<TableCell key="key-action-column" />);
    } else {
      let endPos = 0;
      if (props.selection) {
        endPos = 1;
      }
      columns.splice(
        options.actionsColumnIndex + endPos,
        0,
        <TableCell key="key-action-column" />
      );
    }
  }

  if (props.hasDetailPanel && options.showDetailPanelIcon) {
    const index =
      options.detailPanelColumnAlignment === 'left' ? 0 : columns.length;
    columns.splice(
      index,
      0,
      <TableCell padding="none" key="key-detail-panel-column" />
    );
  }

  if (props.isTreeData > 0) {
    columns.splice(
      0,
      0,
      <TableCell padding="none" key={'key-tree-data-filter'} />
    );
  }

  propColumns
    .filter((columnDef) => columnDef.tableData.groupOrder > -1)
    .forEach((columnDef) => {
      columns.splice(
        0,
        0,
        <TableCell
          padding="checkbox"
          key={'key-group-filter' + columnDef.tableData.id}
        />
      );
    });

  return (
    <TableRow
      id="m--table--filter--row"
      ref={props.forwardedRef}
      style={{ height: 10, ...options.filterRowStyle }}
    >
      {columns}
    </TableRow>
  );
}

const defaultProps = {
  columns: [],
  localization: {
    filterTooltip: 'Filter'
  }
};

MTableFilterRow.propTypes = {
  columns: PropTypes.array.isRequired,
  hasDetailPanel: PropTypes.bool.isRequired,
  isTreeData: PropTypes.bool.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  hasActions: PropTypes.bool,
  localization: PropTypes.object
};

export default React.forwardRef(function MTableFilterRowRef(props, ref) {
  return <MTableFilterRow {...props} forwardedRef={ref} />;
});

export { defaultProps };
