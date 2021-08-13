import React from 'react';
import parseISO from 'date-fns/parseISO';

/* eslint-disable no-useless-escape */
export const isoDateRegex = /^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])([T\s](([01]\d|2[0-3])\:[0-5]\d|24\:00)(\:[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3])\:?([0-5]\d)?)?)?$/;
/* eslint-enable no-useless-escape */

export function getEmptyValue(emptyValue = '', props = {}) {
  if (typeof emptyValue === 'function') {
    return props.columnDef.emptyValue(props.rowData);
  } else {
    return emptyValue;
  }
}

export function getCurrencyValue(currencySetting, value) {
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

export function getRenderValue(props) {
  const dateLocale =
    props.columnDef.dateSetting && props.columnDef.dateSetting.locale
      ? props.columnDef.dateSetting.locale
      : undefined;
  if (
    props.columnDef.emptyValue !== undefined &&
    (props.value === undefined || props.value === null)
  ) {
    return getEmptyValue(props.columnDef.emptyValue, props);
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
