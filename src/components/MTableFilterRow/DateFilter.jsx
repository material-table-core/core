import React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getLocalizedFilterPlaceHolder } from './utils';
import {
  DatePicker,
  DateTimePicker,
  TimePicker,
  LocalizationProvider
} from '@mui/x-date-pickers';

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
    slotProps: {
      field: { clearable: true },
      textField: {
        placeholder: getLocalizedFilterPlaceHolder(columnDef, localization)
      }
    }
  };
  let dateInputElement = null;
  if (columnDef.type === 'date') {
    dateInputElement = <DatePicker {...pickerProps} ref={forwardedRef} />;
  } else if (columnDef.type === 'datetime') {
    dateInputElement = <DateTimePicker {...pickerProps} ref={forwardedRef} />;
  } else if (columnDef.type === 'time') {
    dateInputElement = <TimePicker {...pickerProps} ref={forwardedRef} />;
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={localization.dateTimePickerLocalization}
    >
      {dateInputElement}
    </LocalizationProvider>
  );
}

export default React.forwardRef(function DateFilterRef(props, ref) {
  return <DateFilter {...props} forwardedRef={ref} />;
});
