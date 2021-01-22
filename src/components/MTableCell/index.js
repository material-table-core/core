/* eslint-disable no-unused-vars */
import * as React from 'react';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';
import { getRenderValue, getStyle } from './utils';
/* eslint-enable no-unused-vars */

function MTableCell(props) {
  const handleClickCell = (e) => {
    if (props.columnDef.disableClick) {
      e.stopPropagation();
    }
  };

  const cellAlignment =
    props.columnDef.align !== undefined
      ? props.columnDef.align
      : ['numeric', 'currency'].indexOf(props.columnDef.type) !== -1
      ? 'right'
      : 'left';

  let renderValue = getRenderValue(props);

  if (props.cellEditable) {
    renderValue = (
      <div
        style={{
          borderBottom: '1px dashed grey',
          cursor: 'pointer',
          width: 'max-content'
        }}
        onClick={(e) => {
          e.stopPropagation();
          props.onCellEditStarted(props.rowData, props.columnDef);
        }}
      >
        {renderValue}
      </div>
    );
  }

  return (
    <TableCell
      size={props.size}
      value={props.value}
      style={getStyle(props)}
      align={cellAlignment}
      onClick={handleClickCell}
      ref={props.forwardedRef}
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
  forwardedRef: PropTypes.element,
  size: PropTypes.number,
  children: PropTypes.element,
  cellEditable: PropTypes.bool,
  onCellEditStarted: PropTypes.func
};

export default React.forwardRef(function MTableCellRef(props, ref) {
  return <MTableCell {...props} forwardedRef={ref} />;
});
