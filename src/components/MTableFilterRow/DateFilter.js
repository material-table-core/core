import React from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { getLocalizedFilterPlaceHolder } from './utils';
import {
  DatePicker,
  DateTimePicker,
  TimePicker,
  LocalizationProvider
} from '@mui/lab';

function DateFilter({
  columnDef,
  onFilterChanged,
  localization,
  forwardedRef
}) {
  const onDateInputChange = (date) =>
    onFilterChanged(columnDef.tableData.id, date);

  const pickerProps = {
    value: columnDef.tableData.filterValue || null,
    onChange: onDateInputChange,
    placeholder: getLocalizedFilterPlaceHolder(columnDef, localization),
    clearable: true
  };
  let dateInputElement = null;
  if (columnDef.type === 'date') {
    dateInputElement = (
      <DatePicker
        {...pickerProps}
        ref={forwardedRef}
        renderInput={(params) => <TextField {...params} />}
      />
    );
  } else if (columnDef.type === 'datetime') {
    dateInputElement = (
      <DateTimePicker
        {...pickerProps}
        ref={forwardedRef}
        renderInput={(params) => <TextField {...params} />}
      />
    );
  } else if (columnDef.type === 'time') {
    dateInputElement = (
      <TimePicker
        {...pickerProps}
        ref={forwardedRef}
        renderInput={(params) => <TextField {...params} />}
      />
    );
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      locale={localization.dateTimePickerLocalization}
    >
      {dateInputElement}
    </LocalizationProvider>
  );
}

export default React.forwardRef(function DateFilterRef(props, ref) {
  return <DateFilter {...props} forwardedRef={ref} />;
});
