/* eslint-disable no-unused-vars */
import * as React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from '@material-ui/core/CircularProgress';
import withTheme from '@material-ui/core/styles/withTheme';
/* eslint-enable no-unused-vars */

const MTableEditCell = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [value, setValue] = React.useState(
    props.rowData[props.columnDef.field]
  );

  const getStyle = () => {
    let cellStyle = {
      boxShadow: '2px 0px 15px rgba(125,147,178,.25)',
      color: 'inherit',
      width: props.columnDef.tableData.width,
      boxSizing: 'border-box',
      fontSize: 'inherit',
      fontFamily: 'inherit',
      fontWeight: 'inherit',
      padding: '0 16px',
    };

    if (typeof props.columnDef.cellStyle === 'function') {
      cellStyle = {
        ...cellStyle,
        ...props.columnDef.cellStyle(value, props.rowData),
      };
    } else {
      cellStyle = { ...cellStyle, ...props.columnDef.cellStyle };
    }

    if (typeof props.cellEditable.cellStyle === 'function') {
      cellStyle = {
        ...cellStyle,
        ...props.cellEditable.cellStyle(value, props.rowData, props.columnDef),
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
    setIsLoading(true, () => {
      props.cellEditable
        .onCellEditApproved(
          value, // newValue
          props.rowData[props.columnDef.field], // oldValue
          props.rowData, // rowData with old value
          props.columnDef // columnDef
        )
        .then(() => {
          setIsLoading(false);
          props.onCellEditFinished(props.rowData, props.columnDef);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    });
  };

  const onCancel = () => {
    props.onCellEditFinished(props.rowData, props.columnDef);
  };

  const renderActions = () => {
    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', width: 60 }}>
          <CircularProgress size={20} />
        </div>
      );
    }

    const actions = [
      {
        icon: props.icons.Check,
        tooltip: props.localization.saveTooltip,
        onClick: onApprove,
        disabled: isLoading,
      },
      {
        icon: props.icons.Clear,
        tooltip: props.localization.cancelTooltip,
        onClick: onCancel,
        disabled: isLoading,
      },
    ];

    return (
      <props.components.Actions
        actions={actions}
        components={props.components}
        size="small"
      />
    );
  };

  return (
    <TableCell size={props.size} style={getStyle()} padding="none">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, marginRight: 4 }}>
          <props.components.EditField
            columnDef={props.columnDef}
            value={value}
            onChange={(value) => setValue(value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rowData={props.rowData}
            autoFocus
          />
        </div>
        {renderActions()}
      </div>
    </TableCell>
  );
};

MTableEditCell.defaultProps = {
  columnDef: {},
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
};

export default withTheme(MTableEditCell);
