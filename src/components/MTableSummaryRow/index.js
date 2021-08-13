import * as React from 'react';
import { TableRow, TableCell, withStyles } from '@material-ui/core';
import { getStyle } from '@utils';
import * as CommonValues from '@utils/common-values';
import PropTypes from 'prop-types';

export function MTableSummaryRow({
  data,
  columns,
  currentData,
  rowProps,
  renderSummaryRow
}) {
  if (!renderSummaryRow) {
    return null;
  }

  function renderPlaceholderColumn(key, numIcons = 1) {
    const size = CommonValues.elementSize(rowProps);
    const width = numIcons * CommonValues.baseIconSize(rowProps);
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
  if (rowProps.options.selection) {
    placeholderLeftColumns.push(renderPlaceholderColumn(placeholderKey++));
  }
  if (
    rowProps.actions &&
    rowProps.actions.filter(
      (a) => a.position === 'row' || typeof a === 'function'
    ).length > 0
  ) {
    const numRowActions = CommonValues.rowActions(rowProps).length;
    if (rowProps.options.actionsColumnIndex === -1) {
      placeholderRightColumns.push(
        renderPlaceholderColumn(placeholderKey++, numRowActions)
      );
    } else if (rowProps.options.actionsColumnIndex >= 0) {
      placeholderLeftColumns.push(
        renderPlaceholderColumn(placeholderKey++, numRowActions)
      );
    }
  }
  if (rowProps.detailPanel && rowProps.options.showDetailPanelIcon) {
    if (rowProps.options.detailPanelColumnAlignment === 'right') {
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
          data,
          currentData,
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

        if (summaryColumn && summaryColumn.value) {
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
  data: PropTypes.array,
  currentData: PropTypes.array,
  columns: PropTypes.array,
  renderSummaryRow: PropTypes.func
};

export const styles = (theme) => ({});

export default withStyles(styles)(MTableSummaryRow);
