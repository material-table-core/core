import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';
import parseISO from 'date-fns/parseISO';
import { reducePercentsInCalc } from '../../utils/common-values';

const isoDateRegex = /^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])([T\s](([01]\d|2[0-3])\:[0-5]\d|24\:00)(\:[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3])\:?([0-5]\d)?)?)?$/;

export default function MTableCell({
  icons,
  columnDef,
  value,
  size,
  style,
  children,
  rowData,
  errorState,
  cellEditable,
  onCellEditStarted,
  scrollWidth,
  ...cellProps
}) {
  const cellAlignment =
    columnDef.align !== undefined
      ? columnDef.align
      : ['numeric', 'currency'].indexOf(columnDef.type) !== -1
      ? 'right'
      : 'left';

  let renderValue = getRenderValue();
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

  function getRenderValue() {
    const dateLocale =
      columnDef.dateSetting && columnDef.dateSetting.locale
        ? columnDef.dateSetting.locale
        : undefined;
    if (
      columnDef.emptyValue !== undefined &&
      (value === undefined || value === null)
    ) {
      return getEmptyValue(columnDef.emptyValue);
    }
    if (columnDef.render) {
      if (rowData) {
        return columnDef.render(rowData, 'row');
      } else if (value) {
        return columnDef.render(value, 'group');
      }
    } else if (columnDef.type === 'boolean') {
      const style = { textAlign: 'left', verticalAlign: 'middle', width: 48 };
      if (value) {
        return <icons.Check style={style} />;
      } else {
        return <icons.ThirdStateCheck style={style} />;
      }
    } else if (columnDef.type === 'date') {
      if (value instanceof Date) {
        return value.toLocaleDateString(dateLocale);
      } else if (isoDateRegex.exec(value)) {
        return parseISO(value).toLocaleDateString(dateLocale);
      } else {
        return value;
      }
    } else if (columnDef.type === 'time') {
      if (value instanceof Date) {
        return value.toLocaleTimeString();
      } else if (isoDateRegex.exec(value)) {
        return parseISO(value).toLocaleTimeString(dateLocale);
      } else {
        return value;
      }
    } else if (columnDef.type === 'datetime') {
      if (value instanceof Date) {
        return value.toLocaleString();
      } else if (isoDateRegex.exec(value)) {
        return parseISO(value).toLocaleString(dateLocale);
      } else {
        return value;
      }
    } else if (columnDef.type === 'currency') {
      return getCurrencyValue(columnDef.currencySetting, value);
    } else if (typeof value === 'boolean') {
      // To avoid forwardref boolean children.
      return value.toString();
    }

    return value;
  }

  function getEmptyValue(emptyValue) {
    if (typeof emptyValue === 'function') {
      return columnDef.emptyValue(rowData);
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
              : 2
        }
      ).format(value !== undefined ? value : 0);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value !== undefined ? value : 0);
    }
  }

  const handleClickCell = (e) => {
    if (columnDef.disableClick) {
      e.stopPropagation();
    }
  };

  const getStyle = () => {
    const width = reducePercentsInCalc(columnDef.tableData.width, scrollWidth);

    let cellStyle = {
      color: 'inherit',
      width,
      maxWidth: columnDef.maxWidth,
      minWidth: columnDef.minWidth,
      boxSizing: 'border-box',
      fontSize: 'inherit',
      fontFamily: 'inherit',
      fontWeight: 'inherit'
    };

    if (typeof columnDef.cellStyle === 'function') {
      cellStyle = {
        ...cellStyle,
        ...columnDef.cellStyle(value, rowData)
      };
    } else {
      cellStyle = { ...cellStyle, ...columnDef.cellStyle };
    }

    if (columnDef.disableClick) {
      cellStyle.cursor = 'default';
    }

    return { ...style, ...cellStyle };
  };

  return (
    <TableCell
      size={size}
      {...cellProps}
      style={getStyle()}
      align={cellAlignment}
      onClick={handleClickCell}
    >
      {children}
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
  errorState: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};
