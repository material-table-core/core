/**
 *
 * THIS FILE IS NOT IN USE RIGHT NOW DUE TO REFACTORING ISSUES!
 *
 *
 *
 *
 * PLEASE SEE THE FOLLOWING FILE, AS IT IS THE PROD VERSION OF `MTableEditCell`:
 *
 *   https://github.com/material-table-core/core/blob/master/src/components/m-table-edit-cell.js
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TableCell, CircularProgress } from '@mui/material';

function MTableEditCell(props) {
  const [state, setState] = useState(() => ({
    isLoading: false,
    value: props.rowData[props.columnDef.field]
  }));

  useEffect(() => {
    props.cellEditable
      .onCellEditApproved(
        state.value, // newValue
        props.rowData[props.columnDef.field], // oldValue
        props.rowData, // rowData with old value
        props.columnDef // columnDef
      )
      .then(() => {
        setState({ ...state, isLoading: false });
        props.onCellEditFinished(props.rowData, props.columnDef);
      })
      .catch(() => {
        setState({ ...state, isLoading: false });
      });
  }, []);

  const getStyle = () => {
    let cellStyle = {
      boxShadow: '2px 0px 15px rgba(125,147,178,.25)',
      color: 'inherit',
      width: props.columnDef.tableData.width,
      boxSizing: 'border-box',
      fontSize: 'inherit',
      fontFamily: 'inherit',
      fontWeight: 'inherit',
      padding: '0 16px'
    };

    if (typeof props.columnDef.cellStyle === 'function') {
      cellStyle = {
        ...cellStyle,
        ...props.columnDef.cellStyle(state.value, props.rowData)
      };
    } else {
      cellStyle = { ...cellStyle, ...props.columnDef.cellStyle };
    }

    if (typeof props.cellEditable.cellStyle === 'function') {
      cellStyle = {
        ...cellStyle,
        ...props.cellEditable.cellStyle(
          state.value,
          props.rowData,
          props.columnDef
        )
      };
    } else {
      cellStyle = { ...cellStyle, ...props.cellEditable.cellStyle };
    }

    return cellStyle;
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      onApprove();
    } else if (e.keyCode === 27) {
      onCancel();
    }
  };

  const onApprove = () => {
    setState({ ...state, isLoading: true });
  };

  const onCancel = () => {
    props.onCellEditFinished(props.rowData, props.columnDef);
  };

  function renderActions() {
    if (state.isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', width: 60 }}>
          <CircularProgress size={20} />
        </div>
      );
    }

    const actions = [
      {
        icon: props.icons.Check,
        tooltip: props.localization && props.localization.saveTooltip,
        onClick: onApprove,
        disabled: state.isLoading
      },
      {
        icon: props.icons.Clear,
        tooltip: props.localization && props.localization.cancelTooltip,
        onClick: onCancel,
        disabled: state.isLoading
      }
    ];

    return (
      <props.components.Actions
        actions={actions}
        components={props.components}
        size="small"
      />
    );
  }

  return (
    <TableCell
      size={props.size}
      style={getStyle()}
      padding="none"
      ref={props.forwardedRef}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, marginRight: 4 }}>
          <props.components.EditField
            columnDef={props.columnDef}
            value={state.value}
            onChange={(prevState, value) => setState({ ...prevState, value })}
            onKeyDown={handleKeyDown}
            disabled={state.isLoading}
            rowData={props.rowData}
            autoFocus
          />
        </div>
        {renderActions()}
      </div>
    </TableCell>
  );
}

MTableEditCell.defaultProps = {
  columnDef: {},
  localization: {
    saveTooltip: 'Save',
    cancelTooltip: 'Cancel'
  }
};

MTableEditCell.propTypes = {
  cellEditable: PropTypes.object.isRequired,
  columnDef: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,
  errorState: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  icons: PropTypes.object.isRequired,
  localization: PropTypes.object.isRequired,
  onCellEditFinished: PropTypes.func.isRequired,
  rowData: PropTypes.object.isRequired,
  size: PropTypes.string,
  forwardedRef: PropTypes.element
};

export default React.forwardRef(function MTableEditCellRef(props, ref) {
  return <MTableEditCell {...props} forwardedRef={ref} />;
});
