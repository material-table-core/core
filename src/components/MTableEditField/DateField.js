import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';

function DateField({
  columnDef,
  value,
  onChange,
  locale,
  forwardedRef,
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
    <LocalizationProvider dateAdapter={DateFnsUtils} locale={locale}>
      <DatePicker
        {...datePickerProps}
        ref={forwardedRef}
        format={dateFormat}
        value={value || null}
        onChange={onChange}
        clearable
        InputProps={{
          style: {
            fontSize: 13
          }
        }}
        renderInput={(params) => <TextField {...params} />}
        inputProps={{
          'aria-label': `${columnDef.title}: press space to edit`
        }}
      />
    </LocalizationProvider>
  );
}

export default React.forwardRef(function DateFieldRef(props, ref) {
  return <DateField {...props} forwardedRef={ref} />;
});
