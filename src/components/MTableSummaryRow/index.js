import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { TableRow, TableCell } from '@material-ui/core';
import { getStyle } from '../MTableCell/utils';
import PropTypes from 'prop-types';

export function MTableSummaryRow({
  data,
  columns,
  currentData,
  renderSummaryRow
}) {
  if (!renderSummaryRow) {
    return null;
  }
  return (
    <TableRow>
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
