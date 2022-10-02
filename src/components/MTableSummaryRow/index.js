import * as React from 'react';
import { TableRow, TableCell } from '@mui/material';
import { getStyle } from '@utils';
import * as CommonValues from '@utils/common-values';
import { useOptionStore } from '@store';
import PropTypes from 'prop-types';

export function MTableSummaryRow({ columns, rowProps, renderSummaryRow }) {
  const options = useOptionStore();
  if (!renderSummaryRow) {
    return null;
  }

  function renderPlaceholderColumn(key, numIcons = 1) {
    const size = CommonValues.elementSize({ ...rowProps, options });
    const width =
      numIcons * CommonValues.baseIconSize({ ...rowProps, options });
    return (
      <TableCell
        key={`placeholder.${key}`}
        size={size}
        padding="none"
        style={{
          width: width,
          padding: '0px 5px',
          boxSizing: 'border-box'
        }}
      />
    );
  }
  const placeholderLeftColumns = [];
  const placeholderRightColumns = [];
  let placeholderKey = 0;

  // Create empty columns corresponding to selection, actions, detail panel, and tree data icons
  if (options.selection) {
    placeholderLeftColumns.push(renderPlaceholderColumn(placeholderKey++));
  }
  if (
    rowProps.actions &&
    rowProps.actions.filter(
      (a) => a.position === 'row' || typeof a === 'function'
    ).length > 0
  ) {
    const numRowActions = CommonValues.rowActions(rowProps).length;
    if (options.actionsColumnIndex === -1) {
      placeholderRightColumns.push(
        renderPlaceholderColumn(placeholderKey++, numRowActions)
      );
    } else if (options.actionsColumnIndex >= 0) {
      placeholderLeftColumns.push(
        renderPlaceholderColumn(placeholderKey++, numRowActions)
      );
    }
  }
  if (rowProps.detailPanel && options.showDetailPanelIcon) {
    if (options.detailPanelColumnAlignment === 'right') {
      placeholderRightColumns.push(renderPlaceholderColumn(placeholderKey++));
    } else {
      placeholderLeftColumns.push(renderPlaceholderColumn(placeholderKey++));
    }
  }
  if (rowProps.isTreeData) {
    placeholderLeftColumns.push(renderPlaceholderColumn(placeholderKey++));
  }

  return (
    <TableRow>
      {placeholderLeftColumns}
      {columns.map((column, index) => {
        const summaryColumn = renderSummaryRow({
          index,
          column,
          columns
        });
        const cellAlignment =
          column.align !== undefined
            ? column.align
            : ['numeric', 'currency'].indexOf(column.type) !== -1
            ? 'right'
            : 'left';

        let value = '';
        let style = getStyle({ columnDef: column, scrollWidth: 0 });

        if (typeof summaryColumn === 'object' && summaryColumn !== null) {
          value = summaryColumn.value;
          style = summaryColumn.style;
        } else {
          value = summaryColumn;
        }
        return (
          <TableCell key={index} style={style} align={cellAlignment}>
            {value}
          </TableCell>
        );
      })}
      {placeholderRightColumns}
    </TableRow>
  );
}

MTableSummaryRow.propTypes = {
  columns: PropTypes.array,
  renderSummaryRow: PropTypes.func
};

export default MTableSummaryRow;
