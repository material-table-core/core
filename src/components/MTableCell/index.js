/* eslint-disable no-unused-vars */
import React from 'react';
import TableCell from '@mui/material/TableCell';
import PropTypes from 'prop-types';
import { getRenderValue, getStyle } from './utils';
/* eslint-enable no-unused-vars */

function MTableCell(props) {
  const {
    forwardedRef,
    scrollWidth,
    rowData,
    onCellEditStarted,
    cellEditable,
    columnDef,
    errorState,
    ...spreadProps
  } = props;
  const handleClickCell = (e) => {
    if (props.columnDef.disableClick) {
      e.stopPropagation();
    }
  };

  const cellAlignment =
    columnDef.align !== undefined
      ? columnDef.align
      : ['numeric', 'currency'].indexOf(columnDef.type) !== -1
      ? 'right'
      : 'left';

  let renderValue = getRenderValue(props);

  if (cellEditable) {
    renderValue = (
      <div
        style={{
          borderBottom: '1px dashed grey',
          cursor: 'pointer',
          width: 'max-content'
        }}
        onClick={(e) => {
          e.stopPropagation();
          onCellEditStarted(rowData, columnDef);
        }}
      >
        {renderValue}
      </div>
    );
  }

  return (
    <TableCell
      {...spreadProps}
      size={props.size}
      value={props.value}
      style={getStyle(props)}
      align={cellAlignment}
      onClick={handleClickCell}
      ref={forwardedRef}
      colSpan={props.colSpan}
    >
      {props.children}
      {renderValue}
    </TableCell>
  );
}

MTableCell.defaultProps = {
  columnDef: {},
  value: undefined
};

MTableCell.propTypes = {
  columnDef: PropTypes.object.isRequired,
  value: PropTypes.any,
  rowData: PropTypes.object,
  errorState: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  forwardedRef: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  size: PropTypes.string,
  colSpan: PropTypes.number,
  children: PropTypes.element,
  cellEditable: PropTypes.bool,
  onCellEditStarted: PropTypes.func
};

export default React.forwardRef(function MTableCellRef(props, ref) {
  return <MTableCell {...props} forwardedRef={ref} />;
});
