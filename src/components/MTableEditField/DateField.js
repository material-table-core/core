import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

export default function DateField({
  columnDef,
  value,
  onChange,
  locale,
  ...rest
}) {
  const getProps = () => {
    const {
      columnDef,
      rowData,
      onRowDataChange,
      errorState,
      onBulkEditRowChanged,
      scrollWidth,
      ...remaining
    } = rest;
    return remaining;
  };

  const dateFormat =
    columnDef.dateSetting && columnDef.dateSetting.format
      ? columnDef.dateSetting.format
      : 'dd.MM.yyyy';

  const datePickerProps = getProps();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
      <DatePicker
        {...datePickerProps}
        format={dateFormat}
        value={value || null}
        onChange={onChange}
        clearable
        InputProps={{
          style: {
            fontSize: 13
          }
        }}
        inputProps={{
          'aria-label': `${columnDef.title}: press space to edit`
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
