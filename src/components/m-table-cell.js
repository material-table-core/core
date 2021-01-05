/* eslint-disable no-unused-vars */
import * as React from 'react';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';
import parseISO from 'date-fns/parseISO';
import * as CommonValues from '../utils/common-values';

/* eslint-enable no-unused-vars */

/* eslint-disable no-useless-escape */
const isoDateRegex = /^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])([T\s](([01]\d|2[0-3])\:[0-5]\d|24\:00)(\:[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3])\:?([0-5]\d)?)?)?$/;
/* eslint-enable no-useless-escape */

export default function MTableCell(props) {
  function getRenderValue() {
    const dateLocale =
      props.columnDef.dateSetting && props.columnDef.dateSetting.locale
        ? props.columnDef.dateSetting.locale
        : undefined;
    if (
      props.columnDef.emptyValue !== undefined &&
      (props.value === undefined || props.value === null)
    ) {
      return getEmptyValue(props.columnDef.emptyValue);
    }
    if (props.columnDef.render) {
      if (props.rowData) {
        return props.columnDef.render(props.rowData, 'row');
      } else if (props.value) {
        return props.columnDef.render(props.value, 'group');
      }
    } else if (props.columnDef.type === 'boolean') {
      const style = { textAlign: 'left', verticalAlign: 'middle', width: 48 };
      if (props.value) {
        return <props.icons.Check style={style} />;
      } else {
        return <props.icons.ThirdStateCheck style={style} />;
      }
    } else if (props.columnDef.type === 'date') {
      if (props.value instanceof Date) {
        return props.value.toLocaleDateString(dateLocale);
      } else if (isoDateRegex.exec(props.value)) {
        return parseISO(props.value).toLocaleDateString(dateLocale);
      } else {
        return props.value;
      }
    } else if (props.columnDef.type === 'time') {
      if (props.value instanceof Date) {
        return props.value.toLocaleTimeString();
      } else if (isoDateRegex.exec(props.value)) {
        return parseISO(props.value).toLocaleTimeString(dateLocale);
      } else {
        return props.value;
      }
    } else if (props.columnDef.type === 'datetime') {
      if (props.value instanceof Date) {
        return props.value.toLocaleString();
      } else if (isoDateRegex.exec(props.value)) {
        return parseISO(props.value).toLocaleString(dateLocale);
      } else {
        return props.value;
      }
    } else if (props.columnDef.type === 'currency') {
      return getCurrencyValue(props.columnDef.currencySetting, props.value);
    } else if (typeof props.value === 'boolean') {
      // To avoid forwardref boolean children.
      return props.value.toString();
    }

    return props.value;
  }

  function getEmptyValue(emptyValue) {
    if (typeof emptyValue === 'function') {
      return props.columnDef.emptyValue(props.rowData);
    } else {
      return emptyValue;
    }
  }

  function getCurrencyValue(currencySetting, value) {
    if (currencySetting !== undefined) {
      return new Intl.NumberFormat(
        currencySetting.locale !== undefined ? currencySetting.locale : 'en-US',
        {
          style: 'currency',
          currency:
            currencySetting.currencyCode !== undefined
              ? currencySetting.currencyCode
              : 'USD',
          minimumFractionDigits:
            currencySetting.minimumFractionDigits !== undefined
              ? currencySetting.minimumFractionDigits
              : 2,
          maximumFractionDigits:
            currencySetting.maximumFractionDigits !== undefined
              ? currencySetting.maximumFractionDigits
              : 2,
        }
      ).format(value !== undefined ? value : 0);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value !== undefined ? value : 0);
    }
  }

  const handleClickCell = (e) => {
    if (props.columnDef.disableClick) {
      e.stopPropagation();
    }
  };

  const getStyle = () => {
    const width = CommonValues.reducePercentsInCalc(
      props.columnDef.tableData.width,
      props.scrollWidth
    );

    let cellStyle = {
      color: 'inherit',
      width,
      maxWidth: props.columnDef.maxWidth,
      minWidth: props.columnDef.minWidth,
      boxSizing: 'border-box',
      fontSize: 'inherit',
      fontFamily: 'inherit',
      fontWeight: 'inherit',
    };

    if (typeof props.columnDef.cellStyle === 'function') {
      cellStyle = {
        ...cellStyle,
        ...props.columnDef.cellStyle(props.value, props.rowData),
      };
    } else {
      cellStyle = { ...cellStyle, ...props.columnDef.cellStyle };
    }

    if (props.columnDef.disableClick) {
      cellStyle.cursor = 'default';
    }

    return { ...props.style, ...cellStyle };
  };

  const {
    icons,
    columnDef,
    rowData,
    errorState,
    cellEditable,
    onCellEditStarted,
    scrollWidth,
    ...cellProps
  } = props;

  const cellAlignment =
    columnDef.align !== undefined
      ? columnDef.align
      : ['numeric', 'currency'].indexOf(props.columnDef.type) !== -1
      ? 'right'
      : 'left';

  let renderValue = getRenderValue();

  if (cellEditable) {
    renderValue = (
      <div
        style={{
          borderBottom: '1px dashed grey',
          cursor: 'pointer',
          width: 'max-content',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onCellEditStarted(props.rowData, props.columnDef);
        }}
      >
        {renderValue}
      </div>
    );
  }

  return (
    <TableCell
      size={props.size}
      {...cellProps}
      style={getStyle()}
      align={cellAlignment}
      onClick={handleClickCell}
    >
      {props.children}
      {renderValue}
    </TableCell>
  );
}

MTableCell.defaultProps = {
  columnDef: {},
  value: undefined,
};

MTableCell.propTypes = {
  columnDef: PropTypes.object.isRequired,
  value: PropTypes.any,
  rowData: PropTypes.object,
  errorState: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};
